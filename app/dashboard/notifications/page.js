'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Briefcase, Share2, Plus, X, Check, Clock, ExternalLink, Trash2, RefreshCw } from 'lucide-react';

// ── Application Tracker ──────────────────────────────────────────────────────
const STAGES = ['Saved', 'Applied', 'Interview', 'Offer', 'Rejected'];

const STAGE_COLORS = {
  Saved: { bg: 'rgba(212,175,55,0.08)', border: 'rgba(212,175,55,0.25)', head: '#D4AF37' },
  Applied: { bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.25)', head: '#3B82F6' },
  Interview: { bg: 'rgba(168,85,247,0.08)', border: 'rgba(168,85,247,0.25)', head: '#A855F7' },
  Offer: { bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.25)', head: '#22C55E' },
  Rejected: { bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.25)', head: '#EF4444' },
};

const MOCK_ALERTS = [
  { id: 'a1', title: 'ML Engineer — Google DeepMind', company: 'Google', platform: 'LinkedIn', salary: '₹45,00,000/yr', type: 'job', badge: 'HOT', badgeColor: '#EF4444', time: '2 hours ago' },
  { id: 'a2', title: 'Full-Stack Developer Intern', company: 'Zepto', platform: 'Internshala', salary: '₹25,000/month', type: 'internship', badge: 'NEW', badgeColor: '#22C55E', time: '4 hours ago' },
  { id: 'a3', title: 'Smart India Hackathon 2026', company: 'Ministry of Education', platform: 'SIH', salary: '₹1,00,000 Prize', type: 'hackathon', badge: 'EXPIRING', badgeColor: '#F59E0B', time: '6 hours ago' },
  { id: 'a4', title: 'Data Science Specialist', company: 'Flipkart', platform: 'Naukri', salary: '₹22,00,000/yr', type: 'job', badge: 'NEW', badgeColor: '#22C55E', time: '8 hours ago' },
  { id: 'a5', title: 'AI Research Grant — CSIR', company: 'CSIR India', platform: 'CSIR Portal', salary: '₹50,000/month Fellowship', type: 'research', badge: 'NEW', badgeColor: '#22C55E', time: '1 day ago' },
  { id: 'a6', title: 'React Developer — Series B Startup', company: 'Slice', platform: 'AngelList', salary: '₹18,00,000/yr + ESOPs', type: 'job', badge: 'HOT', badgeColor: '#EF4444', time: '1 day ago' },
];

