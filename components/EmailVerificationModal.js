'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, CheckCircle2, ShieldCheck, X, RefreshCw, ExternalLink, Sparkles, Terminal } from 'lucide-react';
import GlowButton from '@/components/GlowButton';

export default function EmailVerificationModal({ isOpen, onClose, userEmail = 'alex.chen@university.edu', onVerified, previewUrl, mode = 'SIGN_IN' }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let interval;
    if (isOpen && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [isOpen, timer]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value[value.length - 1];
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const verifyCode = async () => {
    setIsVerifying(true);
    await new Promise(r => setTimeout(r, 1200));
    setIsVerifying(false);
    setIsVerified(true);
    setTimeout(() => {
      if (onVerified) onVerified();
      onClose();
    }, 1200);
  };

  const resendCode = () => {
    setTimer(30);
    setCanResend(false);
    setOtp(['', '', '', '', '', '']);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-[#0a0a0f] border border-[rgba(0,217,255,0.3)] rounded-2xl p-6 shadow-[0_0_50px_rgba(0,217,255,0.15)] text-white overflow-hidden"
        >
          {/* Cyan Glow Accent */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-[var(--accent)] opacity-20 blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-white transition-colors"
          >
            <X size={20} />
          </button>

          {!isVerified ? (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="bat-hud-tag">
                  [ SECURITY CLEARANCE // {mode} ]
                </span>
              </div>

              <div className="w-12 h-12 rounded-xl bg-[rgba(0,217,255,0.1)] border border-[rgba(0,217,255,0.3)] flex items-center justify-center mb-4 text-[var(--accent)]">
                <Terminal size={24} />
              </div>

              <h2 className="text-2xl font-display font-bold text-white mb-1 tracking-wide">
                Security Passkey Required
              </h2>
              <p className="text-xs font-mono text-[var(--text-secondary)] mb-6 leading-relaxed">
                Dispatched 6-digit authentication token to:<br />
                <span className="text-[var(--accent)] font-semibold">{userEmail}</span>
              </p>

              {/* OTP Input Fields */}
              <div className="flex justify-between mb-6 gap-2">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-input-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(idx, e.target.value)}
                    onKeyDown={e => handleKeyDown(idx, e)}
                    className="w-12 h-14 text-center text-xl font-mono font-bold bg-[#14141c] border border-[rgba(0,217,255,0.2)] rounded-xl text-white focus:border-[var(--accent)] focus:shadow-[0_0_15px_rgba(0,217,255,0.4)] outline-none transition-all"
                  />
                ))}
              </div>

              {/* Verification & Resend */}
              <div className="flex flex-col gap-3">
                <GlowButton
                  variant="primary"
                  className="w-full justify-center py-3 font-mono text-sm tracking-wider uppercase"
                  onClick={verifyCode}
                  disabled={otp.some(d => !d) || isVerifying}
                >
                  {isVerifying ? (
                    <RefreshCw size={18} className="animate-spin mr-2" />
                  ) : (
                    <ShieldCheck size={18} className="mr-2" />
                  )}
                  {isVerifying ? 'Authenticating...' : '[ AUTHENTICATE PASSKEY ]'}
                </GlowButton>

                <div className="flex items-center justify-between text-xs font-mono text-[var(--text-secondary)] mt-2">
                  <span>TOKEN EXPIRY</span>
                  {canResend ? (
                    <button
                      onClick={resendCode}
                      className="text-[var(--accent)] hover:underline font-medium"
                    >
                      [ RESEND TOKEN ]
                    </button>
                  ) : (
                    <span className="text-[var(--text-muted)]">{timer}S REMAINING</span>
                  )}
                </div>

                {previewUrl && (
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 p-3 rounded-xl bg-[rgba(0,217,255,0.05)] border border-[rgba(0,217,255,0.2)] text-xs font-mono text-[var(--accent)] flex items-center justify-between hover:bg-[rgba(0,217,255,0.1)] transition-all"
                  >
                    <span className="flex items-center gap-2">
                      <Mail size={14} /> [ VIEW TRANSPORTER MAIL LOG ]
                    </span>
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="py-8 flex flex-col items-center justify-center text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="w-16 h-16 rounded-full bg-[rgba(34,197,94,0.15)] border border-[rgba(34,197,94,0.4)] flex items-center justify-center mb-4 text-[var(--success)] shadow-[0_0_25px_rgba(34,197,94,0.3)]"
              >
                <CheckCircle2 size={36} />
              </motion.div>
              <h3 className="text-2xl font-display font-bold text-white mb-1">
                Access Granted
              </h3>
              <p className="text-xs font-mono text-[var(--text-secondary)]">
                [ SECURITY CLEARANCE CONFIRMED // SYNCING SESSION ]
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
