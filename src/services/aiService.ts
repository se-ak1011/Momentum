/**
 * OpenAI-powered helpers for session summaries and follow-up suggestions.
 *
 * The OpenAI SDK is called directly from the device for simplicity in this MVP.
 * In production you should proxy calls through your own backend to keep the API
 * key off the client entirely.  Move the key to a server-side env var and expose
 * a POST /ai/summarize and POST /ai/suggestions endpoint instead.
 */

const OPENAI_BASE_URL = 'https://api.openai.com/v1';
const MODEL = 'gpt-4o-mini';

const getApiKey = (): string => process.env.EXPO_PUBLIC_OPENAI_API_KEY ?? '';

const post = async (endpoint: string, body: unknown): Promise<unknown> => {
  const key = getApiKey();
  if (!key) {
    throw new Error('EXPO_PUBLIC_OPENAI_API_KEY is not set.');
  }
  const res = await fetch(OPENAI_BASE_URL + endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + key,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error('OpenAI error ' + res.status.toString() + ': ' + text);
  }
  return res.json();
};

type ChatChoice = { message: { content: string | null } };
type ChatResponse = { choices: ChatChoice[] };

const chat = async (systemPrompt: string, userMessage: string): Promise<string> => {
  const data = (await post('/chat/completions', {
    model: MODEL,
    max_tokens: 256,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ],
  })) as ChatResponse;
  return data.choices[0]?.message.content?.trim() ?? '';
};

const SUMMARIZER_SYSTEM = [
  'You are a clinical note summarizer for a solo coach or therapist.',
  'Produce a concise 2-3 sentence summary of the session notes provided.',
  'Focus on key themes, progress, and agreed next steps.',
  'Never include personal identifying information.',
  'Reply in plain prose, no markdown.',
].join(' ');

/**
 * Generate a concise AI summary from raw session notes.
 */
export const summarizeSession = async (notes: string): Promise<string> => {
  if (!notes.trim()) {
    return '';
  }
  return chat(SUMMARIZER_SYSTEM, notes);
};

const FOLLOWUP_SYSTEM = [
  'You are a productivity assistant for solo coaches and consultants.',
  'Given a session summary, suggest up to 3 specific, actionable follow-up tasks for the client.',
  'Format as a plain numbered list. Be concise (10-15 words per item). No markdown.',
].join(' ');

/**
 * Generate up to 3 follow-up task suggestions from a session summary.
 * Returns an array of task title strings.
 */
export const suggestFollowUps = async (summary: string): Promise<string[]> => {
  if (!summary.trim()) {
    return [];
  }
  const raw = await chat(FOLLOWUP_SYSTEM, summary);
  return raw
    .split('\n')
    .map((line) => line.replace(/^\d+\.\s*/, '').trim())
    .filter((line) => line.length > 0)
    .slice(0, 3);
};
