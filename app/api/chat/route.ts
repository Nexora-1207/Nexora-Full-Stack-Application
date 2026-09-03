import { NextResponse } from 'next/server';

const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY || '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';
const NVIDIA_API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';
const MODEL_NAME = 'meta/llama-3.2-11b-vision-instruct';

// Instant knowledge map for 1-word acronyms & terms
const ACRONYM_KNOWLEDGE: Record<string, string> = {
  'rag': 'RAG - Retrieval-Augmented Generation\n\n• Overview: RAG is an artificial intelligence framework that combines retrieval search with generative language models to produce accurate, fact-based answers.\n• Key Features: Combines database retrieval with LLM generation for factual precision.\n• Applications: AI search engines, technical documentation bots, and enterprise knowledge bases.\n• Use Cases: Real-time data synthesis, question answering, and customer support bots.',
  'dsa': 'DSA - Data Structures & Algorithms\n\n• Overview: Fundamental computer science discipline focusing on efficient data organization and algorithmic problem solving.\n• Key Features: Arrays, Linked Lists, Trees, Graphs, Sorting, Searching, Dynamic Programming.\n• Applications: Software engineering, technical placement preparation, system optimization.\n• Use Cases: Search engines, database indexing, shortest-path navigation.',
  'dbms': 'DBMS - Database Management System\n\n• Overview: Software layer designed to create, query, and manage structured databases securely.\n• Key Features: Data integrity, SQL querying, concurrency control, transaction management.\n• Applications: Financial systems, e-commerce, user management platforms.\n• Use Cases: Account management, transaction tracking, inventory systems.',
  'oops': 'OOP - Object-Oriented Programming\n\n• Overview: Programming paradigm structured around objects containing data fields and procedures.\n• Key Features: Encapsulation, Abstraction, Inheritance, and Polymorphism.\n• Applications: Java, C++, Python, C# application development.\n• Use Cases: Enterprise software, game development, GUI apps.',
  'sql': 'SQL - Structured Query Language\n\n• Overview: Standard domain-specific language used for managing and querying relational databases.\n• Key Features: SELECT, INSERT, UPDATE, DELETE queries, Joins, Indexing, Transactions.\n• Applications: Data analytics, backend web development, database administration.\n• Use Cases: Fetching user records, financial reporting, data aggregation.'
};

const NEXUS_AI_SYSTEM_PROMPT = `You are Nexus AI, the official academic, business & career guidance copilot in the Nexora platform.

YOUR MANDATE:
1. VISION & IMAGE DOCUMENT TRANSCRIPTION:
   - You are equipped with Llama-3.2 Vision capabilities. When an image is provided, your PRIMARY task is to perform an accurate visual inspection and full transcription of the image contents (e.g. college timetables, class schedules, handwritten notes, math formulas, circuit diagrams, or document scans).
   - Read all text in the image: college names, department names, table headings, days of the week, time slots, subject codes, faculty names, and handwritten solutions.
   - Do NOT treat conversational slang terms like "bruh", "decode this", "bro", or "pls check" as the topic of the image. Ignore slang and transcribe the actual document image!
   
2. RESPONSE FORMAT FOR IMAGE DECODING:
   Line 1: Capitalized Document Title (e.g., Department of Computer Science Engineering - Time Table)
   Line 2+: Point-wise breakdown:
   • Overview: Document type and institution/header detected.
   • Schedule & Text Breakdown: Complete transcription of the timetable table, subjects, time slots, or handwritten notes.
   • Key Takeaways & Faculty: Important dates, faculty names, subject codes, or step-by-step math solutions.

3. SINGLE-WORD & ACRONYM TEXT QUERIES:
   - For text-only queries (no images), recognize terms like "rag", "dsa", "dbms", "oops", "sql", "c++", "python".
   - Answer with full title and point-wise bullet points.

4. MULTI-TURN LINE BREAK RULE:
   - Every single bullet point MUST be on its OWN NEW LINE using \\n.
   - ALWAYS put a \\n line break before every • bullet point.

5. NO MARKDOWN SYMBOLS:
   - Do NOT output asterisks (*, **, ***) or hashtags (#). Use clean text.`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1];
    const cleanUserQuery = (lastMessage?.text || lastMessage?.content || '').trim().toLowerCase();

    // Check instant acronym knowledge map for single-word queries without images
    if (!lastMessage?.imageUrl && ACRONYM_KNOWLEDGE[cleanUserQuery]) {
      return NextResponse.json({ reply: ACRONYM_KNOWLEDGE[cleanUserQuery] });
    }

    // Format chat history for NVIDIA Llama 3.2 Vision API
    const formattedMessages = [
      { role: 'system', content: NEXUS_AI_SYSTEM_PROMPT },
      ...messages.map((m: any) => {
        const role = m.sender === 'user' ? 'user' : m.role || 'assistant';
        const textContent = m.text || m.content || '';
        const imageUrl = m.imageUrl || m.image_url || m.image;

        if (role === 'user' && imageUrl) {
          const visionPromptText = `Visually inspect the attached image in detail. Transcribe all text, college names, department headers, timetable tables, days, time slots, subject codes, faculty names, and handwritten assignment notes in the image. Answer the user prompt: "${textContent}". Do NOT analyze conversational slang words like "bruh".`;
          return {
            role: 'user',
            content: [
              { type: 'text', text: visionPromptText },
              { type: 'image_url', image_url: { url: imageUrl } }
            ]
          };
        }

        return {
          role,
          content: textContent
        };
      })
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
        max_tokens: 600
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
