import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request) {
  try {
    const { messages, userProfile, userApiKey } = await request.json();
    
    // Check environment variable or user-provided key
    const apiKey = userApiKey || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        reply: `⚠️ **Gemini API Key Required**\n\nTo unlock live 100% real-time AI responses, please enter your Gemini API Key in Vercel Settings or paste your Google AI Studio key (\`AIzaSy...\`).`
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const lastMessage = messages[messages.length - 1]?.content || 'Hello';

    const systemPrompt = `You are DarkKnight AI — an elite autonomous career intelligence assistant. You help students and professionals with tech job searches, salary negotiation, ATS resume building, and hackathon strategy.

User Profile:
- Name: ${userProfile?.name || 'User'}
- Skills: ${userProfile?.skills?.join(', ') || 'Software Engineering'}
- Domain Interests: ${userProfile?.interests?.join(', ') || 'Artificial Intelligence'}

Guidelines:
- Give direct, detailed, 100% real actionable advice.
- Recommend specific top companies (Google, Microsoft, Amazon, Upstox, Fiverr, NVIDIA) with real salary ranges in INR/USD.
- Maintain a sharp, intelligent, professional Batcave / DarkKnight assistant persona.`;

    // Active Google AI Studio models (v1beta)
    const modelsToTry = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash-latest', 'gemini-1.5-flash'];
    let lastError = null;

    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(`${systemPrompt}\n\nUser Question: ${lastMessage}`);
        const text = result.response.text();
        if (text) {
          return NextResponse.json({ reply: text });
        }
      } catch (err) {
        console.error(`Gemini model ${modelName} failed:`, err?.message);
        lastError = err;
      }
    }

    return NextResponse.json({
      reply: `❌ **Gemini AI Call Failed**: ${lastError?.message || 'API Error'}. Please check your Google AI Studio API key (from https://aistudio.google.com/app/apikey).`
    });

  } catch (err) {
    console.error('AI Chat Error:', err);
    return NextResponse.json({
      reply: `❌ **Error**: ${err.message || 'Failed to process AI request'}`
    });
  }
}
