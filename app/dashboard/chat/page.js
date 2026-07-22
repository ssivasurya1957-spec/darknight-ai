'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, Bot } from 'lucide-react';
import { opportunities, aiQuickPrompts } from '@/lib/mockData';
import OpportunityCard from '@/components/OpportunityCard';
import GlowButton from '@/components/GlowButton';

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      id: 'msg-0',
      role: 'ai',
      content: 'Welcome to DarkKnight AI. I can help you find the perfect opportunities based on your skills and interests. Try asking me about internships, hackathons, or jobs in your field.',
      opportunities: [],
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const generateAIResponse = (userMessage) => {
    const text = userMessage.toLowerCase();
    let matches = [];
    let responseText = '';

    if (text.includes('intern') || text.includes('internship')) {
      matches = opportunities.filter(o => o.type === 'internship');
      responseText = `Here are some top internships I found for you based on current openings.`;
    } else if (text.includes('hack') || text.includes('hackathon')) {
      matches = opportunities.filter(o => o.type === 'hackathon');
      responseText = `Check out these exciting hackathons coming up. Perfect for building your portfolio!`;
    } else if (text.includes('job')) {
      matches = opportunities.filter(o => o.type === 'job');
      responseText = `I found these full-time roles that match your profile. Let me know if you want to narrow it down by domain.`;
    } else if (text.includes('research') || text.includes('funding')) {
      matches = opportunities.filter(o => o.type === 'research');
      responseText = `Here are some research programs and funding opportunities currently accepting applications.`;
    } else {
      const keywords = ['web', 'react', 'python', 'data', 'cloud', 'blockchain', 'ml', 'ai', 'security'];
      const foundKeyword = keywords.find(k => text.includes(k));
      
      if (foundKeyword) {
        matches = opportunities.filter(o => 
          o.domain.toLowerCase().includes(foundKeyword) || 
          o.skills?.some(s => s.toLowerCase().includes(foundKeyword)) ||
          o.title.toLowerCase().includes(foundKeyword)
        );
        responseText = `I found these opportunities related to ${foundKeyword}.`;
      } else {
        responseText = `I'm an AI assistant focused on finding career and learning opportunities. Try asking me about "jobs in Web Development", "upcoming hackathons", or "React internships"!`;
      }
    }

    const limitedMatches = matches.slice(0, 3);
    if (matches.length > 0 && limitedMatches.length === 0) {
        responseText = "I couldn't find exact matches for that right now, but here are some popular opportunities.";
    }

    return {
      content: responseText,
      opportunities: limitedMatches.map(m => m.id)
    };
  };

  const handleSend = (text) => {
    if (!text.trim()) return;

    const userMsg = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      opportunities: [],
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateAIResponse(text);
      const aiMsg = {
        id: `msg-${Date.now() + 1}`,
        role: 'ai',
        content: response.content,
        opportunities: response.opportunities,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] max-w-4xl mx-auto w-full relative">
      {/* Chat Messages */}
      <div className="flex-grow overflow-y-auto p-4 space-y-6 pb-32">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'ai' && (
              <div className="w-6 h-6 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-[10px] font-bold mr-3 mt-1 flex-shrink-0 shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                DK
              </div>
            )}
            <div className={`max-w-[85%] flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div
                className={`px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-[rgba(59,130,246,0.15)] text-white'
                    : 'bg-[rgba(17,17,17,0.6)] backdrop-blur-xl border border-[rgba(255,255,255,0.05)] text-[var(--text-primary)]'
                }`}
                style={{
                  borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px'
                }}
              >
                <p className="leading-relaxed">{msg.content}</p>
                
                {msg.opportunities && msg.opportunities.length > 0 && (
                  <div className="mt-4 space-y-3">
                    {msg.opportunities.map(id => {
                      const opp = opportunities.find(o => o.id === id);
                      if (!opp) return null;
                      return (
                        <div key={id} className="w-full max-w-sm">
                          <OpportunityCard opportunity={opp} compact={true} />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <span className="text-[10px] font-mono text-[var(--text-muted)] mt-1 mx-1">
                {formatTime(msg.timestamp)}
              </span>
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start items-end"
          >
            <div className="w-6 h-6 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-[10px] font-bold mr-3 mt-1 flex-shrink-0 shadow-[0_0_10px_rgba(59,130,246,0.5)]">
              DK
            </div>
            <div className="bg-[rgba(17,17,17,0.6)] backdrop-blur-xl border border-[rgba(255,255,255,0.05)] px-4 py-3" style={{ borderRadius: '16px 16px 16px 4px' }}>
              <div className="flex space-x-1">
                <motion.div className="w-2 h-2 rounded-full bg-[var(--text-secondary)]" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} />
                <motion.div className="w-2 h-2 rounded-full bg-[var(--text-secondary)]" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} />
                <motion.div className="w-2 h-2 rounded-full bg-[var(--text-secondary)]" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#050505] via-[#050505] to-transparent">
        {messages.length === 1 && (
          <div className="flex space-x-2 overflow-x-auto pb-4 mb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {aiQuickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="whitespace-nowrap px-4 py-2 rounded-full text-xs border border-[rgba(255,255,255,0.05)] bg-[rgba(17,17,17,0.8)] text-[var(--text-secondary)] hover:text-white hover:border-[rgba(59,130,246,0.3)] transition-colors backdrop-blur-md shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}
        <div className="glass-card rounded-2xl flex items-end p-2 border border-[rgba(255,255,255,0.08)] bg-[rgba(17,17,17,0.8)] backdrop-blur-xl shadow-lg">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend(input);
              }
            }}
            placeholder="ask darknight ai anything..."
            className="w-full bg-transparent border-none outline-none text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] resize-none py-3 px-4 max-h-32 text-sm leading-relaxed"
            rows={1}
            style={{ minHeight: '48px' }}
          />
          <GlowButton
            variant="primary"
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isTyping}
            className="w-10 h-10 p-0 rounded-xl flex items-center justify-center shrink-0 mb-1 mr-1"
          >
            <ArrowUp size={18} />
          </GlowButton>
        </div>
      </div>
    </div>
  );
}
