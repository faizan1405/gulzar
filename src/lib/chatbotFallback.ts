import {
  getGuardrailResponse,
  findFaqAnswer,
  SUPPORT_EMAIL,
} from './faqData';

/**
 * Offline / no-API-key fallback for the chatbot.
 *
 * This no longer keeps its own duplicated answer list. It delegates to the
 * shared FAQ knowledge in `faqData.ts` so answers stay consistent with the
 * public FAQ page and the online chatbot:
 *   1. Mandatory guardrails (religious rulings, private info, payment details).
 *   2. A confident FAQ match from the shared collection.
 *   3. A friendly generic prompt listing the topics we can help with.
 */
export function getFallbackResponse(message: string): string {
  // 1. Non-negotiable platform guardrails always win.
  const guardrail = getGuardrailResponse(message);
  if (guardrail) return guardrail;

  // 2. Direct answer from the shared FAQ knowledge.
  const faq = findFaqAnswer(message);
  if (faq) return faq.answer;

  // 3. Generic help prompt.
  return (
    'Assalamu Alaikum! I\'m the Rishte Forever assistant.\n\n' +
    'I can help with:\n' +
    '• Registration & Google sign-in\n' +
    '• Telephone verification & profile approval\n' +
    '• Photo & contact privacy\n' +
    '• Memberships & packages\n' +
    '• Staying safe & reporting profiles\n\n' +
    'Ask me about any of these, or email ' + SUPPORT_EMAIL + ' for more help.'
  );
}
