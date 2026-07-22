import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request) {
  try {
    const { messages, userProfile } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const systemPrompt = `You are DarkKnight AI — a personal career intelligence assistant for an agentic platform that helps students and professionals find jobs, internships, hackathons, and research opportunities.

User Profile:
- Name: ${userProfile?.name || 'User'}
- Skills: ${userProfile?.skills?.join(', ') || 'Not specified'}
- Interests: ${userProfile?.interests?.join(', ') || 'Not specified'}
- University: ${userProfile?.university || 'Not specified'}

You have deep knowledge of:
- Job markets across LinkedIn, Naukri, Indeed, Glassdoor, AngelList, Wellfound
- Freelance platforms: Upwork, Fiverr, Toptal, Freelancer
- Investment platforms: Zerodha, Upstox (not job sites, clarify if asked)
- Tech hackathons: Devfolio, HackerEarth, Unstop, MLH, Kaggle
- Research funding: CSIR, DRDO, NSF, Google Research, Microsoft Research
- Internships: Internshala, LinkedIn, AngelList

Your job is to:
1. Understand user career goals and interests through conversation
2. Recommend specific opportunities tailored to their profile
3. Provide salary benchmarks, company culture insights, application tips
4. Remember context from the conversation
5. Be concise, intelligent, and professional with a subtle DarkKnight/Batcave tone

Always mention specific companies, salary ranges in INR/USD, and actionable next steps.
Format salary as ₹X,XX,000/yr or ₹X,XXX/month for internships.`;

    // Build chat history for Gemini
    const history = messages.slice(0, -1).map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'model', parts: [{ text: 'Understood. I am DarkKnight AI, your personal career intelligence assistant. How can I help you today?' }] },
        ...history,
      ],
    });

    const lastMessage = messages[messages.length - 1];
    const result = await chat.sendMessage(lastMessage.content);
    const text = result.response.text();

    return NextResponse.json({ reply: text });
  } catch (err) {
    console.error('AI Chat error:', err);
    return NextResponse.json(
      { error: 'AI service temporarily unavailable. Please try again.' },
      { status: 500 }
    );
  }
}
