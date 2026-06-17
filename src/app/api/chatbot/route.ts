import { NextRequest, NextResponse } from 'next/server';
import { CHATBOT_SYSTEM_PROMPT } from '../../../lib/chatbotPrompt';
import { getFallbackResponse } from '../../../lib/chatbotFallback';

// Basic in-memory rate limiting map
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = 30; // Max 30 requests per minute
  const windowMs = 60 * 1000;

  const record = rateLimitMap.get(ip);
  if (!record) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return false;
  }

  if (now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return false;
  }

  record.count += 1;
  if (record.count > limit) {
    return true;
  }
  return false;
}

export async function POST(req: NextRequest) {
  try {
    // 1. Get Client IP for Rate Limiting
    const ip = (req as any).ip || req.headers.get('x-forwarded-for') || 'anonymous';
    if (checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again in a minute.' },
        { status: 429 }
      );
    }

    // 2. Parse and Validate Input
    const body = await req.json();
    const { message, history } = body;

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

    // 3. Load Environment Settings
    const apiKey = process.env.AI_CHATBOT_API_KEY;
    const provider = (process.env.AI_CHATBOT_PROVIDER || 'gemini').toLowerCase();
    const model = process.env.AI_CHATBOT_MODEL;

    // 4. Return Fallback Response if API key is not provided
    if (!apiKey || apiKey.trim() === '') {
      const fallbackText = getFallbackResponse(message);
      return NextResponse.json({ text: fallbackText, isDemo: true });
    }

    // 5. Call External AI Provider
    if (provider === 'gemini') {
      const geminiModel = model || 'gemini-1.5-flash';
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`;

      // Format conversation history for Gemini API
      // Roles must alternate between 'user' and 'model'
      const contents = (history || []).map((h: any) => ({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.content }]
      }));
      
      // Append current message
      contents.push({
        role: 'user',
        parts: [{ text: message }]
      });

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          systemInstruction: {
            parts: [{ text: CHATBOT_SYSTEM_PROMPT }]
          },
          generationConfig: {
            maxOutputTokens: 800,
            temperature: 0.7
          }
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini API Error Response:', errorText);
        throw new Error(`Gemini API returned status ${response.status}`);
      }

      const data = await response.json();
      const aiReply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!aiReply) {
        throw new Error('Empty response from Gemini API.');
      }

      return NextResponse.json({ text: aiReply, isDemo: false });
    } 
    
    if (provider === 'openai') {
      const openaiModel = model || 'gpt-4o-mini';
      const url = 'https://api.openai.com/v1/chat/completions';

      const messages = [
        { role: 'system', content: CHATBOT_SYSTEM_PROMPT },
        ...(history || []).map((h: any) => ({
          role: h.role === 'assistant' ? 'assistant' : 'user',
          content: h.content
        })),
        { role: 'user', content: message }
      ];

      const response = await fetch(url, {
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
        const errorText = await response.text();
        console.error('OpenAI API Error Response:', errorText);
        throw new Error(`OpenAI API returned status ${response.status}`);
      }

      const data = await response.json();
      const aiReply = data?.choices?.[0]?.message?.content;

      if (!aiReply) {
        throw new Error('Empty response from OpenAI API.');
      }

      return NextResponse.json({ text: aiReply, isDemo: false });
    }

    // Default catch for invalid provider configurations
    throw new Error(`Unsupported provider: ${provider}`);

  } catch (error) {
    // If the API call fails, log the error and fall back gracefully to the demo replies.
    console.error('Chatbot route execution error, reverting to fallback mode:', error);
    const body = await req.json().catch(() => ({}));
    const message = body?.message || '';
    const fallbackText = getFallbackResponse(message);
    return NextResponse.json({ 
      text: fallbackText, 
      isDemo: true,
      errorDetails: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
