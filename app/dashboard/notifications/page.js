'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Mail, CheckCircle2, Bell, Send, ExternalLink, Loader2 } from 'lucide-react';
import { notifications as initialNotifications } from '@/lib/mockData';
import GlowButton from '@/components/GlowButton';
import GlassCard from '@/components/GlassCard';
import EmailVerificationModal from '@/components/EmailVerificationModal';

const TABS = ['all', 'whatsapp', 'email'];

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [notificationsList, setNotificationsList] = useState(initialNotifications);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [dispatchStatus, setDispatchStatus] = useState(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [modalPreviewUrl, setModalPreviewUrl] = useState(null);

  const filteredNotifications = notificationsList.filter(n => {
    if (activeTab === 'all') return true;
    return n.type === activeTab;
  });

  const markAllAsRead = () => {
    setNotificationsList(prev => prev.map(n => ({ ...n, read: true })));
  };

  const triggerRealEmail = async () => {
    setIsSending(true);
    setDispatchStatus(null);
    try {
      const res = await fetch('/api/notifications/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: recipientEmail || undefined,
          title: '🔥 Live Opportunity Match: ML Research Specialist',
          message: 'DarkKnight AI has detected a high-compatibility (98%) opportunity for your profile at Google DeepMind.',
          opportunityTitle: 'Senior Machine Learning Specialist',
          opportunityLink: 'https://careers.google.com'
        })
      });
      const data = await res.json();
      if (data.success) {
        setDispatchStatus({
          type: 'success',
          text: 'Email dispatched via DarkKnight Mail Engine!',
          previewUrl: data.details?.previewUrl
        });
        setModalPreviewUrl(data.details?.previewUrl);
        setShowVerifyModal(true);
        const newNotif = {
          id: `notif-${Date.now()}`,
          title: '🔥 Live Email Dispatched',
          message: recipientEmail ? `Sent to ${recipientEmail}` : 'Sent via DarkKnight Mail Engine',
          type: 'email',
          timestamp: new Date().toISOString(),
          read: false
        };
        setNotificationsList(prev => [newNotif, ...prev]);
      } else {
        setDispatchStatus({ type: 'error', text: data.error || 'Failed to send email' });
      }
    } catch (err) {
      setDispatchStatus({ type: 'error', text: err.message });
    } finally {
      setIsSending(false);
    }
  };

  const triggerRealWhatsApp = async () => {
    setIsSending(true);
    setDispatchStatus(null);
    try {
      const res = await fetch('/api/notifications/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: '🚀 Hackathon Alert: DarkKnight Global Hack',
          message: 'Registration is now open with a prize pool of $50,000. Apply immediately!'
        })
      });
      const data = await res.json();
      if (data.success) {
        setDispatchStatus({
          type: 'success',
          text: 'WhatsApp notification payload generated!',
          whatsappUrl: data.whatsappUrl
        });
        if (data.whatsappUrl) {
          window.open(data.whatsappUrl, '_blank');
        }
        const newNotif = {
          id: `notif-${Date.now()}`,
          title: '🚀 WhatsApp Dispatch Triggered',
          message: 'Sent notification via WhatsApp Gateway',
          type: 'whatsapp',
          timestamp: new Date().toISOString(),
          read: false
        };
        setNotificationsList(prev => [newNotif, ...prev]);
      }
    } catch (err) {
      setDispatchStatus({ type: 'error', text: err.message });
    } finally {
      setIsSending(false);
    }
  };

  const markAsRead = (id) => {
    setNotificationsList(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <EmailVerificationModal
        isOpen={showVerifyModal}
        onClose={() => setShowVerifyModal(false)}
        userEmail={recipientEmail || 'alex.chen@university.edu'}
        previewUrl={modalPreviewUrl}
      />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-clash text-white">Notification Engine</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Real-time dispatch system via Email & WhatsApp</p>
        </div>
        <div className="flex items-center space-x-3">
          <GlowButton variant="ghost" size="sm" onClick={markAllAsRead}>
            <CheckCircle2 size={16} className="mr-2 inline" />
            Mark all read
          </GlowButton>
        </div>
      </div>

      {/* Real Dispatch Controls */}
      <GlassCard className="p-6 mb-8 border-[rgba(59,130,246,0.2)]">
        <h2 className="text-lg font-clash text-white mb-3 flex items-center gap-2">
          <Send size={18} className="text-[var(--primary)]" />
          Send Live Dispatch
        </h2>
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="email"
            placeholder="Enter destination email (or leave blank for auto-transporter)..."
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            className="flex-grow bg-[var(--surface)] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[var(--primary)]"
          />
          <GlowButton variant="primary" size="sm" onClick={triggerRealEmail} disabled={isSending}>
            {isSending ? <Loader2 size={16} className="animate-spin mr-2 inline" /> : <Mail size={16} className="mr-2 inline" />}
            Send Real Email
          </GlowButton>
          <GlowButton variant="outline" size="sm" onClick={triggerRealWhatsApp} disabled={isSending}>
            <MessageSquare size={16} className="mr-2 inline text-[var(--success)]" />
            Send WhatsApp
          </GlowButton>
        </div>

        {dispatchStatus && (
          <div className={`p-3 rounded-lg text-sm flex items-center justify-between ${dispatchStatus.type === 'success' ? 'bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.3)] text-[var(--success)]' : 'bg-[rgba(255,77,103,0.1)] border border-[rgba(255,77,103,0.3)] text-[var(--danger)]'}`}>
            <span>{dispatchStatus.text}</span>
            {dispatchStatus.previewUrl && (
              <a href={dispatchStatus.previewUrl} target="_blank" rel="noreferrer" className="underline text-xs flex items-center gap-1 font-mono">
                View Mail Log <ExternalLink size={12} />
              </a>
            )}
            {dispatchStatus.whatsappUrl && (
              <a href={dispatchStatus.whatsappUrl} target="_blank" rel="noreferrer" className="underline text-xs flex items-center gap-1 font-mono">
                Open WhatsApp Web <ExternalLink size={12} />
              </a>
            )}
          </div>
        )}
      </GlassCard>

      {/* Tabs */}
      <div className="flex space-x-2 mb-8">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-full text-sm capitalize transition-all duration-300 border ${
              activeTab === tab
                ? 'bg-[var(--primary)] text-white border-transparent shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                : 'bg-[rgba(255,255,255,0.03)] text-[var(--text-secondary)] border-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.08)] hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notif, index) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <GlassCard
                  className={`p-4 flex items-start sm:items-center cursor-pointer ${!notif.read ? 'border-[rgba(59,130,246,0.3)] shadow-[0_0_15px_rgba(59,130,246,0.05)] bg-[rgba(59,130,246,0.02)]' : ''}`}
                  onClick={() => markAsRead(notif.id)}
                >
                  <div className="mr-4 mt-1 sm:mt-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${notif.type === 'whatsapp' ? 'bg-[rgba(34,197,94,0.15)] text-[var(--success)]' : 'bg-[rgba(59,130,246,0.15)] text-[var(--primary)]'}`}>
                      {notif.type === 'whatsapp' ? <MessageSquare size={20} /> : <Mail size={20} />}
                    </div>
                  </div>
                  
                  <div className="flex-grow min-w-0 pr-4">
                    <h3 className={`font-satoshi text-base mb-1 truncate ${!notif.read ? 'text-white font-medium' : 'text-[var(--text-primary)]'}`}>
                      {notif.title}
                    </h3>
                    <p className="text-[var(--text-secondary)] text-sm line-clamp-1 sm:line-clamp-none">
                      {notif.message}
                    </p>
                  </div>

                  <div className="flex flex-col items-end flex-shrink-0 ml-auto space-y-2">
                    <span className="text-xs font-mono text-[var(--text-muted)] whitespace-nowrap">
                      {formatDate(notif.timestamp)}
                    </span>
                    {!notif.read && (
                      <div className="w-2 h-2 rounded-full bg-[var(--primary)] shadow-[0_0_8px_var(--primary)]" />
                    )}
                  </div>
                </GlassCard>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-16 h-16 bg-[rgba(17,17,17,0.6)] border border-[rgba(255,255,255,0.08)] rounded-2xl flex items-center justify-center mb-4 text-[var(--text-secondary)]">
                <Bell size={28} />
              </div>
              <h3 className="text-xl font-clash text-white mb-2">all caught up</h3>
              <p className="text-[var(--text-secondary)]">you have no {activeTab !== 'all' ? activeTab : ''} notifications at the moment.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
