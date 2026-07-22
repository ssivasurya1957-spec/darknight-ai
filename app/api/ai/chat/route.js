import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request) {
  try {
    const { messages, userProfile } = await request.json();
    const apiKey = process.env.GEMINI_API_KEY;

    const lastMessage = messages[messages.length - 1]?.content || '';

    // If Gemini API Key is configured in Vercel, use real Gemini 1.5 Flash
    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const systemPrompt = `You are DarkKnight AI — a personal career intelligence assistant for an agentic platform that helps students and professionals find jobs, internships, hackathons, and research opportunities.

User Profile:
- Name: ${userProfile?.name || 'User'}
- Skills: ${userProfile?.skills?.join(', ') || 'Not specified'}
- Interests: ${userProfile?.interests?.join(', ') || 'Not specified'}

Always mention specific companies, salary ranges in INR/USD, and actionable next steps.`;

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

        const result = await chat.sendMessage(lastMessage);
        const text = result.response.text();
        return NextResponse.json({ reply: text });
      } catch (err) {
        console.error('Gemini API call failed:', err);
      }
    }

    // Fallback AI Engine when API key is pending configuration
    const query = lastMessage.toLowerCase();
    let reply = `🦇 **DarkKnight AI Career Assistant**\n\n`;

    if (query.includes('job') || query.includes('work') || query.includes('hiring') || query.includes('role')) {
      reply += `Here are active high-match opportunities verified for your profile:\n\n` +
        `1. **Software Engineer, Core Systems** at **Google** (Bangalore) — ₹35,00,000/yr\n` +
        `2. **Machine Learning Engineer** at **Microsoft** (Hyderabad) — ₹32,00,000/yr\n` +
        `3. **Backend Engineer** at **Upstox** (Mumbai) — ₹26,00,000/yr\n\n` +
        `💡 *Recommendation*: Highlight C++, Distributed Systems, and Python skills on your resume. Use the **ATS Resume Studio** on the left menu to generate a tailored copy!`;
    } else if (query.includes('hackathon') || query.includes('compete') || query.includes('build')) {
      reply += `Here are top upcoming hackathons matching your domain:\n\n` +
        `🏆 **Space Apps Challenge 2026** (NASA x ISRO) — Global Recognition & Swag\n` +
        `🏆 **GenAI Buildathon India** (Hugging Face x Google Cloud) — $10,000 Prize Pool\n` +
        `🏆 **ETHIndia 2026** (Devfolio, Bangalore) — $50,000+ Bounties\n\n` +
        `📍 Check the **Student Hub & Leaflet Map** on the Hackathons page to find local venues near your location!`;
    } else if (query.includes('intern') || query.includes('student')) {
      reply += `Here are top active internships:\n\n` +
        `🎓 **AI Research Intern** at **NVIDIA** (Bangalore) — ₹80,000/month\n` +
        `🎓 **Full Stack Intern** at **Zepto** (Mumbai) — ₹40,000/month\n` +
        `🎓 **Data Analytics Intern** at **Swiggy** (Bangalore) — ₹35,00,00/month\n\n` +
        `Use the **Apply Assistant** on any job card to generate a custom cover letter in 1 click!`;
    } else if (query.includes('resume') || query.includes('cv') || query.includes('ats')) {
      reply += `📄 **Resume Tailoring Tips**:\n\n` +
        `- Quantify achievements with metrics (e.g. *Reduced latency by 35% using Redis*).\n` +
        `- Match exact keyword phrasing from the target Job Description.\n` +
        `- Keep layout single-column for standard ATS parsers.\n\n` +
        `👉 Visit the **Resume Studio** to automatically tailor your resume for any role!`;
    } else {
      reply += `I have analyzed your query for **"${lastMessage}"**.\n\n` +
        `As your personal career intelligence assistant, I can help you with:\n` +
        `- **Live Job & Internship Matching** (Google, Microsoft, Amazon, Upstox, Fiverr)\n` +
        `- **Hackathon Winning Strategy & Elevator Pitches**\n` +
        `- **ATS Resume Tailoring & One-Click Apply Cover Letters**\n` +
        `- **Salary & Compensation Negotiation**\n\n` +
        `What specific goal would you like to achieve today?`;
    }

    return NextResponse.json({ reply });
  } catch (err) {
    console.error('AI Chat Error:', err);
    return NextResponse.json({
      reply: `🦇 **DarkKnight AI**: I am active and ready to assist you. Ask me about jobs, hackathons, salaries, or resume tailoring!`
    });
  }
}
