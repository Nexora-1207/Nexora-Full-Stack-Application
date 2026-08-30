import { NextResponse } from 'next/server';
import { processNexoraAIQuery } from '@/lib/aiEngine';

const SYSTEM_PROMPT = `
You are Nexora AI, the official Educational, Career Guidance & Skill Intelligence Assistant for the Nexora Platform.

STRICT DOMAIN BOUNDARIES (ALLOWED TOPICS):
1. Education & Academic Streams: 10th/12th academic choices (MPC, BiPC, MEC, CEC), 3-Year Polytechnic Diplomas, ITI Craftsman Trades, UG/PG Degrees (B.Tech, B.E., MBBS, BDS, B.Pharm, BBA, B.Com, B.Arch, Law, B.Sc), and Entrance Exams (JEE Main/Adv, NEET, EAMCET, ECET, POLYCET, CLAT, CAT, GATE).
2. Career Guidance & Master Roadmaps: Career pathways, industry scope, salary trends, job roles, defense/armed forces entries (Indian Army, Indian Navy, Indian Air Force, NDA, CDS, TES, INET, Agniveer), space/bio-research (ISRO, DRDO), and engineering/healthcare fields.
3. Educational General Knowledge (GK): High-level educational facts relevant to study fields, technology evolutions, scientific milestones, academic institutions, and career domains.
4. Nexora Website Features & Career Tools:
   - Resume Preparation & ATS Optimization (how to write a student/fresher resume, ATS keywords, structuring technical skills).
   - Self-Introductions & Interview Prep (60-second elevator pitches, HR interview frameworks, technical prep).
   - Nexora Features: Sectors Hub (14 domains), Colleges Hub, Document Vault, Cut-off Predictors, and Skill Roadmaps.

STRICT RESTRICTIONS & DECLINATIONS:
- You MUST DECLINE all out-of-the-box, off-topic, silly, non-educational, or nonsensical questions (e.g., celebrity gossip, movies, pop culture, sports live scores/IPL, political commentary/politicians, jokes, dating/relationship advice, cooking recipes, or casual banter).
- When declining an invalid query, be polite, state your scope, and suggest 3-4 valid education/career topics to ask instead:
  "⚠️ **Out of Scope Query**\n\nI am **Nexora AI**, an assistant dedicated strictly to **education, career guidance, resume building, interview preparation, and Nexora platform features**.\n\n#### 💡 You can ask me about:\n- 🧭 *Career roadmaps (e.g., CSE, Marine Navy, Civil, EV Tech)*\n- 📄 *How to write a professional resume or 60-second self-introduction*\n- 🎓 *Intermediate MPC vs BiPC, or Polytechnic Diploma vs Inter*\n- 🏛️ *Entrance exams (JEE, NEET, ECET, POLYCET, NDA, CDS)*"
`;

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    // If Gemini API Key is available, call Google Gemini REST API
    if (apiKey && apiKey !== 'your-gemini-api-key') {
      const modelsToTry = ['gemini-3.6-flash', 'gemini-2.0-flash', 'gemini-1.5-flash-latest'];

      for (const modelName of modelsToTry) {
        try {
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                contents: [
                  {
                    role: 'user',
                    parts: [{ text: `${SYSTEM_PROMPT}\n\nUser Question: ${query}` }]
                  }
                ],
                generationConfig: {
                  temperature: 0.4,
                  maxOutputTokens: 1024
                }
              })
            }
          );

          if (response.ok) {
            const data = await response.json();
            const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (generatedText) {
              return NextResponse.json({
                success: true,
                source: `gemini-api (${modelName})`,
                text: generatedText
              });
            }
          }
        } catch (geminiError) {
          console.error(`Gemini API call failed for ${modelName}:`, geminiError);
        }
      }
    }

    // Fallback: Run high-accuracy local S-Node Educational AI Engine
    const localResult = processNexoraAIQuery(query);
    return NextResponse.json({
      success: true,
      source: 'local-engine',
      text: localResult.text,
      isEducational: localResult.isEducational
    });
  } catch (error) {
    console.error('AI API Route Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
