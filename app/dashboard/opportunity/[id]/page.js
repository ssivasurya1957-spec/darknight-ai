'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, MapPin, Calendar, IndianRupee, Tag, 
  Bookmark, Share2, Sparkles, Building2, ExternalLink 
} from 'lucide-react';
import { opportunities } from '@/lib/mockData';
import Badge from '@/components/Badge';
import GlassCard from '@/components/GlassCard';
import OpportunityCard from '@/components/OpportunityCard';

export default function OpportunityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;
  
  const opportunity = opportunities.find(op => op.id === id);

  if (!opportunity) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <h1 className="font-display text-[36px] font-bold text-[var(--text-primary)] mb-4">Opportunity Not Found</h1>
        <button 
          onClick={() => router.back()}
          className="px-6 py-3 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] rounded-xl transition-colors text-[var(--text-primary)]"
        >
          Go Back
        </button>
      </div>
    );
  }

  const getTypeVariant = (type) => {
    switch (type.toLowerCase()) {
      case 'hackathon': return 'cyan';
      case 'internship': return 'blue';
      case 'job': return 'green';
      case 'research': return 'amber';
      default: return 'blue';
    }
  };

  const getMatchColor = (score) => {
    if (score >= 90) return '#22C55E';
    if (score >= 70) return '#3B82F6';
    if (score >= 50) return '#F59E0B';
    return '#EF4444';
  };

  // Find related ops in same domain, excluding current
  const related = opportunities
    .filter(op => op.domain === opportunity.domain && op.id !== id)
    .slice(0, 4);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="min-h-screen p-8 max-w-5xl mx-auto pb-24"
    >
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-8 group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span>Back</span>
      </button>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="mb-6 flex items-center gap-4">
            <Badge variant={getTypeVariant(opportunity.type)}>{opportunity.type}</Badge>
            <span className="text-sm font-mono text-[var(--text-secondary)]">
              posted {Math.floor((new Date() - new Date(opportunity.postedDate)) / (1000 * 60 * 60 * 24)) || 1} days ago
            </span>
          </div>

          <h1 className="font-display font-bold text-[36px] text-[var(--text-primary)] leading-tight mb-2">
            {opportunity.title}
          </h1>
          <div className="flex items-center gap-2 text-[18px] text-[var(--text-secondary)] mb-8">
            <Building2 className="w-5 h-5" />
            <span>{opportunity.organization}</span>
          </div>

          <GlassCard className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 mb-8" hover={false}>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-[rgba(255,255,255,0.05)] text-[var(--text-primary)]">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-mono text-[var(--text-secondary)] tracking-wider mb-1">Location</div>
                <div className="text-[var(--text-primary)]">{opportunity.location}</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-[rgba(255,255,255,0.05)] text-[var(--text-primary)]">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-mono text-[var(--text-secondary)] tracking-wider mb-1">Deadline</div>
                <div className="text-[var(--text-primary)]">
                  {new Date(opportunity.deadline).toLocaleDateString()} 
                  <span className="text-[var(--danger)] ml-2 text-sm">({opportunity.daysLeft || 10} days left)</span>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-[rgba(255,255,255,0.05)] text-[var(--text-primary)]">
                <IndianRupee className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-mono text-[var(--text-secondary)] tracking-wider mb-1">Stipend / Salary</div>
                <div className="text-[var(--text-primary)]">{opportunity.stipend || 'Competitive'}</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-[rgba(255,255,255,0.05)] text-[var(--text-primary)]">
                <Tag className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-mono text-[var(--text-secondary)] tracking-wider mb-1">Domain</div>
                <div className="text-[var(--text-primary)]">{opportunity.domain}</div>
              </div>
            </div>
          </GlassCard>

          <div className="mb-10">
            <h2 className="text-xl font-display font-semibold text-[var(--text-primary)] mb-4 lowercase">Description</h2>
            <div className="text-[var(--text-secondary)] leading-[1.7] whitespace-pre-wrap">
              {opportunity.description}
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-xl font-display font-semibold text-[var(--text-primary)] mb-4 lowercase">Required Skills</h2>
            <div className="flex flex-wrap gap-2">
              {opportunity.skills?.map(skill => (
                <Badge key={skill} variant="blue" className="!px-3 !py-1 !text-sm !normal-case tracking-normal">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[340px] flex flex-col gap-6">
          <GlassCard className="p-6 flex flex-col gap-4" hover={false}>
            <a 
              href={opportunity.link || '#'}
              target="_blank"
              rel="noreferrer"
              className="w-full text-center py-4 bg-[var(--primary)] hover:bg-blue-600 text-white rounded-xl font-medium transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] flex items-center justify-center gap-2 text-decoration-none"
            >
              <span>Apply Directly</span>
              <ExternalLink size={16} />
            </a>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 py-3 border border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.05)] text-[var(--text-primary)] rounded-xl transition-colors">
                <Bookmark className="w-4 h-4" />
                <span>Save</span>
              </button>
              <button className="flex items-center justify-center gap-2 py-3 bg-transparent hover:bg-[rgba(255,255,255,0.05)] text-[var(--text-primary)] rounded-xl transition-colors">
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>
          </GlassCard>

          <GlassCard className="p-6 relative overflow-hidden" hover={false}>
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <Sparkles className="w-24 h-24 text-[var(--primary)]" />
            </div>
            
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="flex items-center gap-2 text-[var(--accent-cyan)] font-display font-semibold lowercase">
                <Sparkles className="w-4 h-4" />
                <span>ai summary</span>
              </div>
            </div>
            
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6 relative z-10">
              {opportunity.aiSummary}
            </p>

            <div className="pt-4 border-t border-[rgba(255,255,255,0.1)] flex items-center justify-between relative z-10">
              <span className="text-sm text-[var(--text-secondary)]">Match Score</span>
              <div className="flex items-center gap-2">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center font-mono text-sm font-bold border-2"
                  style={{ 
                    borderColor: getMatchColor(opportunity.matchScore),
                    color: getMatchColor(opportunity.matchScore),
                    boxShadow: `0 0 10px ${getMatchColor(opportunity.matchScore)}40`
                  }}
                >
                  {opportunity.matchScore}
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-16 pt-10 border-t border-[rgba(255,255,255,0.05)]">
          <h2 className="text-2xl font-display font-bold text-[var(--text-primary)] mb-6 lowercase">Related Opportunities</h2>
          <div className="flex gap-6 overflow-x-auto pb-8 snap-x">
            {related.map((opp, idx) => (
              <div key={opp.id} className="min-w-[300px] md:min-w-[350px] snap-start">
                <OpportunityCard opportunity={opp} index={idx} />
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
