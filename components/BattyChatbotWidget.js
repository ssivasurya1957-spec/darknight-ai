'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles, RefreshCw, Minimize2, Maximize2, Heart } from 'lucide-react';

export default function BattyChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'ai',
      content: `🦇✨ **Batty AI Chatbot Active!**\n\nHi Cutie! I'm your interactive 24/7 Batcave Chatbot. Ask me about live job openings, salary benchmarks, cute hackathons, or ATS resume tailoring! 💖`,
      timestamp: new Date().toISOString(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
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
      const aiReply = data.reply || `🦇 **Batty AI**: Operational! Ask me about jobs, hackathons, or resumes! 💖`;

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
          content: `🦇 **Batty AI**: Active! How can I assist your career today, cutie? 💖`,
          timestamp: new Date().toISOString(),
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* 3D Floating Batty Widget Launcher */}
      {!isOpen && (
        <motion.button
          onClick={() => setIsOpen(true)}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          className="bat-3d-float"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 999,
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #FFD700 0%, #D4AF37 50%, #FF2A5F 100%)',
            border: '3px solid #FFF0B3',
            boxShadow: '0 10px 25px rgba(255, 215, 0, 0.5), 0 0 40px rgba(255, 42, 95, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#000',
            fontSize: '1.6rem',
          }}
        >
          🦇✨
        </motion.button>
      )}

      {/* 3D Chatbot Modal Window */}
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
              width: '380px',
              maxWidth: 'calc(100vw - 32px)',
              height: isMinimized ? '64px' : '520px',
              maxHeight: 'calc(100vh - 100px)',
              background: 'linear-gradient(145deg, #191626 0%, #0c0b13 100%)',
              border: '2px solid rgba(255, 215, 0, 0.4)',
              borderRadius: '24px',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.95), 0 0 35px rgba(255, 215, 0, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              transition: 'height 0.3s ease',
            }}
          >
            {/* Chatbot Header */}
            <div style={{ padding: '14px 18px', background: 'linear-gradient(90deg, rgba(255,215,0,0.15), rgba(255,42,95,0.15))', borderBottom: '1px solid rgba(255,215,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #FFD700, #FF2A5F)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', boxShadow: '0 0 12px rgba(255,215,0,0.5)' }}>
                  🦇
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, color: '#FFF0B3', fontFamily: 'var(--font-mono)' }}>
                    Batty AI Chatbot 💖
                  </h4>
                  <span style={{ fontSize: '0.68rem', color: '#10B981', fontFamily: 'var(--font-mono)' }}>
                    ● 24/7 Interactive Copilot
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={() => setIsMinimized(!isMinimized)} style={{ background: 'transparent', border: 'none', color: '#FFF0B3', cursor: 'pointer', padding: '4px' }}>
                  {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                </button>
                <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: '#FF2A5F', cursor: 'pointer', padding: '4px' }}>
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            {!isMinimized && (
              <>
                <div style={{ flex: 1, padding: '14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      style={{
                        alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '85%',
                        padding: '10px 14px',
                        borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                        background: m.role === 'user'
                          ? 'linear-gradient(135deg, rgba(255,215,0,0.25), rgba(255,215,0,0.1))'
                          : 'rgba(255,255,255,0.05)',
                        border: m.role === 'user' ? '1px solid rgba(255,215,0,0.4)' : '1px solid rgba(255,255,255,0.1)',
                        fontSize: '0.82rem',
                        lineHeight: 1.5,
                        color: '#FFF0F5',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                        whiteSpace: 'pre-line',
                      }}
                    >
                      {m.content}
                    </div>
                  ))}

                  {isTyping && (
                    <div style={{ alignSelf: 'flex-start', padding: '8px 14px', borderRadius: '14px', background: 'rgba(255,255,255,0.05)', display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <RefreshCw size={14} style={{ color: '#FFD700', animation: 'spin 1s linear infinite' }} />
                      <span style={{ fontSize: '0.75rem', color: '#FFD700', fontFamily: 'var(--font-mono)' }}>Batty AI is typing...</span>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div style={{ padding: '10px 12px', borderTop: '1px solid rgba(255,215,0,0.2)', background: '#090810', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    placeholder="Ask Batty AI anything..."
                    style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,215,0,0.25)', borderRadius: '12px', padding: '10px 12px', color: '#fff', fontSize: '0.82rem', outline: 'none' }}
                  />
                  <button
                    onClick={handleSend}
                    className="bat-3d-button"
                    style={{ padding: '8px 14px', borderRadius: '12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Send size={14} />
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