const BROADCAST_TEMPLATES = [
  '🔥 Urgent: {company} is hiring {role}! Salary: {salary}. Deadline: {deadline}. Apply now!',
  '🎯 Hackathon Alert: {event} is accepting registrations! Prize: {prize}. Register at {link}',
  '📢 Internship Opening: {company} needs {role} interns. Stipend: {stipend}/month. DM for referral!',
];

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState('alerts');
  const [alerts, setAlerts] = useState(MOCK_ALERTS);
  const [dismissed, setDismissed] = useState([]);

  // Application Tracker
  const [applications, setApplications] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newApp, setNewApp] = useState({ title: '', company: '', stage: 'Saved', salary: '', url: '', notes: '' });

  // WhatsApp Broadcast
  const [groupName, setGroupName] = useState('CS Batch 2026 - IIT Delhi');
  const [broadcastMsg, setBroadcastMsg] = useState(BROADCAST_TEMPLATES[0]);
  const [broadcastSent, setBroadcastSent] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('darknight_applications');
      if (saved) setApplications(JSON.parse(saved));
      const dis = localStorage.getItem('darknight_dismissed_alerts');
      if (dis) setDismissed(JSON.parse(dis));
    } catch (e) {}
  }, []);

  const saveApplications = (apps) => {
    setApplications(apps);
    localStorage.setItem('darknight_applications', JSON.stringify(apps));
  };

  const addApplication = () => {
    if (!newApp.title || !newApp.company) return;
    const app = { ...newApp, id: `app-${Date.now()}`, addedAt: new Date().toISOString() };
    saveApplications([...applications, app]);
    setNewApp({ title: '', company: '', stage: 'Saved', salary: '', url: '', notes: '' });
    setShowAddForm(false);
  };

  const moveStage = (appId, direction) => {
    const app = applications.find(a => a.id === appId);
    if (!app) return;
    const idx = STAGES.indexOf(app.stage);
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= STAGES.length) return;
    saveApplications(applications.map(a => a.id === appId ? { ...a, stage: STAGES[newIdx] } : a));
  };

  const deleteApp = (appId) => {
    saveApplications(applications.filter(a => a.id !== appId));
  };

  const dismissAlert = (alertId) => {
    const newDis = [...dismissed, alertId];
    setDismissed(newDis);
    localStorage.setItem('darknight_dismissed_alerts', JSON.stringify(newDis));
  };

  const visibleAlerts = alerts.filter(a => !dismissed.includes(a.id));

  const handleBroadcast = () => {
    const msg = encodeURIComponent(`🦇 *DarkKnight AI Alert*\n*Group: ${groupName}*\n\n${broadcastMsg}`);
    window.open(`https://api.whatsapp.com/send?text=${msg}`, '_blank');
    setBroadcastSent(true);
    setTimeout(() => setBroadcastSent(false), 3000);
  };

  const TABS = [
    { id: 'alerts', label: 'Job Alerts', icon: <Bell size={15} />, count: visibleAlerts.length },
    { id: 'tracker', label: 'Applications', icon: <Briefcase size={15} />, count: applications.length },
    { id: 'broadcast', label: 'WA Broadcast', icon: <Share2 size={15} /> },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 20px 80px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color: '#F5E6C8', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 6px' }}>
          🔔 Notifications & Tracker
        </h1>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
          AI-curated job alerts · Application pipeline · Student group broadcasts
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', background: 'rgba(0,0,0,0.5)', padding: '4px', borderRadius: '14px', border: '1px solid rgba(212,175,55,0.12)', marginBottom: '24px', width: 'fit-content' }}>
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '10px',
              border: 'none', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
              background: activeTab === tab.id ? 'rgba(212,175,55,0.15)' : 'transparent',
              color: activeTab === tab.id ? '#D4AF37' : 'var(--text-secondary)',
              transition: 'all 0.15s',
            }}
          >
            {tab.icon} {tab.label}
            {tab.count > 0 && (
              <span style={{ background: activeTab === tab.id ? '#D4AF37' : 'rgba(255,255,255,0.1)', color: activeTab === tab.id ? '#000' : '#999', borderRadius: '10px', padding: '1px 6px', fontSize: '0.65rem' }}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── TAB: ALERTS ── */}
      {activeTab === 'alerts' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              {visibleAlerts.length} active alerts based on your interests
            </span>
            <button onClick={() => { setDismissed([]); localStorage.removeItem('darknight_dismissed_alerts'); }}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.2)', background: 'transparent', color: '#D4AF37', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', cursor: 'pointer' }}>
              <RefreshCw size={12} /> Reset All
            </button>
          </div>

          {visibleAlerts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              <Bell size={40} style={{ margin: '0 auto 16px', display: 'block', opacity: 0.3 }} />
              <p>All alerts dismissed. Click Reset All to restore.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '14px' }}>
              {visibleAlerts.map((alert, i) => (
                <motion.div key={alert.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  style={{ background: 'rgba(10,10,16,0.9)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: '14px', padding: '16px', position: 'relative' }}>
                  {/* Badge */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', padding: '3px 8px', borderRadius: '20px', background: `${alert.badgeColor}22`, color: alert.badgeColor, border: `1px solid ${alert.badgeColor}44`, fontWeight: 700 }}>
                      {alert.badge}
                    </span>
                    <button onClick={() => dismissAlert(alert.id)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}>
                      <X size={14} />
                    </button>
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 700, color: '#F5E6C8', margin: '0 0 4px' }}>{alert.title}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0 0 10px' }}>{alert.company} · {alert.platform}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#22C55E', fontWeight: 600 }}>{alert.salary}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={11} /> {alert.time}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── TAB: APPLICATION TRACKER ── */}
      {activeTab === 'tracker' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Track your job applications through the hiring pipeline
            </span>
            <button onClick={() => setShowAddForm(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #D4AF37, #F5D767)', color: '#000', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>
              <Plus size={15} /> Add Application
            </button>
          </div>

          {/* Add Form */}
          <AnimatePresence>
            {showAddForm && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                style={{ background: 'rgba(10,10,16,0.95)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '14px', padding: '20px', marginBottom: '20px' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: '#F5E6C8', margin: '0 0 16px', textTransform: 'uppercase' }}>New Application</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <input placeholder="Job Title *" value={newApp.title} onChange={e => setNewApp({ ...newApp, title: e.target.value })}
                    style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(212,175,55,0.2)', background: 'rgba(255,255,255,0.03)', color: '#fff', fontFamily: 'inherit', fontSize: '0.85rem', outline: 'none' }} />
                  <input placeholder="Company *" value={newApp.company} onChange={e => setNewApp({ ...newApp, company: e.target.value })}
                    style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(212,175,55,0.2)', background: 'rgba(255,255,255,0.03)', color: '#fff', fontFamily: 'inherit', fontSize: '0.85rem', outline: 'none' }} />
                  <input placeholder="Salary / Stipend" value={newApp.salary} onChange={e => setNewApp({ ...newApp, salary: e.target.value })}
                    style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(212,175,55,0.2)', background: 'rgba(255,255,255,0.03)', color: '#fff', fontFamily: 'inherit', fontSize: '0.85rem', outline: 'none' }} />
                  <input placeholder="Job URL" value={newApp.url} onChange={e => setNewApp({ ...newApp, url: e.target.value })}
                    style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(212,175,55,0.2)', background: 'rgba(255,255,255,0.03)', color: '#fff', fontFamily: 'inherit', fontSize: '0.85rem', outline: 'none' }} />
                </div>
                <select value={newApp.stage} onChange={e => setNewApp({ ...newApp, stage: e.target.value })}
                  style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(212,175,55,0.2)', background: '#0c0c14', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', outline: 'none', width: '100%', marginBottom: '12px' }}>
                  {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <input placeholder="Notes (optional)" value={newApp.notes} onChange={e => setNewApp({ ...newApp, notes: e.target.value })}
                  style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(212,175,55,0.2)', background: 'rgba(255,255,255,0.03)', color: '#fff', fontFamily: 'inherit', fontSize: '0.85rem', outline: 'none', width: '100%', marginBottom: '16px', boxSizing: 'border-box' }} />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={addApplication}
                    style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #D4AF37, #F5D767)', color: '#000', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                    Add Application
                  </button>
                  <button onClick={() => setShowAddForm(false)}
                    style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Kanban Board */}
          <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '12px' }}>
            {STAGES.map(stage => {
              const stageApps = applications.filter(a => a.stage === stage);
              const cfg = STAGE_COLORS[stage];
              return (
                <div key={stage} style={{ minWidth: '220px', flex: 1, background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: '14px', padding: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700, color: cfg.head, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {stage}
                    </span>
                    <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', background: `${cfg.head}22`, color: cfg.head, borderRadius: '10px', padding: '1px 7px' }}>
                      {stageApps.length}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {stageApps.map(app => (
                      <div key={app.id} style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '10px', padding: '10px 12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <p style={{ fontWeight: 600, fontSize: '0.82rem', color: '#e8e8e8', margin: '0 0 2px' }}>{app.title}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0 0 8px' }}>{app.company}</p>
                        {app.salary && <p style={{ fontSize: '0.72rem', color: '#22C55E', fontFamily: 'var(--font-mono)', margin: '0 0 8px' }}>{app.salary}</p>}
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button onClick={() => moveStage(app.id, -1)} disabled={STAGES.indexOf(app.stage) === 0}
                            style={{ flex: 1, padding: '4px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.7rem' }}>←</button>
                          <button onClick={() => moveStage(app.id, 1)} disabled={STAGES.indexOf(app.stage) === STAGES.length - 1}
                            style={{ flex: 1, padding: '4px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.7rem' }}>→</button>
                          {app.url && (
                            <a href={app.url} target="_blank" rel="noreferrer"
                              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px 6px', borderRadius: '6px', border: '1px solid rgba(212,175,55,0.2)', background: 'transparent', color: '#D4AF37' }}>
                              <ExternalLink size={11} />
                            </a>
                          )}
                          <button onClick={() => deleteApp(app.id)}
                            style={{ padding: '4px 6px', borderRadius: '6px', border: '1px solid rgba(239,68,68,0.2)', background: 'transparent', color: '#ef4444', cursor: 'pointer' }}>
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </div>
                    ))}
                    {stageApps.length === 0 && (
                      <div style={{ padding: '20px 10px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', borderRadius: '8px', border: '1px dashed rgba(255,255,255,0.06)' }}>
                        No applications
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── TAB: WHATSAPP BROADCAST ── */}
      {activeTab === 'broadcast' && (
        <div style={{ maxWidth: '600px' }}>
          <div style={{ background: 'rgba(10,10,16,0.9)', border: '1px solid rgba(37,211,102,0.2)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                Student Group / Recipient
              </label>
              <input value={groupName} onChange={e => setGroupName(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(37,211,102,0.25)', background: 'rgba(255,255,255,0.03)', color: '#fff', fontFamily: 'inherit', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                Broadcast Message
              </label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                {BROADCAST_TEMPLATES.map((t, i) => (
                  <button key={i} onClick={() => setBroadcastMsg(t)}
                    style={{ padding: '4px 10px', borderRadius: '20px', border: '1px solid rgba(37,211,102,0.2)', background: 'transparent', color: '#25D366', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', cursor: 'pointer' }}>
                    Template {i + 1}
                  </button>
                ))}
              </div>
              <textarea rows={5} value={broadcastMsg} onChange={e => setBroadcastMsg(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(37,211,102,0.25)', background: 'rgba(255,255,255,0.03)', color: '#fff', fontFamily: 'inherit', fontSize: '0.85rem', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
            </div>

            {/* Preview */}
            <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'rgba(37,211,102,0.06)', border: '1px solid rgba(37,211,102,0.15)' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#25D366', margin: '0 0 6px', textTransform: 'uppercase' }}>WhatsApp Preview</p>
              <p style={{ fontSize: '0.82rem', color: '#e8e8e8', margin: 0, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                🦇 *DarkKnight AI Alert*{'\n'}*Group: {groupName}*{'\n\n'}{broadcastMsg}
              </p>
            </div>

            <button onClick={handleBroadcast}
              style={{ padding: '14px', borderRadius: '12px', border: 'none', background: broadcastSent ? '#22C55E' : '#25D366', color: '#000', fontFamily: 'var(--font-mono)', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: 'all 0.3s' }}>
              {broadcastSent ? <><Check size={18} /> Sent to WhatsApp!</> : <>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="#000"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Send Broadcast to WhatsApp
              </>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
