'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '@/components/GlassCard';
import GlowButton from '@/components/GlowButton';
import { userProfile } from '@/lib/mockData';

// Custom Toggle Component
const Toggle = ({ checked, onChange }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={onChange}
    className={`relative inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] ${
      checked ? 'bg-[var(--primary)]' : 'bg-[#1c1c1c]'
    }`}
  >
    <span
      aria-hidden="true"
      className={`pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
        checked ? 'translate-x-[20px]' : 'translate-x-0'
      }`}
    />
  </button>
);

const DOMAINS = ['Web Development', 'App Development', 'Machine Learning', 'Data Science', 'Cloud Computing', 'Cybersecurity', 'Blockchain', 'UI/UX Design'];

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    whatsappNotif: true,
    emailNotif: true,
    pushNotif: false,
    autoMatch: true,
    dailyDigest: true,
    summaryLanguage: 'English',
    location: 'Bangalore, India',
    minStipend: '10000',
    domains: userProfile.interests
  });

  const [saving, setSaving] = useState(false);

  const toggleDomain = (domain) => {
    setSettings(prev => ({
      ...prev,
      domains: prev.domains.includes(domain)
        ? prev.domains.filter(d => d !== domain)
        : [...prev.domains, domain]
    }));
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      // Optional: show a toast or success message here
    }, 800);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-clash text-white mb-8">Settings</h1>

      <div className="space-y-6">
        {/* Notifications Section */}
        <section>
          <h2 className="font-satoshi font-medium text-lg text-[var(--text-secondary)] mb-4 lowercase tracking-wide">notifications</h2>
          <GlassCard className="p-0" hover={false}>
            <div className="divide-y divide-[rgba(255,255,255,0.05)]">
              <div className="flex items-center justify-between p-5">
                <div>
                  <h3 className="text-white font-medium mb-1">WhatsApp Notifications</h3>
                  <p className="text-sm text-[var(--text-muted)]">Receive alerts for new matches directly on WhatsApp.</p>
                </div>
                <Toggle checked={settings.whatsappNotif} onChange={() => setSettings(s => ({ ...s, whatsappNotif: !s.whatsappNotif }))} />
              </div>
              <div className="flex items-center justify-between p-5">
                <div>
                  <h3 className="text-white font-medium mb-1">Email Notifications</h3>
                  <p className="text-sm text-[var(--text-muted)]">Important updates and newsletter delivered to your inbox.</p>
                </div>
                <Toggle checked={settings.emailNotif} onChange={() => setSettings(s => ({ ...s, emailNotif: !s.emailNotif }))} />
              </div>
              <div className="flex items-center justify-between p-5">
                <div>
                  <h3 className="text-white font-medium mb-1">Push Notifications</h3>
                  <p className="text-sm text-[var(--text-muted)]">Browser notifications for real-time alerts.</p>
                </div>
                <Toggle checked={settings.pushNotif} onChange={() => setSettings(s => ({ ...s, pushNotif: !s.pushNotif }))} />
              </div>
            </div>
          </GlassCard>
        </section>

        {/* Preferences Section */}
        <section>
          <h2 className="font-satoshi font-medium text-lg text-[var(--text-secondary)] mb-4 lowercase tracking-wide">preferences</h2>
          <GlassCard className="p-6 space-y-6" hover={false}>
            <div>
              <label className="block text-white font-medium mb-3">Domains of Interest</label>
              <div className="flex flex-wrap gap-2">
                {DOMAINS.map(domain => {
                  const isActive = settings.domains.includes(domain);
                  return (
                    <button
                      key={domain}
                      onClick={() => toggleDomain(domain)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                        isActive 
                          ? 'bg-[rgba(59,130,246,0.15)] text-[var(--primary)] border-[rgba(59,130,246,0.3)]' 
                          : 'bg-[rgba(255,255,255,0.02)] text-[var(--text-secondary)] border-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.05)]'
                      }`}
                    >
                      {domain}
                    </button>
                  );
                })}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-medium mb-2 text-sm">Minimum Stipend (₹/month)</label>
                <select 
                  value={settings.minStipend}
                  onChange={(e) => setSettings(s => ({ ...s, minStipend: e.target.value }))}
                  className="w-full bg-[#1c1c1c] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-2.5 text-white outline-none focus:border-[var(--primary)] transition-colors"
                >
                  <option value="0">No Minimum</option>
                  <option value="5000">₹5,000+</option>
                  <option value="10000">₹10,000+</option>
                  <option value="20000">₹20,000+</option>
                  <option value="50000">₹50,000+</option>
                </select>
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2 text-sm">Preferred Location</label>
                <input 
                  type="text"
                  value={settings.location}
                  onChange={(e) => setSettings(s => ({ ...s, location: e.target.value }))}
                  placeholder="e.g., Remote, Bangalore..."
                  className="w-full bg-[#1c1c1c] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-2 text-white outline-none focus:border-[var(--primary)] transition-colors"
                />
              </div>
            </div>
          </GlassCard>
        </section>

        {/* AI Settings Section */}
        <section>
          <h2 className="font-satoshi font-medium text-lg text-[var(--text-secondary)] mb-4 lowercase tracking-wide">ai settings</h2>
          <GlassCard className="p-0" hover={false}>
            <div className="divide-y divide-[rgba(255,255,255,0.05)]">
              <div className="flex items-center justify-between p-5">
                <div>
                  <h3 className="text-white font-medium mb-1">Auto-match opportunities</h3>
                  <p className="text-sm text-[var(--text-muted)]">Let DarkKnight AI automatically apply or save high-match opportunities.</p>
                </div>
                <Toggle checked={settings.autoMatch} onChange={() => setSettings(s => ({ ...s, autoMatch: !s.autoMatch }))} />
              </div>
              <div className="flex items-center justify-between p-5">
                <div>
                  <h3 className="text-white font-medium mb-1">Daily digest</h3>
                  <p className="text-sm text-[var(--text-muted)]">AI-curated summary of the best opportunities every morning.</p>
                </div>
                <Toggle checked={settings.dailyDigest} onChange={() => setSettings(s => ({ ...s, dailyDigest: !s.dailyDigest }))} />
              </div>
              <div className="flex items-center justify-between p-5">
                <div>
                  <h3 className="text-white font-medium mb-1">Summary language</h3>
                  <p className="text-sm text-[var(--text-muted)]">Language for AI-generated summaries and chat responses.</p>
                </div>
                <select 
                  value={settings.summaryLanguage}
                  onChange={(e) => setSettings(s => ({ ...s, summaryLanguage: e.target.value }))}
                  className="bg-[#1c1c1c] border border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-1.5 text-sm text-white outline-none focus:border-[var(--primary)]"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                </select>
              </div>
            </div>
          </GlassCard>
        </section>

        {/* Account Section */}
        <section>
          <h2 className="font-satoshi font-medium text-lg text-[var(--text-secondary)] mb-4 lowercase tracking-wide">account</h2>
          <GlassCard className="p-6 flex flex-col sm:flex-row items-center gap-4" hover={false}>
            <GlowButton variant="outline" className="w-full sm:w-auto">
              Change Password
            </GlowButton>
            <GlowButton variant="danger" className="w-full sm:w-auto">
              Delete Account
            </GlowButton>
          </GlassCard>
        </section>

        {/* Save Button */}
        <div className="pt-6 pb-12 flex justify-end">
          <GlowButton variant="primary" onClick={handleSave} disabled={saving} className="w-full sm:w-auto min-w-[140px]">
            {saving ? (
              <span className="flex items-center space-x-2">
                <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="w-4 h-4 border-2 border-white border-t-transparent rounded-full inline-block" />
                <span>Saving...</span>
              </span>
            ) : (
              'Save Changes'
            )}
          </GlowButton>
        </div>
      </div>
    </div>
  );
}
