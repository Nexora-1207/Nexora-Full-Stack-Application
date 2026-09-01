'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ChevronLeft, 
  Star, 
  MapPin, 
  Building2, 
  Award, 
  DollarSign, 
  TrendingUp, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  Download, 
  BookOpen, 
  Check, 
  ShieldAlert, 
  Mail, 
  Layers, 
  Eye,
  Lock,
  X
} from 'lucide-react';
import { College } from '@/lib/data';
import { useCyberToast } from '@/components/CyberToast';
import { supabase } from '@/lib/supabase';

interface Props {
  college: College;
}

export default function CollegeDetailClient({ college }: Props) {
  const router = useRouter();
  const toast = useCyberToast();

  const [isGuest, setIsGuest] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'fees' | 'placements' | 'brochure'>('overview');
  const [brochurePage, setBrochurePage] = useState(1);
  const [showBrochureModal, setShowBrochureModal] = useState(false);
  const [downloadingBrochure, setDownloadingBrochure] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setIsGuest(false);
      } else if (localStorage.getItem('nexoraGuestMode') === 'true') {
        setIsGuest(true);
      } else {
        router.replace('/auth');
      }
    });
  }, [router]);

  if (isGuest) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-cyber-cyan/20 to-cyber-violet/20 border border-cyber-cyan/30 flex items-center justify-center mx-auto text-cyber-cyan shadow-2xl animate-pulse">
          <Building2 className="w-12 h-12" />
        </div>
        
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-black uppercase tracking-widest">
            <Lock className="w-3.5 h-3.5" />
            <span>GUEST ACCESS RESTRICTED</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            COLLEGE SPECS LOCKED
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-white/60 font-medium max-w-lg mx-auto leading-relaxed">
            Register or Sign In to inspect cutoff ranks, fee breakdown, placement statistics, and official brochures for {college.name}.
          </p>
        </div>
        
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => router.push('/auth')}
            className="cyber-button-primary px-8 py-4 rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-xl w-full sm:w-auto"
          >
            <Lock className="w-4 h-4" />
            <span>REGISTER / SIGN IN TO UNLOCK</span>
          </button>
        </div>
      </div>
    );
  }

  const handleDownloadBrochure = () => {
    setDownloadingBrochure(true);
    setTimeout(() => {
      setDownloadingBrochure(false);
      toast.info('Prospectus Ready', `Downloading verified digital prospectus: ${college.brochure.filename}`);
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-36 space-y-8 relative">
      
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <button
          onClick={() => router.push('/colleges')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-xs font-bold text-cyber-cyan transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>RETURN TO COLLEGES LIST</span>
        </button>

        <div className="flex items-center gap-2">
          {college.isPartner && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyber-emerald/10 border border-cyber-emerald/30 text-cyber-emerald text-[11px] font-black uppercase tracking-wider">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>OFFICIAL NEXORA COLLABORATED PARTNER</span>
            </span>
          )}
        </div>
      </div>

      {/* Hero Header Section */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/[0.1] relative overflow-hidden space-y-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyber-cyan/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg bg-cyber-magenta/10 border border-cyber-magenta/30 text-cyber-magenta">
                {college.sector} SECTOR
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan">
                {college.stream} TRACK
              </span>
              {college.established && (
                <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/60">
                  EST. {college.established}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              {college.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-white/60 pt-1">
              <span className="flex items-center gap-1.5 text-cyber-amber">
                <Star className="w-4 h-4 fill-cyber-amber" />
                <span>{college.rating} Rating</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-white/80">
                <MapPin className="w-4 h-4 text-cyber-cyan" />
                <span>{college.location}</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <Link
              href={`/colleges/${college.id}/apply`}
              className="cyber-button-primary px-8 py-4 rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-xl"
            >
              <Send className="w-4 h-4" />
              <span>APPLY FOR ADMISSION</span>
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
