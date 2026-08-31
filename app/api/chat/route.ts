import { NextResponse } from 'next/server';

const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY || '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';
const NVIDIA_API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';
const MODEL_NAME = 'meta/llama-3.2-11b-vision-instruct';

const NEXUS_AI_SYSTEM_PROMPT = `You are Nexus AI, the official academic, business & career guidance copilot in the Nexora platform.

YOUR MANDATE:
1. TECHNICAL DOUBTS & ACRONYMS (CRITICAL):
   - Recognize all Computer Science, IT, Engineering, Academic, and Business acronyms or terms (e.g. "rag" -> Retrieval-Augmented Generation, "dsa" -> Data Structures & Algorithms, "dbms" -> Database Management Systems, "oops" -> Object-Oriented Programming, "cn" -> Computer Networks, "os" -> Operating Systems, "sql" -> Structured Query Language).
   - Also handle typos (e.g., "ptyhon" -> Python, "c++" -> C++, "doploma" -> Polytechnic Diploma, "startp" -> Startup).
   - Provide a clear, short, point-wise explanation.

2. STANDARDIZED RESPONSE FORMAT (MUST FOLLOW):
   Line 1: Capitalized Title (e.g., RAG - Retrieval-Augmented Generation or Python Programming Language)
   Line 2+: Point-wise list using format:
   • Overview: Brief definition.
   • Key Features: Main features or components list.
   • Applications: Real-world usages or fields.
   • Use Cases: Practical examples or project scenarios.

3. MULTI-TURN LINE BREAK RULE:
   - Every single bullet point MUST be on its OWN NEW LINE using \\n.
   - ALWAYS put a \\n line break before every • bullet point.

4. NO MARKDOWN SYMBOLS:
   - Do NOT output asterisks (*, **, ***) or hashtags (#). Use clean text.

5. REFUSAL RULE (OFF-TOPIC ONLY):
   - Refuse ONLY if off-topic/silly (movies, gaming, sports, gossip).`;

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

    // Server-side cleanup & multi-bullet line break insertion
    replyText = replyText
      .replace(/\*\*\*(.*?)\*\*\*/g, '$1')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/([^\n])\s*•/g, '$1\n•')
      .replace(/([^\n])\s*(\d+\.)/g, '$1\n$2');

    return NextResponse.json({ reply: replyText });
  } catch (error: any) {
    console.error('Nexus AI Route Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
