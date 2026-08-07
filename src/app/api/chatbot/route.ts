import { NextRequest, NextResponse } from 'next/server';
import { CHATBOT_SYSTEM_PROMPT } from '@/lib/chatbotPrompt';
import { getFallbackResponse } from '@/lib/chatbotFallback';
import { safeJsonBody } from '@/lib/requestUtils';
import { checkRateLimitByName, buildRateLimitHeaders } from '@/lib/rateLimit';
import {
  getGuardrailResponse,
  findFaqAnswer,
  getRelevantFaqContext,
} from '@/lib/faqData';
import { auth } from '@/auth';
import { jwtGuard } from '@/lib/jwtGuard';

export async function POST(req: NextRequest) {
  const jwtResult = await jwtGuard(req);
  if (jwtResult) return jwtResult;

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  // Rate limit by user ID (not IP)
  const cbResult = await checkRateLimitByName('chatbot', session.user.id);
  if (!cbResult.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again in a minute.' },
      { status: 429, headers: buildRateLimitHeaders(cbResult) }
    );
  }

  // Captured here so the catch block can build a graceful fallback without
  // re-reading the request body (the stream can only be consumed once).
  let message = '';

  try {
    // 1. Parse and Validate Input
    const bodyOrResponse = await safeJsonBody(req, { maxSizeKB: 50 });
    if (bodyOrResponse instanceof Response) return bodyOrResponse;
    const body = bodyOrResponse;
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }
    const { history, message: messageRaw } = body as Record<string, unknown>;
    message = typeof messageRaw === 'string' ? messageRaw : '';

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return NextResponse.json(
        { error: 'Message content cannot be empty.' },
        { status: 400 }
      );
    }

    if (message.length > 1000) {
      return NextResponse.json(
        { error: 'Message exceeds the 1000-character limit.' },
        { status: 400 }
      );
    }

    if (history && Array.isArray(history)) {
      const lastUserMsg = [...history].reverse().find((h: any) => h.role === 'user');
      if (lastUserMsg && lastUserMsg.content.trim() === message.trim()) {
        return NextResponse.json(
          { error: 'Please avoid sending the exact same message repeatedly.' },
          { status: 400 }
        );
      }
    }

    // 3. Mandatory guardrails first — these always win, no AI call.
    const guardrail = getGuardrailResponse(message);
    if (guardrail) {
      return NextResponse.json({ text: guardrail, isFaq: true });
    }

    // 4. Answer clear FAQ questions directly from the shared knowledge,
    //    skipping the external AI provider entirely (fast + consistent + no tokens).
    const faqMatch = findFaqAnswer(message);
    if (faqMatch) {
      return NextResponse.json({ text: faqMatch.answer, isFaq: true });
    }

    // 5. Load Environment Settings
    const apiKey = process.env.AI_CHATBOT_API_KEY;
    const provider = (process.env.AI_CHATBOT_PROVIDER || 'gemini').toLowerCase();
    const model = process.env.AI_CHATBOT_MODEL;

    // 6. Return Fallback Response if API key is not provided
    if (!apiKey || apiKey.trim() === '') {
      const fallbackText = getFallbackResponse(message);
      return NextResponse.json({ text: fallbackText });
    }

    // Inject only a SMALL set of relevant FAQ entries into the AI context so the
    // provider stays grounded without paying tokens for all 40+ answers.
    const faqContext = getRelevantFaqContext(message, 4);
    const systemPrompt = faqContext
      ? `${CHATBOT_SYSTEM_PROMPT}\n\n### Relevant Rishte Forever FAQ entries:\n${faqContext}`
      : CHATBOT_SYSTEM_PROMPT;

    // 7. Call External AI Provider
    const MAX_HISTORY = 50;
    async function timedFetch(url: string, options: RequestInit): Promise<Response> {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30_000);
      try {
        const response = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(timeoutId);
        return response;
      } catch (err) {
        clearTimeout(timeoutId);
        if (err instanceof Error && err.name === 'AbortError') {
          throw new Error('AI_SERVICE_TIMEOUT');
        }
        throw err;
      }
    }

    if (provider === 'gemini') {
      const geminiModel = model || 'gemini-1.5-flash';
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`;

      // Format conversation history for Gemini API
      // Roles must alternate between 'user' and 'model'
      const recentHistory = Array.isArray(history) ? history.slice(-MAX_HISTORY) : [];
      const contents = recentHistory.map((h: any) => ({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.content }]
      }));

      // Append current message
      contents.push({
        role: 'user',
        parts: [{ text: message }]
      });

      try {
        const response = await timedFetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents,
            systemInstruction: {
              parts: [{ text: systemPrompt }]
            },
            generationConfig: {
              maxOutputTokens: 800,
              temperature: 0.7
            }
          }),
        });

        if (!response.ok) {
          console.error(`Gemini API returned status ${response.status}`);
          throw new Error(`Gemini API returned status ${response.status}`);
        }

        const data = await response.json();
        const aiReply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!aiReply) {
          throw new Error('Empty response from Gemini API.');
        }

        return NextResponse.json({ text: aiReply });
      } catch (err) {
        if (err instanceof Error && err.message === 'AI_SERVICE_TIMEOUT') {
          return NextResponse.json(
            { error: 'AI service timed out. Please try again.' },
            { status: 504 }
          );
        }
        throw err;
      }
    }

    if (provider === 'openai') {
      const openaiModel = model || 'gpt-4o-mini';
      const url = 'https://api.openai.com/v1/chat/completions';

      const recentHistory = Array.isArray(history) ? history.slice(-MAX_HISTORY) : [];
      const messages = [
        { role: 'system', content: systemPrompt },
        ...recentHistory.map((h: any) => ({
          role: h.role === 'assistant' ? 'assistant' : 'user',
          content: h.content
        })),
        { role: 'user', content: message }
      ];

      try {
        const response = await timedFetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: openaiModel,
            messages,
            max_tokens: 800,
            temperature: 0.7
          })
        });

        if (!response.ok) {
          console.error(`OpenAI API returned status ${response.status}`);
          throw new Error(`OpenAI API returned status ${response.status}`);
        }

        const data = await response.json();
        const aiReply = data?.choices?.[0]?.message?.content;

        if (!aiReply) {
          throw new Error('Empty response from OpenAI API.');
        }

        return NextResponse.json({ text: aiReply });
      } catch (err) {
        if (err instanceof Error && err.message === 'AI_SERVICE_TIMEOUT') {
          return NextResponse.json(
            { error: 'AI service timed out. Please try again.' },
            { status: 504 }
          );
        }
        throw err;
      }
    }

    // Default catch for invalid provider configurations
    throw new Error(`Unsupported provider: ${provider}`);

  } catch (error) {
    console.error('Chatbot route execution error, reverting to fallback mode:', error);

    // Distinguish expected fallback scenarios from real unexpected errors
    const errorMessage = error instanceof Error ? error.message : String(error);
    const isExpectedError = /AI_SERVICE_TIMEOUT|Empty response|Unsupported provider/i.test(errorMessage);

    if (!isExpectedError) {
      console.error('[CHATBOT_UNEXPECTED_ERROR]', errorMessage);
    }

    const fallbackText = getFallbackResponse(message);
    return NextResponse.json({
      text: fallbackText,
    });
  }
}
