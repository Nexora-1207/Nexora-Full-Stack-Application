import { NextResponse } from 'next/server';

const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY || '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';
const NVIDIA_API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';
const MODEL_NAME = 'meta/llama-3.2-11b-vision-instruct';

const NEXUS_AI_SYSTEM_PROMPT = `You are Nexus AI, the official academic, business & career guidance copilot in the Nexora platform.

YOUR MANDATE:
1. TYPO & SPELLING TOLERANCE (CRITICAL):
   - Users may type misspelled words, abbreviations, or typos (e.g., "ptyhon" -> Python, "c++" -> C++, "doploma" -> Polytechnic Diploma, "enineering" -> Engineering, "startp" -> Startup).
   - Automatically understand the user's intended subject and answer accurately.

2. STANDARDIZED RESPONSE FORMAT (MUST FOLLOW):
   Line 1: Capitalized Title (e.g., Python Programming Language or Polytechnic Lateral Entry Overview)
   Line 2+: Point-wise list using format: • Label: Explanation
   Standard Bullet Labels to include:
   • Overview: Brief definition or description.
   • Key Features: Main characteristics, advantages, or concepts.
   • Applications: Real-world usages, career options, or fields.
   • Use Cases: Practical examples, strategies, or action points.

3. NO MARKDOWN SYMBOLS RULE:
   - Do NOT output asterisks (*, **, ***) or hashtags (#). Use clean text.

4. REFUSAL RULE (OFF-TOPIC ONLY):
   - Refuse ONLY if the query is off-topic, silly, movies, gaming, entertainment, or gossip.
   - Refusal standard: "Nexus AI Specialization Notice\n\n• Notice: I am Nexus AI, specialized exclusively in educational, business, academic doubts, and career guidance. Please feel free to ask any question about your studies, exams, career path, or business concepts!"`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    // Format chat history and prepend system prompt
    const formattedMessages = [
      { role: 'system', content: NEXUS_AI_SYSTEM_PROMPT },
      ...messages.map((m: any) => ({
        role: m.sender === 'user' ? 'user' : m.role || 'assistant',
        content: m.text || m.content || ''
      }))
    ];

    const response = await fetch(NVIDIA_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NVIDIA_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: formattedMessages,
        temperature: 0.1,
        max_tokens: 450
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('NVIDIA API Error:', response.status, errorText);
      return NextResponse.json(
        { error: 'Failed to communicate with Nexus AI model service.' },
        { status: response.status }
      );
    }

    const data = await response.json();
    let replyText = data.choices?.[0]?.message?.content || 'I could not synthesize a response. Please try again.';

    // Failsafe server-side cleanup: strip any stray markdown asterisks or hashes
    replyText = replyText
      .replace(/\*\*\*(.*?)\*\*\*/g, '$1')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/^#{1,6}\s+/gm, '');

    return NextResponse.json({ reply: replyText });
  } catch (error: any) {
    console.error('Nexus AI Route Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
