'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, Bot, Trash2, Sparkles, RefreshCw, User, Key, Check, X, Code2, Globe } from 'lucide-react';

const CHATGPT_PROMPTS = [
  { label: '🧮 Solve Math & Calculus', prompt: 'Solve this math problem step by step: Evaluate integral of x^2 * e^x dx' },
  { label: '📄 Build ATS Resume', prompt: 'Build me a 1-page ATS optimized resume for a Full Stack Software Engineer at Google.' },
  { label: '📍 Nearest Hackathon', prompt: 'What are the nearest hackathon venue locations near my city with Google Maps directions?' },
  { label: '💻 Write Python Script', prompt: 'Write an optimized Python script for a binary search tree with O(log N) operations.' },
  { label: '💡 General Knowledge Q', prompt: 'Explain quantum entanglement in simple terms for a beginner.' },
];

function MarkdownText({ text }) {
  const html = text
    .replace(/```([\s\S]*?)```/g, '<pre style="background:#090614;padding:14px;border-radius:12px;border:1px solid rgba(0,245,255,0.3);font-family:monospace;font-size:0.85em;overflow-x:auto;color:#00F5FF;margin:10px 0"><code>$1</code></pre>')
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#FFF0F5">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code style="background:rgba(255,0,127,0.15);padding:2px 6px;border-radius:4px;font-family:monospace;font-size:0.85em;color:#FFD700">$1</code>')
    .replace(/^### (.*$)/gm, '<h3 style="color:#FFD700;font-size:0.95rem;font-weight:700;margin:12px 0 4px">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 style="color:#FF007F;font-size:1.05rem;font-weight:800;margin:14px 0 6px">$1</h2>')
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

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const CHAT_STORAGE_KEY = 'darknight_chat_history';

  useEffect(() => {
    try {
      const stored = localStorage.getItem('darknight_user');
      if (stored) setUserProfile(JSON.parse(stored));

      const savedMsgs = localStorage.getItem(CHAT_STORAGE_KEY);
      if (savedMsgs) {
        setMessages(JSON.parse(savedMsgs).slice(-80));
      } else {
        setMessages([{
          id: 'welcome',
          role: 'ai',
          content: `🦇⚡️ **Welcome to BAT AI (Universal Chatbot)**\n\nI am **BAT AI** — your universal AI assistant. Ask me ANY question on ANY topic!\n\n• 🧮 **Math & Calculus Problem Solving**\n• 📄 **1-Click ATS Resume Building**\n• 📍 **Nearest Hackathon Location Details & Navigation**\n• 💻 **Code Generation & Technical Debugging**\n• 🌐 **General Knowledge, Science & Learning**\n\n*Type your question below!* 💖`,
          timestamp: new Date().toISOString(),
        }]);
      }

      const urlParams = new URLSearchParams(window.location.search);
      const promptParam = urlParams.get('prompt');
      if (promptParam) {
        setTimeout(() => sendMessage(promptParam), 500);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

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

    if (textareaRef.current) textareaRef.current.style.height = '48px';

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
          userProfile: userProfile || JSON.parse(localStorage.getItem('darknight_user') || '{}'),
          userApiKey: localStorage.getItem('gemini_api_key') || '',
        }),
      });

      const data = await res.json();
      const aiMsg = {
        id: `ai-${Date.now()}`,
        role: 'ai',
        content: data.reply || `🦇⚡️ **BAT AI**: Ready! Ask me math equations, code, resumes, or any topic!`,
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [...prev, {
        id: `ai-${Date.now()}`,
        role: 'ai',
        content: `🦇⚡️ **BAT AI**: Ready! Ask me any question on any topic!`,
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setIsTyping(false);
    }
  }, [messages, isTyping, userProfile]);

  const clearChat = () => {
    localStorage.removeItem(CHAT_STORAGE_KEY);
    setMessages([{
      id: 'welcome',
      role: 'ai',
      content: `🦇⚡️ **BAT AI Active!** Ask me any question on any topic! 💖`,
      timestamp: new Date().toISOString(),
    }]);
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      
      {/* ChatGPT Style Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(18,12,35,0.9)', border: '1px solid rgba(255,0,127,0.3)', borderRadius: '16px', marginBottom: '16px', backdropFilter: 'blur(12px)', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, #FF007F, #FFD700)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', boxShadow: '0 0 15px rgba(255,0,127,0.5)' }}>
            🦇⚡️
          </div>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 900, color: '#FFF', margin: 0 }}>
              BAT AI <span style={{ fontSize: '0.72rem', color: '#FFD700', fontWeight: 700 }}>(Universal AI Chatbot)</span>
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: '#00F090' }}>
              <span>● Universal Answering Active</span>
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
              <span style={{ color: '#00F5FF' }}>Ask Any Question</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={clearChat} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '10px', border: '1px solid rgba(255,0,127,0.3)', background: 'rgba(255,0,127,0.1)', color: '#FF007F', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', cursor: 'pointer', fontWeight: 700 }}>
            <Trash2 size={13} /> Clear Chat
          </button>
        </div>
      </div>

      {/* Conversation Thread */}
      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '8px', display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '140px' }}>
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', gap: '12px', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}
          >
            {msg.role === 'ai' && (
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #FF007F, #FFD700)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.9rem', boxShadow: '0 0 10px rgba(255,0,127,0.5)' }}>
                🦇
              </div>
            )}

            <div style={{ maxWidth: '82%', display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                padding: '14px 18px',
                borderRadius: msg.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                background: msg.role === 'user'
                  ? 'linear-gradient(135deg, rgba(255,0,127,0.25), rgba(255,215,0,0.15))'
                  : 'rgba(24,18,43,0.95)',
                border: msg.role === 'user'
                  ? '1px solid rgba(255,0,127,0.4)'
                  : '1px solid rgba(255,255,255,0.08)',
                fontSize: '0.9rem',
                lineHeight: 1.6,
                color: '#FFF0F5',
                boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
              }}>
                <MarkdownText text={msg.content} />
              </div>
            </div>

            {msg.role === 'user' && (
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#aaa' }}>
                <User size={16} />
              </div>
            )}
          </motion.div>
        ))}

        {isTyping && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #FF007F, #FFD700)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>
              🦇
            </div>
            <div style={{ padding: '10px 16px', borderRadius: '16px', background: 'rgba(24,18,43,0.9)', border: '1px solid rgba(255,0,127,0.3)', color: '#FFD700', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} /> BAT AI is generating answer...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ChatGPT Style Fixed Bottom Input Container */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px 0 16px', background: 'linear-gradient(to top, #070510 80%, transparent)' }}>
        
        {/* Quick ChatGPT Prompt Chips */}
        {messages.length <= 2 && (
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px', scrollbarWidth: 'none' }}>
            {CHATGPT_PROMPTS.map((p, i) => (
              <button key={i} onClick={() => sendMessage(p.prompt)} className="vibrant-badge-pink cursor-pointer" style={{ whiteSpace: 'nowrap', fontSize: '0.72rem', flexShrink: 0 }}>
                {p.label}
              </button>
            ))}
          </div>
        )}

        {/* Big ChatGPT Input Box */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', background: 'rgba(18,12,35,0.95)', border: '1.5px solid rgba(255,0,127,0.4)', borderRadius: '20px', padding: '10px 16px', boxShadow: '0 0 30px rgba(255,0,127,0.2)' }}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = '48px';
              e.target.style.height = Math.min(e.target.scrollHeight, 140) + 'px';
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage(input);
              }
            }}
            placeholder="Ask BAT AI any question on any topic (coding, math, science, resumes, hackathons)..."
            rows={1}
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#FFF', fontFamily: 'inherit', fontSize: '0.92rem', resize: 'none', minHeight: '48px', maxHeight: '140px', padding: '10px 0', lineHeight: 1.5 }}
          />

          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isTyping}
            className="vibrant-btn-pink"
            style={{
              width: '42px', height: '42px', borderRadius: '12px', flexShrink: 0,
              opacity: input.trim() && !isTyping ? 1 : 0.4,
              cursor: input.trim() && !isTyping ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '3px',
            }}
          >
            <ArrowUp size={20} />
          </button>
        </div>
        <p style={{ textAlign: 'center', fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '8px' }}>
          BAT AI (ChatGPT & Gemini Engine) · Pure Universal Question Answering
        </p>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
