'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Download, RefreshCw, Plus, Trash2, Loader2, Sparkles } from 'lucide-react';

const TEMPLATES = ['Modern Dark', 'Classic Clean', 'Tech Minimal'];

export default function ResumePage() {
  const { data: session } = useSession();
  const [template, setTemplate] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const previewRef = useRef(null);

  const [resume, setResume] = useState({
    name: '',
    title: 'Software Engineer',
    email: '',
    phone: '',
    linkedin: '',
    github: '',
    summary: '',
    education: [{ degree: 'B.Tech Computer Science', institution: 'IIT Delhi', year: '2022–2026', gpa: '8.5/10' }],
    experience: [{ role: '', company: '', duration: '', points: [''] }],
    skills: { languages: 'Python, JavaScript, Java', frameworks: 'React, Node.js, FastAPI', tools: 'Git, Docker, AWS, PostgreSQL' },
    projects: [{ name: '', tech: '', description: '', link: '' }],
    achievements: [''],
  });

  useEffect(() => {
    const stored = localStorage.getItem('resume_data');
    if (stored) {
      setResume(JSON.parse(stored));
    } else if (session?.user) {
      setResume(prev => ({ ...prev, name: session.user.name || '', email: session.user.email || '' }));
    }
  }, [session]);

  const save = (updated) => {
    setResume(updated);
    localStorage.setItem('resume_data', JSON.stringify(updated));
  };

  const generateWithAI = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: `Generate a professional 3-sentence resume summary for a ${resume.title} named ${resume.name || 'the user'}. Skills include: ${resume.skills.languages}, ${resume.skills.frameworks}. Keep it concise, impactful, and ATS-optimized.` }],
          userProfile: { name: resume.name },
        }),
      });
      const data = await res.json();
      if (data.reply) save({ ...resume, summary: data.reply.replace(/^```[\w]*\n?/, '').replace(/```$/, '').trim() });
    } catch (e) {}
    setIsGenerating(false);
  };

  const downloadPDF = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${resume.name} — Resume</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 11px; color: #1a1a1a; line-height: 1.5; padding: 32px; max-width: 800px; margin: 0 auto; }
          h1 { font-size: 24px; font-weight: 700; color: #1a1a1a; margin-bottom: 2px; }
          .subtitle { font-size: 13px; color: #555; margin-bottom: 8px; }
          .contact { display: flex; flex-wrap: wrap; gap: 12px; font-size: 10px; color: #555; margin-bottom: 16px; }
          .section-title { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #1a1a1a; border-bottom: 2px solid #1a1a1a; padding-bottom: 3px; margin: 14px 0 8px; }
          .summary { color: #333; margin-bottom: 4px; }
          .exp-header { display: flex; justify-content: space-between; font-weight: 600; margin-bottom: 4px; }
          .exp-company { color: #555; font-size: 10px; }
          ul { padding-left: 16px; }
          li { margin-bottom: 2px; }
          .skills-row { display: flex; gap: 8px; margin-bottom: 4px; }
          .skill-label { font-weight: 600; min-width: 80px; }
          .project-title { font-weight: 600; }
          .project-tech { color: #555; font-size: 10px; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <h1>${resume.name || 'Your Name'}</h1>
        <div class="subtitle">${resume.title}</div>
        <div class="contact">
          ${resume.email ? `<span>✉ ${resume.email}</span>` : ''}
          ${resume.phone ? `<span>📞 ${resume.phone}</span>` : ''}
          ${resume.linkedin ? `<span>in/${resume.linkedin}</span>` : ''}
          ${resume.github ? `<span>github.com/${resume.github}</span>` : ''}
        </div>
        ${resume.summary ? `<div class="section-title">Professional Summary</div><p class="summary">${resume.summary}</p>` : ''}
        <div class="section-title">Education</div>
        ${resume.education.map(e => `<div><div class="exp-header"><span>${e.degree}</span><span>${e.year}</span></div><div class="exp-company">${e.institution}${e.gpa ? ' · GPA: ' + e.gpa : ''}</div></div>`).join('')}
        ${resume.experience.filter(e => e.role).length > 0 ? `<div class="section-title">Experience</div>
        ${resume.experience.filter(e => e.role).map(e => `<div style="margin-bottom:8px"><div class="exp-header"><span>${e.role}</span><span>${e.duration}</span></div><div class="exp-company">${e.company}</div><ul>${e.points.filter(Boolean).map(p => `<li>${p}</li>`).join('')}</ul></div>`).join('')}` : ''}
        <div class="section-title">Skills</div>
        ${Object.entries(resume.skills).map(([k, v]) => v ? `<div class="skills-row"><span class="skill-label">${k.charAt(0).toUpperCase() + k.slice(1)}:</span><span>${v}</span></div>` : '').join('')}
        ${resume.projects.filter(p => p.name).length > 0 ? `<div class="section-title">Projects</div>
        ${resume.projects.filter(p => p.name).map(p => `<div style="margin-bottom:8px"><div class="exp-header"><span class="project-title">${p.name}</span>${p.link ? `<a href="${p.link}">${p.link}</a>` : ''}</div>${p.tech ? `<div class="project-tech">${p.tech}</div>` : ''}${p.description ? `<p>${p.description}</p>` : ''}</div>`).join('')}` : ''}
        ${resume.achievements.filter(Boolean).length > 0 ? `<div class="section-title">Achievements</div><ul>${resume.achievements.filter(Boolean).map(a => `<li>${a}</li>`).join('')}</ul>` : ''}
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 500);
  };

  const updateExp = (idx, field, val) => {
    const updated = [...resume.experience];
    updated[idx] = { ...updated[idx], [field]: val };
    save({ ...resume, experience: updated });
  };

  const updateExpPoint = (expIdx, ptIdx, val) => {
    const updated = [...resume.experience];
    const pts = [...updated[expIdx].points];
    pts[ptIdx] = val;
    updated[expIdx] = { ...updated[expIdx], points: pts };
    save({ ...resume, experience: updated });
  };

  const updateProject = (idx, field, val) => {
    const updated = [...resume.projects];
    updated[idx] = { ...updated[idx], [field]: val };
    save({ ...resume, projects: updated });
  };

  const Field = ({ label, value, onChange, placeholder, multiline }) => (
    <div style={{ marginBottom: '10px' }}>
      <label style={{ display: 'block', fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>{label}</label>
      {multiline
        ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3}
            style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.15)', background: 'rgba(255,255,255,0.03)', color: '#e8e8e8', fontFamily: 'inherit', fontSize: '0.85rem', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
        : <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
            style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.15)', background: 'rgba(255,255,255,0.03)', color: '#e8e8e8', fontFamily: 'inherit', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }} />
      }
    </div>
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 20px 80px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color: '#F5E6C8', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 4px' }}>
            📄 Resume Builder
          </h1>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
            Build · AI-enhance · Download as PDF
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={generateWithAI} disabled={isGenerating}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '10px', border: '1px solid rgba(212,175,55,0.3)', background: 'rgba(212,175,55,0.1)', color: '#D4AF37', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}>
            {isGenerating ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Sparkles size={16} />}
            AI Summary
          </button>
          <button onClick={downloadPDF}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #D4AF37, #F5D767)', color: '#000', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 700 }}>
            <Download size={16} /> Download PDF
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Left: Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Personal Info */}
          <Section title="Personal Info">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <Field label="Full Name" value={resume.name} onChange={v => save({ ...resume, name: v })} placeholder="Arjun Sharma" />
              <Field label="Title" value={resume.title} onChange={v => save({ ...resume, title: v })} placeholder="Software Engineer" />
              <Field label="Email" value={resume.email} onChange={v => save({ ...resume, email: v })} placeholder="arjun@gmail.com" />
              <Field label="Phone" value={resume.phone} onChange={v => save({ ...resume, phone: v })} placeholder="+91 98765 43210" />
              <Field label="LinkedIn" value={resume.linkedin} onChange={v => save({ ...resume, linkedin: v })} placeholder="linkedin.com/in/arjun" />
              <Field label="GitHub" value={resume.github} onChange={v => save({ ...resume, github: v })} placeholder="github.com/arjun" />
            </div>
          </Section>

          {/* Summary */}
          <Section title="Professional Summary">
            <Field label="Summary" value={resume.summary} onChange={v => save({ ...resume, summary: v })} placeholder="Click 'AI Summary' to auto-generate, or write manually..." multiline />
          </Section>

          {/* Skills */}
          <Section title="Skills">
            <Field label="Programming Languages" value={resume.skills.languages} onChange={v => save({ ...resume, skills: { ...resume.skills, languages: v } })} placeholder="Python, JavaScript, Java, C++" />
            <Field label="Frameworks & Libraries" value={resume.skills.frameworks} onChange={v => save({ ...resume, skills: { ...resume.skills, frameworks: v } })} placeholder="React, Node.js, FastAPI, TensorFlow" />
            <Field label="Tools & Platforms" value={resume.skills.tools} onChange={v => save({ ...resume, skills: { ...resume.skills, tools: v } })} placeholder="Git, Docker, AWS, PostgreSQL, Figma" />
          </Section>

          {/* Experience */}
          <Section title="Experience" onAdd={() => save({ ...resume, experience: [...resume.experience, { role: '', company: '', duration: '', points: [''] }] })}>
            {resume.experience.map((exp, idx) => (
              <div key={idx} style={{ borderLeft: '2px solid rgba(212,175,55,0.2)', paddingLeft: '12px', marginBottom: '14px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                  <Field label="Role" value={exp.role} onChange={v => updateExp(idx, 'role', v)} placeholder="Software Engineer Intern" />
                  <Field label="Company" value={exp.company} onChange={v => updateExp(idx, 'company', v)} placeholder="Google" />
                  <Field label="Duration" value={exp.duration} onChange={v => updateExp(idx, 'duration', v)} placeholder="May–Aug 2025" />
                </div>
                {exp.points.map((pt, pi) => (
                  <div key={pi} style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
                    <input value={pt} onChange={e => updateExpPoint(idx, pi, e.target.value)} placeholder={`• Achievement ${pi + 1}`}
                      style={{ flex: 1, padding: '6px 10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', color: '#e8e8e8', fontFamily: 'inherit', fontSize: '0.82rem', outline: 'none' }} />
                    <button onClick={() => { const pts = exp.points.filter((_, i) => i !== pi); updateExp(idx, 'points', pts); }}
                      style={{ padding: '4px 8px', borderRadius: '6px', border: 'none', background: 'rgba(239,68,68,0.1)', color: '#ef4444', cursor: 'pointer' }}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
                <button onClick={() => updateExp(idx, 'points', [...exp.points, ''])}
                  style={{ fontSize: '0.72rem', color: '#D4AF37', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', padding: '2px 0' }}>
                  + Add point
                </button>
              </div>
            ))}
          </Section>

          {/* Projects */}
          <Section title="Projects" onAdd={() => save({ ...resume, projects: [...resume.projects, { name: '', tech: '', description: '', link: '' }] })}>
            {resume.projects.map((proj, idx) => (
              <div key={idx} style={{ borderLeft: '2px solid rgba(59,130,246,0.2)', paddingLeft: '12px', marginBottom: '14px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <Field label="Project Name" value={proj.name} onChange={v => updateProject(idx, 'name', v)} placeholder="AI Resume Builder" />
                  <Field label="Tech Stack" value={proj.tech} onChange={v => updateProject(idx, 'tech', v)} placeholder="React, Python, Gemini" />
                  <Field label="GitHub/Live Link" value={proj.link} onChange={v => updateProject(idx, 'link', v)} placeholder="github.com/..." />
                </div>
                <Field label="Description" value={proj.description} onChange={v => updateProject(idx, 'description', v)} placeholder="Brief 1-2 sentence description..." multiline />
              </div>
            ))}
          </Section>

          {/* Achievements */}
          <Section title="Achievements" onAdd={() => save({ ...resume, achievements: [...resume.achievements, ''] })}>
            {resume.achievements.map((ach, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                <input value={ach} onChange={e => { const a = [...resume.achievements]; a[idx] = e.target.value; save({ ...resume, achievements: a }); }}
                  placeholder="Won Smart India Hackathon 2025..." style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', color: '#e8e8e8', fontFamily: 'inherit', fontSize: '0.82rem', outline: 'none' }} />
                <button onClick={() => save({ ...resume, achievements: resume.achievements.filter((_, i) => i !== idx) })}
                  style={{ padding: '6px 10px', borderRadius: '8px', border: 'none', background: 'rgba(239,68,68,0.1)', color: '#ef4444', cursor: 'pointer' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </Section>
        </div>

        {/* Right: Live Preview */}
        <div style={{ position: 'sticky', top: '80px', alignSelf: 'flex-start' }}>
          <div style={{ background: 'rgba(10,10,16,0.9)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: '14px', overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(212,175,55,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#D4AF37', textTransform: 'uppercase' }}>Live Preview</span>
              <button onClick={downloadPDF}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 12px', borderRadius: '8px', border: 'none', background: 'rgba(212,175,55,0.15)', color: '#D4AF37', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', cursor: 'pointer' }}>
                <Download size={12} /> PDF
              </button>
            </div>
            <div ref={previewRef} style={{ background: '#fff', color: '#1a1a1a', padding: '24px', minHeight: '400px', fontFamily: 'Arial, sans-serif', fontSize: '11px', lineHeight: 1.5, maxHeight: '70vh', overflowY: 'auto' }}>
              {resume.name && <h1 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 2px' }}>{resume.name}</h1>}
              <div style={{ color: '#555', marginBottom: '8px' }}>{resume.title}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '10px', color: '#555', marginBottom: '12px' }}>
                {resume.email && <span>✉ {resume.email}</span>}
                {resume.phone && <span>📞 {resume.phone}</span>}
                {resume.linkedin && <span>🔗 {resume.linkedin}</span>}
                {resume.github && <span>⚡ {resume.github}</span>}
              </div>
              {resume.summary && <>
                <PreviewSection title="Summary" />
                <p style={{ color: '#333', margin: '0 0 8px' }}>{resume.summary}</p>
              </>}
              {resume.education.length > 0 && <>
                <PreviewSection title="Education" />
                {resume.education.map((e, i) => <div key={i} style={{ marginBottom: '6px' }}><strong>{e.degree}</strong> — {e.institution} ({e.year}){e.gpa && ` · GPA: ${e.gpa}`}</div>)}
              </>}
              {resume.experience.filter(e => e.role).length > 0 && <>
                <PreviewSection title="Experience" />
                {resume.experience.filter(e => e.role).map((e, i) => <div key={i} style={{ marginBottom: '8px' }}><strong>{e.role}</strong> at {e.company} ({e.duration})<ul style={{ paddingLeft: '14px', margin: '2px 0' }}>{e.points.filter(Boolean).map((p, pi) => <li key={pi}>{p}</li>)}</ul></div>)}
              </>}
              <PreviewSection title="Skills" />
              {Object.entries(resume.skills).map(([k, v]) => v && <div key={k}><strong>{k}: </strong>{v}</div>)}
              {resume.projects.filter(p => p.name).length > 0 && <>
                <PreviewSection title="Projects" />
                {resume.projects.filter(p => p.name).map((p, i) => <div key={i} style={{ marginBottom: '6px' }}><strong>{p.name}</strong>{p.tech && ` (${p.tech})`}{p.description && <p style={{ margin: '2px 0' }}>{p.description}</p>}</div>)}
              </>}
              {resume.achievements.filter(Boolean).length > 0 && <>
                <PreviewSection title="Achievements" />
                <ul style={{ paddingLeft: '14px' }}>{resume.achievements.filter(Boolean).map((a, i) => <li key={i}>{a}</li>)}</ul>
              </>}
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function Section({ title, children, onAdd }) {
  return (
    <div style={{ background: 'rgba(10,10,16,0.9)', border: '1px solid rgba(212,175,55,0.1)', borderRadius: '12px', padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', fontWeight: 700, color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{title}</span>
        {onAdd && <button onClick={onAdd} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '6px', border: '1px solid rgba(212,175,55,0.2)', background: 'transparent', color: '#D4AF37', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', cursor: 'pointer' }}><Plus size={12} /> Add</button>}
      </div>
      {children}
    </div>
  );
}

function PreviewSection({ title }) {
  return <div style={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.08em', borderBottom: '2px solid #1a1a1a', paddingBottom: '2px', margin: '10px 0 6px' }}>{title}</div>;
}
