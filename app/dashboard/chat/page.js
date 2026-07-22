'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, Bot, Trash2, Sparkles, RefreshCw, User, Briefcase, Code, Trophy, FlaskConical } from 'lucide-react';

const QUICK_PROMPTS = [
  { label: '💼 Jobs for me', prompt: 'What are the best job opportunities matching my skills right now?' },
  { label: '🏆 Hackathons', prompt: 'Show me upcoming hackathons I can participate in this month.' },
  { label: '🎓 Internships', prompt: 'Find remote internships in AI/ML with good stipends.' },
  { label: '🔬 Research', prompt: 'Are there any research funding opportunities or PhD positions?' },
  { label: '💰 Salary guide', prompt: 'What is the average salary for a software engineer in India right now?' },
  { label: '📄 Resume tips', prompt: 'Help me improve my resume for a product manager role.' },
];

function MarkdownText({ text }) {
  // Simple markdown renderer
  const html = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code style="background:rgba(212,175,55,0.1);padding:1px 5px;border-radius:3px;font-family:monospace;font-size:0.85em">$1</code>')
    .replace(/^### (.*$)/gm, '<h3 style="color:#F5E6C8;font-weight:700;margin:12px 0 4px;font-size:0.9rem">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 style="color:#D4AF37;font-weight:800;margin:14px 0 6px;font-size:1rem">$1</h2>')
    .replace(/^- (.*$)/gm, '<li style="margin:4px 0;padding-left:4px">$1</li>')
    .replace(/(<li.*<\/li>\n?)+/g, (m) => `<ul style="margin:6px 0;padding-left:16px;list-style:disc">${m}</ul>`)
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>');
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [showInterestSetup, setShowInterestSetup] = useState(false);
  const [interests, setInterests] = useState([]);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const CHAT_STORAGE_KEY = 'darknight_chat_history';
  const INTEREST_KEY = 'darknight_user_interests';

  // Load user profile + chat history
  useEffect(() => {
    try {
      const stored = localStorage.getItem('darknight_user');
      if (stored) setUserProfile(JSON.parse(stored));

      const savedInterests = localStorage.getItem(INTEREST_KEY);
      if (savedInterests) {
        setInterests(JSON.parse(savedInterests));
      }

      const savedMsgs = localStorage.getItem(CHAT_STORAGE_KEY);
      if (savedMsgs) {
        const parsed = JSON.parse(savedMsgs);
        setMessages(parsed.slice(-80));
      } else {
        setMessages([{
          id: 'welcome',
          role: 'ai',
          content: `Welcome, ${JSON.parse(localStorage.getItem('darknight_user') || '{}')?.name || 'Agent'}! I'm your personal DarkKnight AI career assistant.\n\nI remember our past conversations and know your interests. Ask me anything — job openings, salary benchmarks, hackathon strategies, or resume tailoring.\n\n*What goal can I help you achieve today?*`,
          timestamp: new Date().toISOString(),
        }]);
      }

      // Check if URL has ?prompt=
      const urlParams = new URLSearchParams(window.location.search);
      const promptParam = urlParams.get('prompt');
      if (promptParam) {
        setTimeout(() => sendMessage(promptParam), 500);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Persist messages
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages.slice(-80)));
      } catch (e) {}
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || isTyping) return;

    setError('');
    const userMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setIsTyping(true);

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = '48px';
    }

    try {
      const profile = {
        ...userProfile,
        interests: interests,
      };

      const savedKey = localStorage.getItem('gemini_api_key') || '';
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          userProfile: profile,
          userApiKey: savedKey,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'AI response failed');
      }

      const aiMsg = {
        id: `ai-${Date.now()}`,
        role: 'ai',
        content: data.reply,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
    } finally {
      setIsTyping(false);
    }
  }, [messages, isTyping, userProfile, interests]);

  const clearHistory = () => {
    localStorage.removeItem(CHAT_STORAGE_KEY);
    setMessages([{
      id: 'cleared',
      role: 'ai',
      content: 'Chat memory cleared. Fresh start! What career goal can I help you achieve today?',
      timestamp: new Date().toISOString(),
    }]);
  };

  const saveInterests = (selected) => {
    setInterests(selected);
    localStorage.setItem(INTEREST_KEY, JSON.stringify(selected));
    setShowInterestSetup(false);
    // Greet with interests
    sendMessage(`My career interests are: ${selected.join(', ')}. Help me find the best opportunities.`);
  };

  const formatTime = (iso) => {
    try {
      return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch { return ''; }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 60px)', maxWidth: '860px', margin: '0 auto', width: '100%', position: 'relative' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid rgba(212,175,55,0.12)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D4AF37' }}>
            <Sparkles size={18} />
          </div>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 800, color: '#F5E6C8', textTransform: 'uppercase', margin: 0, letterSpacing: '0.06em' }}>
              Personal AI Agent
            </h1>
            <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: '#22C55E' }}>
              ● MEMORY ACTIVE · {messages.length} messages stored
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setShowInterestSetup(true)}
            style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.25)', background: 'transparent', color: '#D4AF37', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', cursor: 'pointer' }}
          >
            ⚙ Interests
          </button>
          <button
            onClick={clearHistory}
            style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid rgba(255,80,80,0.2)', background: 'transparent', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            title="Clear chat memory"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Interest Setup Modal */}
      <AnimatePresence>
        {showInterestSetup && (
          <InterestSetupModal
            current={interests}
            onSave={saveInterests}
            onClose={() => setShowInterestSetup(false)}
          />
        )}
      </AnimatePresence>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '140px' }}>
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: '8px' }}
          >
            {msg.role === 'ai' && (
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'linear-gradient(135deg, #D4AF37, #B8960C)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.6rem', fontWeight: 900, color: '#000' }}>
                DK
              </div>
            )}

            <div style={{ maxWidth: '80%', display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                padding: '12px 16px',
                borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                background: msg.role === 'user'
                  ? 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.1))'
                  : 'rgba(14,14,20,0.9)',
                border: msg.role === 'user'
                  ? '1px solid rgba(212,175,55,0.35)'
                  : '1px solid rgba(255,255,255,0.06)',
                fontSize: '0.875rem',
                lineHeight: 1.65,
                color: '#e8e8e8',
              }}>
                <MarkdownText text={msg.content} />
              </div>
              <span style={{ fontSize: '0.62rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: '4px', marginLeft: '4px', marginRight: '4px' }}>
                {formatTime(msg.timestamp)}
              </span>
            </div>

            {msg.role === 'user' && (
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#aaa' }}>
                <User size={14} />
              </div>
            )}
          </motion.div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'linear-gradient(135deg, #D4AF37, #B8960C)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 900, color: '#000' }}>
              DK
            </div>
            <div style={{ padding: '12px 16px', borderRadius: '16px 16px 16px 4px', background: 'rgba(14,14,20,0.9)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '5px', alignItems: 'center' }}>
              {[0, 0.2, 0.4].map((delay, i) => (
                <motion.div key={i} style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#D4AF37' }}
                  animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay }} />
              ))}
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px 16px 20px', background: 'linear-gradient(to top, #040406 60%, transparent)', flexShrink: 0 }}>
        {/* Quick prompts — only on first load */}
        {messages.length <= 2 && (
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px', scrollbarWidth: 'none' }}>
            {QUICK_PROMPTS.map((p, i) => (
              <button key={i} onClick={() => sendMessage(p.prompt)}
                style={{ whiteSpace: 'nowrap', padding: '6px 14px', borderRadius: '20px', border: '1px solid rgba(212,175,55,0.2)', background: 'rgba(212,175,55,0.06)', color: '#D4AF37', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', cursor: 'pointer', flexShrink: 0, transition: 'all 0.15s' }}>
                {p.label}
              </button>
            ))}
          </div>
        )}

        {error && (
          <div style={{ marginBottom: '8px', padding: '8px 12px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', fontSize: '0.78rem', color: '#ef4444', fontFamily: 'var(--font-mono)' }}>
            ⚠ {error}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', background: 'rgba(12,12,18,0.95)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '16px', padding: '8px 12px', boxShadow: '0 0 20px rgba(212,175,55,0.06)' }}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = '48px';
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage(input);
              }
            }}
            placeholder="Ask about jobs, salaries, hackathons, career advice..."
            rows={1}
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#e8e8e8', fontFamily: 'inherit', fontSize: '0.9rem', resize: 'none', minHeight: '48px', maxHeight: '120px', padding: '12px 4px', lineHeight: 1.5 }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isTyping}
            style={{
              width: '40px', height: '40px', borderRadius: '10px', border: 'none', flexShrink: 0,
              background: input.trim() && !isTyping ? 'linear-gradient(135deg, #D4AF37, #F5D767)' : 'rgba(255,255,255,0.05)',
              color: input.trim() && !isTyping ? '#000' : '#555', cursor: input.trim() && !isTyping ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s', marginBottom: '4px',
            }}
          >
            {isTyping ? <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <ArrowUp size={18} />}
          </button>
        </div>
        <p style={{ textAlign: 'center', fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '8px' }}>
          Powered by Google Gemini · Memories saved locally · Press Shift+Enter for new line
        </p>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── Interest Setup Modal ─────────────────────────────────────────────────────
const INTEREST_OPTIONS = [
  { label: 'Software Engineering', icon: <Code size={16} /> },
  { label: 'Machine Learning / AI', icon: <Sparkles size={16} /> },
  { label: 'Product Management', icon: <Briefcase size={16} /> },
  { label: 'Data Science', icon: <FlaskConical size={16} /> },
  { label: 'Frontend / UI', icon: <Code size={16} /> },
  { label: 'Backend Engineering', icon: <Code size={16} /> },
  { label: 'DevOps / Cloud', icon: <Code size={16} /> },
  { label: 'Cybersecurity', icon: <Trophy size={16} /> },
  { label: 'Research & Academia', icon: <FlaskConical size={16} /> },
  { label: 'Freelancing', icon: <Briefcase size={16} /> },
  { label: 'Hackathons', icon: <Trophy size={16} /> },
  { label: 'Startup / Entrepreneurship', icon: <Sparkles size={16} /> },
];

function InterestSetupModal({ current, onSave, onClose }) {
  const [selected, setSelected] = useState(current || []);

  const toggle = (label) => {
    setSelected(prev => prev.includes(label) ? prev.filter(i => i !== label) : [...prev, label]);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ position: 'absolute', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        style={{ background: '#0c0c14', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '20px', padding: '28px', maxWidth: '480px', width: '100%', boxShadow: '0 24px 60px rgba(0,0,0,0.8)' }}
      >
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: '#F5E6C8', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 6px' }}>
          Career Interests
        </h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '20px', fontFamily: 'var(--font-mono)' }}>
          Select all that apply. I'll personalize your job alerts and advice accordingly.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
          {INTEREST_OPTIONS.map(({ label, icon }) => (
            <button
              key={label}
              onClick={() => toggle(label)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '20px', border: '1px solid',
                borderColor: selected.includes(label) ? '#D4AF37' : 'rgba(255,255,255,0.08)',
                background: selected.includes(label) ? 'rgba(212,175,55,0.15)' : 'transparent',
                color: selected.includes(label) ? '#D4AF37' : 'var(--text-secondary)',
                fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.15s',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {icon} {label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => onSave(selected)}
            disabled={selected.length === 0}
            style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: selected.length > 0 ? 'linear-gradient(135deg, #D4AF37, #F5D767)' : 'rgba(255,255,255,0.05)', color: selected.length > 0 ? '#000' : '#555', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.85rem', cursor: selected.length > 0 ? 'pointer' : 'default' }}
          >
            Save & Personalize AI ({selected.length} selected)
          </button>
          {current.length > 0 && (
            <button onClick={onClose}
              style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              Cancel
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
