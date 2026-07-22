'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles, RefreshCw, Minimize2, Maximize2, MapPin, Calculator, FileText } from 'lucide-react';

export default function BattyChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'ai',
      content: `🦇⚡️ **BAT AI Assistant Active!**\n\nHi! I'm **BAT AI**. I can build your resume, solve math & logic problems, answer all questions, and give you exact location details for hackathons near you! 💖`,
      timestamp: new Date().toISOString(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim() || isTyping) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toISOString(),
    };

    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updated.map(m => ({ role: m.role, content: m.content })),
          userProfile: JSON.parse(localStorage.getItem('darknight_user') || '{}'),
        }),
      });

      const data = await res.json();
      const aiReply = data.reply || `🦇⚡️ **BAT AI**: Ready! Ask me to solve math, build resumes, answer questions, or find hackathons! 💖`;

      setMessages(prev => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          role: 'ai',
          content: aiReply,
          timestamp: new Date().toISOString(),
        }
      ]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          role: 'ai',
          content: `🦇⚡️ **BAT AI**: Active! Ask me math problems, resume tailoring, or nearest hackathon locations! 💖`,
          timestamp: new Date().toISOString(),
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating BAT AI Widget Launcher */}
      {!isOpen && (
        <motion.button
          onClick={() => setIsOpen(true)}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          className="vibrant-float"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 999,
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #FF007F 0%, #FFD700 50%, #00F5FF 100%)',
            border: '3px solid #FFFFFF',
            boxShadow: '0 10px 30px rgba(255, 0, 127, 0.5), 0 0 40px rgba(0, 245, 255, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#000',
            fontSize: '1.7rem',
          }}
        >
          🦇⚡️
        </motion.button>
      )}

      {/* BAT AI Chatbot Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              zIndex: 1000,
              width: '400px',
              maxWidth: 'calc(100vw - 32px)',
              height: isMinimized ? '64px' : '540px',
              maxHeight: 'calc(100vh - 100px)',
              background: 'linear-gradient(145deg, #18122b 0%, #0c0817 100%)',
              border: '2px solid rgba(255, 0, 127, 0.4)',
              borderRadius: '24px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.95), 0 0 40px rgba(255, 0, 127, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              transition: 'height 0.3s ease',
            }}
          >
            {/* BAT AI Header */}
            <div style={{ padding: '14px 18px', background: 'linear-gradient(90deg, rgba(255,0,127,0.2), rgba(0,245,255,0.2))', borderBottom: '1px solid rgba(255,0,127,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, #FF007F, #FFD700)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', boxShadow: '0 0 15px rgba(255,0,127,0.6)' }}>
                  🦇⚡️
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 900, color: '#FFF', fontFamily: 'var(--font-display)' }}>
                    BAT AI 🦇⚡️
                  </h4>
                  <span style={{ fontSize: '0.68rem', color: '#00F090', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                    ● Resumes · Math · Hackathons · All Qs
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={() => setIsMinimized(!isMinimized)} style={{ background: 'transparent', border: 'none', color: '#FFF', cursor: 'pointer', padding: '4px' }}>
                  {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                </button>
                <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: '#FF007F', cursor: 'pointer', padding: '4px' }}>
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* BAT AI Quick Action Chips */}
            {!isMinimized && (
              <div style={{ display: 'flex', gap: '6px', padding: '8px 12px', background: 'rgba(0,0,0,0.4)', overflowX: 'auto', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <button onClick={() => handleSend('Solve math problem step by step')} className="vibrant-badge-gold cursor-pointer" style={{ fontSize: '0.68rem', padding: '4px 10px' }}>
                  <Calculator size={11} /> Solve Math
                </button>
                <button onClick={() => handleSend('Build my ATS resume for target job')} className="vibrant-badge-pink cursor-pointer" style={{ fontSize: '0.68rem', padding: '4px 10px' }}>
                  <FileText size={11} /> Build Resume
                </button>
                <button onClick={() => handleSend('Nearest hackathon location details near me')} className="vibrant-badge-cyan cursor-pointer" style={{ fontSize: '0.68rem', padding: '4px 10px' }}>
                  <MapPin size={11} /> Nearest Hackathon
                </button>
              </div>
            )}

            {/* Chat Messages */}
            {!isMinimized && (
              <>
                <div style={{ flex: 1, padding: '14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      style={{
                        alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '88%',
                        padding: '10px 14px',
                        borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                        background: m.role === 'user'
                          ? 'linear-gradient(135deg, rgba(255,0,127,0.25), rgba(255,215,0,0.15))'
                          : 'rgba(255,255,255,0.06)',
                        border: m.role === 'user' ? '1px solid rgba(255,0,127,0.4)' : '1px solid rgba(255,255,255,0.1)',
                        fontSize: '0.82rem',
                        lineHeight: 1.5,
                        color: '#FFF0F5',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                        whiteSpace: 'pre-line',
                      }}
                    >
                      {m.content}
                    </div>
                  ))}

                  {isTyping && (
                    <div style={{ alignSelf: 'flex-start', padding: '8px 14px', borderRadius: '14px', background: 'rgba(255,255,255,0.06)', display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <RefreshCw size={14} style={{ color: '#FF007F', animation: 'spin 1s linear infinite' }} />
                      <span style={{ fontSize: '0.75rem', color: '#FFD700', fontFamily: 'var(--font-mono)' }}>BAT AI is thinking...</span>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div style={{ padding: '10px 12px', borderTop: '1px solid rgba(255,0,127,0.25)', background: '#090612', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    placeholder="Ask BAT AI math, resumes, hackathons, any question..."
                    style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,0,127,0.3)', borderRadius: '12px', padding: '10px 12px', color: '#fff', fontSize: '0.82rem', outline: 'none' }}
                  />
                  <button
                    onClick={() => handleSend()}
                    className="vibrant-btn-pink"
                    style={{ padding: '8px 14px', borderRadius: '12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    Send 🦇
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
