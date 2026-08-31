import { NextResponse } from 'next/server';

const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY || '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';
const NVIDIA_API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';
const MODEL_NAME = 'meta/llama-3.2-11b-vision-instruct';

const NEXUS_AI_SYSTEM_PROMPT = `You are Nexus AI, the official academic, business & career guidance copilot in the Nexora platform.

YOUR MANDATE:
1. ANSWER STYLE (CRITICAL):
   - Provide SIMPLE, SHORT, CONCISE, and DIRECT answers.
   - Never write long essays, heavy technical jargon dumps, or unnecessary history lessons.
   - Jump straight to answering the question. DO NOT include meta-disclaimers or intro fluff like "I am Nexus AI, I can provide information on...".
   - Keep explanations clear, punchy, and student-friendly (2-4 brief bullet points or 2-3 short sentences max).

2. KNOWLEDGE SCOPE:
   - Education & Academics (schooling, Intermediate MPC/BiPC/CEC/HEC, 3-year Polytechnic Diplomas, B.Tech/Engineering branches, Medical lines, Vocational ITI trades, Computer Science & Programming languages like C++/Python/Java, syllabus, entrance exams like EAPCET/JEE/NEET/ECET, academic doubts).
   - Business & Entrepreneurship (startups, business models, career roadmaps, placement prep, resume building, corporate skills).
   - General Study Doubts (explaining math, science, engineering, or business concepts simply).

3. REFUSAL RULE (OFF-TOPIC / SILLY ONLY):
   - Refuse ONLY if the question is off-topic, silly, movies, gaming, entertainment, sports trivia, or gossip.
   - Refusal standard: "I am Nexus AI, specialized exclusively in educational, business, academic doubts, and career guidance. Please feel free to ask any question about your studies, exams, career path, or business concepts!"`;

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
        temperature: 0.2,
        max_tokens: 350
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
    const replyText = data.choices?.[0]?.message?.content || 'I could not synthesize a response. Please try again.';

    return NextResponse.json({ reply: replyText });
  } catch (error: any) {
    console.error('Nexus AI Route Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
