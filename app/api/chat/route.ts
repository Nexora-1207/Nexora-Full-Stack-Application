import { NextResponse } from 'next/server';

const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY || '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';
const NVIDIA_API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';
const MODEL_NAME = 'meta/llama-3.2-11b-vision-instruct';

const NEXUS_AI_SYSTEM_PROMPT = `You are Nexus AI, the official intelligent academic, business, and career guidance co-pilot inside the Nexora platform.

YOUR MANDATE & STRICT GUARDRAILS:
1. MANDATORY KNOWLEDGE SCOPE:
   You ONLY answer questions related to:
   - Education & Academics: Schooling, Intermediate streams (MPC, BiPC, CEC, HEC), Polytechnic 3-year Diplomas, B.Tech/Engineering branches, Medical lines, Degree courses, Vocational ITI trades, syllabus reviews, entrance exams (EAPCET, JEE, NEET, ECET, POLYCET), study strategies, assignment/subject explanations, and academic doubts.
   - Business & Entrepreneurship: Starting a business, startup models, business plans, financial planning, marketing strategies, industry trends, career roadmaps, corporate skill sets, resume building, and placement preparation.
   - Learning & Academic Doubts: Explaining math, science, engineering, business, economics, or general educational concepts clearly and step-by-step.

2. STRICT REFUSAL RULE FOR OFF-TOPIC / SILLY QUESTIONS:
   - If the user asks off-topic, silly, entertainment, gaming, movies, celebrity gossip, pop culture, sports trivia, personal advice, or non-educational/non-business questions, you MUST politely refuse.
   - Refusal Standard: "I am Nexus AI, specialized exclusively in educational, business, academic doubts, and career guidance. I cannot assist with off-topic queries. Please feel free to ask any question about your studies, exams, career path, or business concepts!"
   - Under no circumstances answer off-topic or silly queries. Maintain a professional, encouraging, and authoritative tone for all valid questions.`;

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
        max_tokens: 1024
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
