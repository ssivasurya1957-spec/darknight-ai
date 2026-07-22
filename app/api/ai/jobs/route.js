import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request) {
  try {
    const { query, filters, userSkills } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are a real-time job aggregator AI for an agentic career platform. 

Search query: "${query}"
Category filter: ${filters || 'All'}
User skills: ${userSkills?.join(', ') || 'General'}

Generate 6-8 REALISTIC job/internship/hackathon listings that would currently be available across platforms like LinkedIn, Naukri, Indeed, Glassdoor, Wellfound, Internshala, Devfolio, HackerEarth, Unstop, Upwork, and Fiverr.

Return ONLY a valid JSON array (no markdown, no code blocks) with this exact structure:
[
  {
    "id": "unique-id-1",
    "title": "Job Title",
    "organization": "Company Name",
    "type": "job|internship|hackathon|research|freelance",
    "platform": "LinkedIn|Naukri|Indeed|Internshala|Devfolio|Upwork|Fiverr|AngelList",
    "location": "City, Country or Remote",
    "salary": "₹12,00,000/yr or ₹25,000/month or ₹15,000-₹50,000/project",
    "stipend": "₹20,000/month (for internships)",
    "deadline": "2026-08-15",
    "skills": ["React", "Node.js"],
    "domain": "Web Development",
    "description": "2-3 sentence realistic description",
    "applyUrl": "https://linkedin.com/jobs/...",
    "matchScore": 87,
    "isRemote": true,
    "experience": "0-2 years",
    "postedAt": "2 days ago",
    "perks": ["Health Insurance", "WFH", "Stock Options"]
  }
]

Make data realistic and current as of July 2026. Include salary/stipend for every entry. Mix platforms realistically.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // Strip markdown code fences if present
    const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    const jobs = JSON.parse(cleaned);

    return NextResponse.json({ jobs, query, timestamp: new Date().toISOString() });
  } catch (err) {
    console.error('Job search AI error:', err);
    return NextResponse.json(
      { error: 'Job search temporarily unavailable.', jobs: [] },
      { status: 500 }
    );
  }
}
