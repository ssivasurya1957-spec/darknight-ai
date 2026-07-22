'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Copy, Check, ExternalLink, Send, FileText, Loader2 } from 'lucide-react';

export default function ApplyAssistantModal({ isOpen, onClose, opportunity }) {
  const [activeTab, setActiveTab] = useState('cover'); // 'cover' | 'outreach'
  const [coverLetter, setCoverLetter] = useState('');
  const [outreachMsg, setOutreachMsg] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateContent = async () => {
    if (!opportunity) return;
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `Write a tailored application kit for the role: ${opportunity.title} at ${opportunity.organization} (${opportunity.domain}).
            
Return response with TWO labeled sections:
---COVER LETTER---
(Write a compelling 3-paragraph cover letter tailored to this role)

---LINKEDIN OUTREACH---
(Write a concise 3-sentence LinkedIn cold outreach message to the Hiring Manager)`
          }],
          userProfile: { name: 'Applicant' }
        })
      });

      const data = await res.json();
      if (data.reply) {
        const text = data.reply;
        const coverPart = text.split('---LINKEDIN OUTREACH---')[0]?.replace('---COVER LETTER---', '').trim();
        const outreachPart = text.split('---LINKEDIN OUTREACH---')[1]?.trim();
        setCoverLetter(coverPart || text);
        setOutreachMsg(outreachPart || 'Hi! I noticed the opening for ' + opportunity.title + ' at ' + opportunity.organization + '. With my background in ' + (opportunity.skills?.[0] || 'tech') + ', I would love to connect and share how I can add value to your team!');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  React.useEffect(() => {
    if (isOpen && opportunity && !coverLetter) {
      generateContent();
    }
  }, [isOpen, opportunity]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen || !opportunity) return null;

  return (
    <AnimatePresence>
      <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          style={{ background: '#0a0a0f', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '20px', padding: '28px', maxWidth: '620px', width: '100%', boxShadow: '0 24px 80px rgba(0,0,0,0.9)' }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', padding: '2px 8px', borderRadius: '12px', background: 'rgba(212,175,55,0.15)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.3)' }}>
                  ONE-CLICK APPLY ASSISTANT
                </span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: '#F5E6C8', margin: '0 0 2px' }}>
                {opportunity.title}
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                {opportunity.organization} · {opportunity.location}
              </p>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}>
              <X size={20} />
            </button>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px', marginBottom: '16px' }}>
            <button
              onClick={() => setActiveTab('cover')}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '8px', border: 'none',
                background: activeTab === 'cover' ? 'rgba(212,175,55,0.15)' : 'transparent',
                color: activeTab === 'cover' ? '#D4AF37' : 'var(--text-secondary)',
                fontFamily: 'var(--font-mono)', fontSize: '0.78rem', cursor: 'pointer'
              }}
            >
              <FileText size={14} /> Tailored Cover Letter
            </button>
            <button
              onClick={() => setActiveTab('outreach')}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '8px', border: 'none',
                background: activeTab === 'outreach' ? 'rgba(10,102,194,0.15)' : 'transparent',
                color: activeTab === 'outreach' ? '#0A66C2' : 'var(--text-secondary)',
                fontFamily: 'var(--font-mono)', fontSize: '0.78rem', cursor: 'pointer'
              }}
            >
              <Send size={14} /> LinkedIn Recruiter Message
            </button>
          </div>

          {/* Content Box */}
          <div style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '16px', minHeight: '200px', maxHeight: '300px', overflowY: 'auto', marginBottom: '16px' }}>
            {isGenerating ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '180px', flexDirection: 'column', gap: '10px' }}>
                <Loader2 size={24} style={{ color: '#D4AF37', animation: 'spin 1s linear infinite' }} />
                <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                  Gemini 1.5 Flash is writing custom application copy...
                </span>
              </div>
            ) : (
              <p style={{ fontSize: '0.85rem', color: '#e8e8e8', lineHeight: 1.6, whiteSpace: 'pre-wrap', margin: 0 }}>
                {activeTab === 'cover' ? coverLetter : outreachMsg}
              </p>
            )}
          </div>

          {/* Footer Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              onClick={() => copyToClipboard(activeTab === 'cover' ? coverLetter : outreachMsg)}
              disabled={isGenerating || (!coverLetter && !outreachMsg)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', borderRadius: '10px', border: '1px solid rgba(212,175,55,0.3)', background: 'rgba(212,175,55,0.1)', color: '#D4AF37', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', cursor: 'pointer' }}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied to Clipboard!' : 'Copy Text'}
            </button>

            <a
              href={opportunity.applyUrl || opportunity.link || '#'}
              target="_blank"
              rel="noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px', borderRadius: '10px', background: 'linear-gradient(135deg, #D4AF37, #F5D767)', color: '#000', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', fontWeight: 800, textDecoration: 'none' }}
            >
              Launch Direct Application <ExternalLink size={14} />
            </a>
          </div>
        </motion.div>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </AnimatePresence>
  );
}
