import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the API only if the key is available
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenerativeAI(apiKey);
};

/**
 * Chat with Gemini AI, falling back to basic matching if no API key is provided
 * 
 * @param {string} message The user's message
 * @param {Array} conversationHistory Previous messages in the conversation
 * @returns {Promise<string>} The AI's response text
 */
export async function chatWithAI(message, conversationHistory = []) {
  try {
    const genAI = getGeminiClient();
    
    if (!genAI) {
      // Fallback mechanism if no API key is set
      console.warn("GEMINI_API_KEY not found in environment. Using fallback logic.");
      const text = message.toLowerCase();
      if (text.includes('intern') || text.includes('internship')) {
        return "I can help you find internships! Many tech companies are looking for summer interns right now.";
      }
      if (text.includes('hackathon')) {
        return "Hackathons are great for building your portfolio. We have several upcoming hackathons listed.";
      }
      if (text.includes('job')) {
        return "Looking for a full-time role? Tell me your preferred domain and I'll find matching jobs.";
      }
      return "I'm DarkKnight AI. While my advanced capabilities require an API key to be set, I can still help point you toward opportunities in our database.";
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const systemPrompt = "You are DarkKnight AI, an intelligent career assistant. You help students find jobs, internships, hackathons, and research funding. Be concise, helpful, and professional. Format responses with clear sections. When suggesting opportunities, mention specific details like deadlines and stipends.";
    
    // Convert history format if needed, though for simplicity we just prepend history context
    const contextStr = conversationHistory
      .filter(msg => msg.role !== 'system')
      .map(msg => `${msg.role === 'user' ? 'User' : 'DarkKnight AI'}: ${msg.content}`)
      .join('\n');
    
    const fullPrompt = `${systemPrompt}\n\nContext:\n${contextStr}\n\nUser: ${message}`;
    
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return response.text();
    
  } catch (error) {
    console.error("Error communicating with Gemini AI:", error);
    return "I'm sorry, I encountered an error while processing your request. Please try again later.";
  }
}

/**
 * Generates a concise summary for an opportunity using Gemini AI
 * 
 * @param {Object} opportunity The opportunity object
 * @returns {Promise<string>} A 2-3 sentence summary
 */
export async function summarizeOpportunity(opportunity) {
  try {
    const genAI = getGeminiClient();
    
    if (!genAI) {
      return opportunity.aiSummary || "An exciting opportunity to grow your career and skills.";
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Summarize this opportunity in 2-3 concise sentences. Focus on the value proposition, key requirements, and stipends/benefits if present.
    
    Title: ${opportunity.title}
    Organization: ${opportunity.organization}
    Type: ${opportunity.type}
    Description: ${opportunity.description}
    Skills: ${opportunity.skills?.join(', ')}
    Stipend: ${opportunity.stipend}`;
    
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
    
  } catch (error) {
    console.error("Error summarizing opportunity:", error);
    return opportunity.aiSummary || "An exciting opportunity to grow your career and skills.";
  }
}

/**
 * Matches a user profile against a list of opportunities and ranks them
 * 
 * @param {Object} userProfile The user's profile
 * @param {Array} opportunities Array of opportunity objects
 * @returns {Promise<Array>} Sorted array of opportunities
 */
export async function matchOpportunities(userProfile, opportunities) {
  try {
    const genAI = getGeminiClient();
    
    if (!genAI) {
      // Fallback: simple sorting by existing matchScore
      return [...opportunities].sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    }

    // In a real implementation, you would pass the profile and opportunities to Gemini 
    // to get personalized scores. For this example, we'll simulate the AI scoring logic
    // since passing all opportunities might exceed prompt limits or be slow.
    // A robust approach would involve embeddings, but we'll stick to a heuristic fallback here 
    // combined with the AI summary idea.
    
    // For now, return sorted by mock matchScore to fulfill the API structure
    return [...opportunities].sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    
  } catch (error) {
    console.error("Error matching opportunities:", error);
    return [...opportunities].sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  }
}
