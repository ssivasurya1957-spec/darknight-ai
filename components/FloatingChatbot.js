'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Sparkles, X, Send, FileText, Image as ImageIcon, Share2, Download, Copy, Check, Bot } from 'lucide-react';
import GlowButton from './GlowButton';

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'resume' | 'image' | 'whatsapp'
  
  // Chat state
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: 'Greetings, Agent. I am DarkKnight AI — your career assistant. I can help you find jobs/internships, generate tailored resumes, analyze portfolio images/documents, or broadcast updates to student WhatsApp groups.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Resume Generator State
  const [targetRole, setTargetRole] = useState('Machine Learning Engineer');
  const [userSkillsInput, setUserSkillsInput] = useState('Python, PyTorch, TensorFlow, Scikit-Learn, React, SQL');
  const [generatedResume, setGeneratedResume] = useState('');
  const [isGeneratingResume, setIsGeneratingResume] = useState(false);
  const [copied, setCopied] = useState(false);

  // Image Review State
  const [imageUrl, setImageUrl] = useState('');
  const [imageAnalysis, setImageAnalysis] = useState('');
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);

  // WhatsApp Broadcast State
  const [groupName, setGroupName] = useState('IIT Delhi CS Batch 2026');
  const [broadcastMessage, setBroadcastMessage] = useState('🔥 New High-Priority Internship: Google DeepMind ML Specialist (Stipend: ₹1,50,000/mo). Deadline in 5 days!');
  const [broadcastSent, setBroadcastSent] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage.trim();
    const newMsg = {
      role: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMsg]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response processing
    setTimeout(() => {
      let reply = 'I have analyzed your query against the Wayne Tech database. ';
      if (userText.toLowerCase().includes('resume')) {
        reply += 'I recommend switching to the [ RESUME GENERATOR ] tab above to generate an ATS-optimized resume tailored to your target role!';
      } else if (userText.toLowerCase().includes('image') || userText.toLowerCase().includes('photo') || userText.toLowerCase().includes('certificate')) {
        reply += 'You can use the [ IMAGE REVIEWER ] tab to upload or paste a link to your resume/headshot/certificate for an instant AI evaluation.';
      } else if (userText.toLowerCase().includes('whatsapp') || userText.toLowerCase().includes('group')) {
        reply += 'Switch to the [ WHATSAPP BROADCAST ] tab to dispatch live alerts to your student groups instantly!';
      } else if (userText.toLowerCase().includes('internship') || userText.toLowerCase().includes('job')) {
        reply += 'Found 12 matching positions: Google DeepMind ML Specialist (98% match), Microsoft Core Systems (95% match), and Vercel Frontend Engineer (92% match).';
      } else {
        reply += 'All systems operational. How else can I assist your career progression today?';
      }

      setMessages(prev => [
        ...prev,
        {
          role: 'ai',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(false);
    }, 1000);
  };

  const handleGenerateResume = async () => {
    setIsGeneratingResume(true);
    await new Promise(r => setTimeout(r, 1200));

    const resumeMarkdown = `# ${targetRole.toUpperCase()} — CURRICULUM VITAE

## SUMMARY
High-performing developer specializing in ${targetRole}. Demonstrated track record of building production-grade AI & software architectures.

## TECHNICAL SKILLS
- **Core Languages**: ${userSkillsInput}
- **Frameworks & Tools**: Next.js, PyTorch, Docker, Git, REST APIs, PostgreSQL
- **Specializations**: System Architecture, Model Optimization, Full-Stack Development

## SELECTED PROJECTS
1. **DarkKnight AI Platform**: Production Agentic AI platform identifying jobs, internships, and research grants with automated Nodemailer & WhatsApp Student Group dispatchers.
2. **Autonomous ML Pipeline**: Built high-throughput data parsing engine processing 10,000+ records with 99.4% precision.

## EDUCATION
- **B.Tech Computer Science & Engineering** | IIT Delhi (GPA: 9.4/10)
`;

    setGeneratedResume(resumeMarkdown);
    setIsGeneratingResume(false);
  };

  const handleAnalyzeImage = async () => {
    if (!imageUrl.trim()) return;
    setIsAnalyzingImage(true);
    await new Promise(r => setTimeout(r, 1200));

    setImageAnalysis(`🔍 **AI Document / Image Evaluation Report**:
1. **Clarity & Formatting**: Excellent resolution and high-contrast typography detected (Rating: 9.5/10).
2. **ATS Compatibility**: Clear section headers and machine-readable text structure.
3. **Key Recommendation**: Ensure project section highlights quantitative metrics (e.g. "improved latency by 35%").`);
    setIsAnalyzingImage(false);
  };

  const handleSendWhatsAppBroadcast = () => {
    const formattedMsg = encodeURIComponent(`🦇 *DarkKnight AI Student Alert*\n*Group*: ${groupName}\n\n${broadcastMessage}`);
    window.open(`https://api.whatsapp.com/send?text=${formattedMsg}`, '_blank');
    setBroadcastSent(true);
  };

  const copyResume = () => {
    navigator.clipboard.writeText(generatedResume);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Floating Bot Button (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsIsOpen(!isOpen)}
          className="relative group w-14 h-14 rounded-full bg-[#101015] border border-[rgba(212,175,55,0.4)] flex items-center justify-center text-[#D4AF37] shadow-[0_0_25px_rgba(212,175,55,0.3)] hover:scale-105 transition-all"
        >
          {/* Animated Green Pulse Ring (Matching PS4 Screenshot) */}
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#22C55E] border-2 border-[#050505] animate-pulse" />
          <Bot size={26} />
        </button>
      </div>

      {/* Interactive Chatbot Overlay Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-24 right-6 z-50 w-[92vw] sm:w-[420px] h-[580px] bg-[#0c0c12] border border-[rgba(212,175,55,0.35)] rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden text-white"
          >
            {/* Header Bar */}
            <div className="p-4 bg-[#12121a] border-b border-[rgba(212,175,55,0.2)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[rgba(212,175,55,0.15)] border border-[rgba(212,175,55,0.3)] flex items-center justify-center text-[#D4AF37]">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-[#F5E6C8] uppercase tracking-wide">
                    DARKNIGHT AI AGENT
                  </h3>
                  <span className="text-[0.65rem] font-mono text-[#22C55E] flex items-center gap-1">
                    ● ONLINE // PS4 ENGINE
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[var(--text-secondary)] hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex bg-[#08080c] border-b border-[rgba(212,175,55,0.15)] p-1 gap-1">
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-1.5 text-[0.65rem] font-mono rounded-md flex items-center justify-center gap-1 transition-all ${activeTab === 'chat' ? 'bg-[#D4AF37] text-black font-bold' : 'text-[var(--text-secondary)] hover:text-white'}`}
              >
                <MessageSquare size={12} /> AI CHAT
              </button>
              <button
                onClick={() => setActiveTab('resume')}
                className={`flex-1 py-1.5 text-[0.65rem] font-mono rounded-md flex items-center justify-center gap-1 transition-all ${activeTab === 'resume' ? 'bg-[#D4AF37] text-black font-bold' : 'text-[var(--text-secondary)] hover:text-white'}`}
              >
                <FileText size={12} /> RESUME
              </button>
              <button
                onClick={() => setActiveTab('image')}
                className={`flex-1 py-1.5 text-[0.65rem] font-mono rounded-md flex items-center justify-center gap-1 transition-all ${activeTab === 'image' ? 'bg-[#D4AF37] text-black font-bold' : 'text-[var(--text-secondary)] hover:text-white'}`}
              >
                <ImageIcon size={12} /> REVIEW
              </button>
              <button
                onClick={() => setActiveTab('whatsapp')}
                className={`flex-1 py-1.5 text-[0.65rem] font-mono rounded-md flex items-center justify-center gap-1 transition-all ${activeTab === 'whatsapp' ? 'bg-[#22C55E] text-black font-bold' : 'text-[var(--text-secondary)] hover:text-white'}`}
              >
                <Share2 size={12} /> BROADCAST
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {/* TAB 1: AI CHAT */}
              {activeTab === 'chat' && (
                <>
                  <div className="flex-1 flex flex-col gap-3 overflow-y-auto">
                    {messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                      >
                        <div
                          className={`p-3 rounded-xl text-xs leading-relaxed ${msg.role === 'user' ? 'bg-[rgba(212,175,55,0.2)] border border-[rgba(212,175,55,0.4)] text-white rounded-br-none' : 'bg-[#14141c] border border-[rgba(255,255,255,0.08)] text-[var(--text-primary)] rounded-bl-none'}`}
                        >
                          {msg.text}
                        </div>
                        <span className="text-[0.6rem] font-mono text-[var(--text-muted)] mt-1">
                          {msg.timestamp}
                        </span>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="text-xs font-mono text-[var(--primary)] animate-pulse">
                        🦇 AI Agent analyzing Wayne Tech database...
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Form */}
                  <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-[rgba(255,255,255,0.08)]">
                    <input
                      type="text"
                      placeholder="Ask AI about jobs, resumes, reviews..."
                      value={inputMessage}
                      onChange={e => setInputMessage(e.target.value)}
                      className="flex-1 bg-[#14141c] border border-[rgba(212,175,55,0.2)] rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#D4AF37]"
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 bg-[#D4AF37] text-black font-bold rounded-xl text-xs hover:bg-[#FFF0CA] transition-all"
                    >
                      <Send size={14} />
                    </button>
                  </form>
                </>
              )}

              {/* TAB 2: AI RESUME GENERATOR */}
              {activeTab === 'resume' && (
                <div className="flex flex-col gap-3">
                  <div className="text-xs font-mono text-[var(--primary)] uppercase">[ AI ATS RESUME BUILDER ]</div>
                  <div>
                    <label className="text-[0.65rem] font-mono text-[var(--text-secondary)] block mb-1">TARGET ROLE</label>
                    <input
                      type="text"
                      value={targetRole}
                      onChange={e => setTargetRole(e.target.value)}
                      className="w-full bg-[#14141c] border border-[rgba(212,175,55,0.2)] rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[0.65rem] font-mono text-[var(--text-secondary)] block mb-1">YOUR SKILLS</label>
                    <input
                      type="text"
                      value={userSkillsInput}
                      onChange={e => setUserSkillsInput(e.target.value)}
                      className="w-full bg-[#14141c] border border-[rgba(212,175,55,0.2)] rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                    />
                  </div>
                  <GlowButton variant="primary" size="sm" onClick={handleGenerateResume} disabled={isGeneratingResume}>
                    {isGeneratingResume ? 'Building Resume...' : '[ GENERATE ATS RESUME ]'}
                  </GlowButton>

                  {generatedResume && (
                    <div className="mt-2 flex flex-col gap-2">
                      <div className="p-3 bg-[#101016] border border-[rgba(212,175,55,0.3)] rounded-xl text-[0.65rem] font-mono text-[var(--text-secondary)] max-h-48 overflow-y-auto whitespace-pre-wrap">
                        {generatedResume}
                      </div>
                      <button
                        onClick={copyResume}
                        className="py-2 bg-[rgba(212,175,55,0.15)] border border-[rgba(212,175,55,0.3)] text-[var(--primary)] rounded-lg text-xs font-mono flex items-center justify-center gap-1 hover:bg-[rgba(212,175,55,0.25)] transition-all"
                      >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                        {copied ? 'COPIED TO CLIPBOARD!' : 'COPY RESUME MARKDOWN'}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: AI IMAGE & DOCUMENT REVIEW */}
              {activeTab === 'image' && (
                <div className="flex flex-col gap-3">
                  <div className="text-xs font-mono text-[var(--primary)] uppercase">[ AI IMAGE & CERTIFICATE REVIEWER ]</div>
                  <p className="text-[0.7rem] text-[var(--text-secondary)]">Paste image/certificate URL or document link for instant AI structure analysis:</p>
                  <input
                    type="url"
                    placeholder="https://example.com/resume-screenshot.png"
                    value={imageUrl}
                    onChange={e => setImageUrl(e.target.value)}
                    className="w-full bg-[#14141c] border border-[rgba(212,175,55,0.2)] rounded-lg px-3 py-2 text-xs text-white outline-none"
                  />
                  <GlowButton variant="primary" size="sm" onClick={handleAnalyzeImage} disabled={isAnalyzingImage || !imageUrl}>
                    {isAnalyzingImage ? 'Analyzing Image...' : '[ RUN AI IMAGE EVALUATION ]'}
                  </GlowButton>

                  {imageAnalysis && (
                    <div className="p-3 bg-[#101016] border border-[rgba(212,175,55,0.3)] rounded-xl text-xs text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap">
                      {imageAnalysis}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: WHATSAPP STUDENT GROUP BROADCAST */}
              {activeTab === 'whatsapp' && (
                <div className="flex flex-col gap-3">
                  <div className="text-xs font-mono text-[#22C55E] uppercase">[ WHATSAPP STUDENT GROUP BROADCAST ]</div>
                  <div>
                    <label className="text-[0.65rem] font-mono text-[var(--text-secondary)] block mb-1">STUDENT GROUP NAME</label>
                    <input
                      type="text"
                      value={groupName}
                      onChange={e => setGroupName(e.target.value)}
                      className="w-full bg-[#14141c] border border-[rgba(34,197,94,0.3)] rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[0.65rem] font-mono text-[var(--text-secondary)] block mb-1">BROADCAST MESSAGE</label>
                    <textarea
                      rows={3}
                      value={broadcastMessage}
                      onChange={e => setBroadcastMessage(e.target.value)}
                      className="w-full bg-[#14141c] border border-[rgba(34,197,94,0.3)] rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                    />
                  </div>
                  <button
                    onClick={handleSendWhatsAppBroadcast}
                    className="py-2.5 bg-[#22C55E] text-black font-bold rounded-xl text-xs font-mono flex items-center justify-center gap-2 hover:bg-[#4ADE80] transition-all shadow-[0_0_15px_rgba(34,197,94,0.4)]"
                  >
                    <Share2 size={14} /> [ DISPATCH TO WHATSAPP GROUP ]
                  </button>
                  {broadcastSent && (
                    <div className="text-xs font-mono text-[#22C55E] text-center">
                      ✓ Broadcast dispatched to WhatsApp Web!
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
