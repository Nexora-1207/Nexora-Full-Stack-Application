'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ChevronLeft, 
  ArrowRight, 
  CheckCircle2, 
  Compass, 
  BookOpen, 
  Award, 
  Sparkles, 
  Info,
  TrendingUp,
  DollarSign,
  Briefcase,
  Flame,
  ShieldCheck
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { SECTOR_TREES } from '@/lib/sectorTrees';
import confetti from 'canvas-confetti';

interface OnboardingParams {
  params: {
    sectorId: string;
  };
}

export default function DynamicOnboardingPage({ params }: OnboardingParams) {
  const router = useRouter();
  const sectorKey = params.sectorId.toLowerCase();
  const sectorData = SECTOR_TREES[sectorKey];

  const [loading, setLoading] = useState(true);
  const [currentNodeKey, setCurrentNodeKey] = useState('root');
  const [history, setHistory] = useState<string[]>([]);
  const [selectedStream, setSelectedStream] = useState('');
  const [selectedSubPath, setSelectedSubPath] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [showAwareness, setShowAwareness] = useState(false);

  useEffect(() => {
    // Check cache on client mount
    const cached = localStorage.getItem('userProfile') || localStorage.getItem('activeSector');
    if (cached) {
      setLoading(false);
    }

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setLoading(false);
      } else if (localStorage.getItem('nexoraGuestMode') === 'true') {
        setLoading(false);
      } else {
        router.replace('/auth');
      }
    });
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyber-cyan to-cyber-violet animate-spin p-[2px] mb-4">
          <div className="w-full h-full bg-background rounded-[14px]"></div>
        </div>
        <span className="text-xs font-black tracking-widest text-cyber-cyan animate-pulse uppercase">
          VERIFYING ACCESS AUTHORIZATION...
        </span>
      </div>
    );
  }

  if (!sectorData) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-6 text-center px-4">
        <h2 className="text-2xl font-black text-white">Sector Gateway Offline</h2>
        <p className="text-sm text-white/50 max-w-md">
          The requested career domain onboarding module is currently in standby or undergoing system updates.
        </p>
        <Link href="/sectors" className="cyber-button-primary px-6 py-3 rounded-2xl text-xs font-black">
          RETURN TO SECTOR SELECTION
        </Link>
      </div>
    );
  }

  const { tree, colorPalette, awareness } = sectorData;
  const node = tree[currentNodeKey] || tree.root;

  const handleSelectOption = (nextKey: string, optionId?: string, optionLabel?: string) => {
    // Record selection path
    if (currentNodeKey === 'root') {
      setSelectedStream(optionLabel || optionId || '');
    } else {
      setSelectedSubPath(optionLabel || optionId || '');
    }

    if (nextKey === 'success') {
      // Celebratory trigger
      confetti({
        particleCount: 100,
        spread: 60,
        origin: { y: 0.6 },
        colors: [colorPalette.primary, colorPalette.secondary, '#FF008A', '#00F0FF']
      });

      // Instead of going straight to dashboard, show awareness module first!
      if (!selectedSubPath && optionLabel) {
        setSelectedSubPath(optionLabel);
      }
      setShowAwareness(true);
      return;
    }

    setHistory([...history, currentNodeKey]);
    setCurrentNodeKey(nextKey);
  };

  const handleGoBack = () => {
    if (showAwareness) {
      setShowAwareness(false);
      return;
    }
    if (history.length > 0) {
      const newHistory = [...history];
      const prevKey = newHistory.pop();
      setHistory(newHistory);
      setCurrentNodeKey(prevKey || 'root');
    } else {
      router.push('/sectors');
    }
  };

  const handleLaunchDashboard = async () => {
    setSyncing(true);
    try {
      localStorage.setItem('activeSector', sectorData.id);
      localStorage.setItem('activeStream', selectedStream);
      localStorage.setItem('activeSubPath', selectedSubPath);

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('profiles').upsert({
          id: user.id,
          sector: sectorData.id,
          stream: selectedStream,
          sub_path: selectedSubPath,
          updated_at: new Date()
        });
      }
      router.push('/dashboard');
    } catch (e) {
      console.error(e);
      router.push('/dashboard');
    }
  };

  // Dynamic Theme Styling
  const primaryColor = colorPalette.primary;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-16 space-y-8">
      
      {/* Back and Progress Track */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={handleGoBack}
          disabled={syncing}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] hover:bg-slate-200 dark:hover:bg-white/[0.08] text-xs font-bold text-slate-700 dark:text-white transition"
        >
          <ChevronLeft className="w-4 h-4" style={{ color: primaryColor }} />
          <span>{showAwareness ? 'Back to Selection' : (history.length > 0 ? 'Previous Level' : 'Exit to Sectors')}</span>
        </button>

        {/* Progress Bar */}
        <div className="flex-1 max-w-xs h-1.5 rounded-full bg-slate-200 dark:bg-white/[0.06] overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r transition-all duration-500"
            style={{ 
              width: showAwareness ? '100%' : `${Math.min(100, (history.length + 1) * 50)}%`,
              backgroundImage: `linear-gradient(to right, ${colorPalette.primary}, ${colorPalette.secondary})`,
              boxShadow: `0 0 8px ${colorPalette.primary}`
            }}
          ></div>
        </div>

        <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline" style={{ color: primaryColor }}>
          {showAwareness ? 'SYNCHRONIZED' : 'PATH RESOLVER'}
        </span>
      </div>

      {!showAwareness ? (
        /* DECISION TREE QUESTIONNAIRE */
        <div 
          className="glass-panel rounded-3xl border border-slate-200 dark:border-white/[0.12] p-6 sm:p-10 relative overflow-hidden transition-all duration-300"
          style={{ boxShadow: `0 0 50px ${colorPalette.primary}10` }}
        >
          {/* Ambient Glow */}
          <div 
            className="absolute -top-24 -right-24 w-60 h-60 rounded-full blur-3xl pointer-events-none"
            style={{ backgroundColor: `${colorPalette.primary}15` }}
          ></div>

          {/* Title / Question */}
          <div className="text-center space-y-2 mb-8">
            <span 
              className="inline-block text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full border"
              style={{ 
                color: colorPalette.primary, 
                borderColor: `${colorPalette.primary}30`,
                backgroundColor: `${colorPalette.primary}10` 
              }}
            >
              {node.subtitle}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {node.question}
            </h2>
          </div>

          {/* Grid Choices */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {node.options?.map((option) => (
              <button
                key={option.id}
                onClick={() => handleSelectOption(option.next, option.id, option.label)}
                disabled={syncing}
                className="text-left glass-card glass-card-hover rounded-2xl p-5 border border-slate-200 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/[0.18] group flex flex-col justify-between transition-all duration-300 min-h-[140px]"
              >
                <div>
                  <h3 
                    className="font-black text-base text-slate-900 dark:text-white transition-colors duration-200"
                    style={{ '--hover-color': colorPalette.primary } as any}
                  >
                    <span className="group-hover:text-[var(--hover-color)] transition-colors">
                      {option.label}
                    </span>
                  </h3>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-white/40 block mt-1">
                    {option.sub}
                  </span>
                  <p className="text-xs text-slate-500 dark:text-white/50 mt-3 font-normal leading-relaxed">
                    {option.brief}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/[0.04] flex items-center justify-between text-[11px] font-bold text-slate-400 dark:text-white/40 group-hover:text-[var(--hover-color)] transition-colors">
                  <span>Advance Path</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* AWARENESS & MARKET INSIGHT SCREEN */
        <div 
          className="glass-panel rounded-3xl border border-slate-200 dark:border-white/[0.12] p-6 sm:p-10 relative overflow-hidden transition-all duration-300 space-y-8"
          style={{ boxShadow: `0 0 50px ${colorPalette.primary}15` }}
        >
          {/* Ambient Glow */}
          <div 
            className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl pointer-events-none"
            style={{ backgroundColor: `${colorPalette.primary}20` }}
          ></div>

          {/* Main Success Title */}
          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-cyber-cyan to-cyber-violet p-[2px] mx-auto animate-bounce mb-2">
              <div className="w-full h-full bg-background rounded-full flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-cyber-cyan" />
              </div>
            </div>
            <span className="text-[11px] font-black tracking-widest text-cyber-cyan uppercase">
              MISSION STATUS: Pathway Resolved
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              {sectorData.name} Awareness Brief
            </h2>
            <p className="text-sm text-slate-500 dark:text-white/50 max-w-lg mx-auto">
              Selected Specialization: <span className="font-black text-slate-900 dark:text-white uppercase">{selectedSubPath || selectedStream}</span>
            </p>
          </div>

          <hr className="border-slate-100 dark:border-white/[0.08]" />

          {/* Awareness Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Pay Scale Card */}
            <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-white/[0.06] flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center justify-center shrink-0">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h4 className="text-[10px] font-black text-slate-400 dark:text-white/40 uppercase tracking-widest">STARTING PACKAGE</h4>
                <p className="text-base font-black text-slate-900 dark:text-white mt-0.5">{awareness.salaryRange}</p>
              </div>
            </div>

            {/* Demand Scale Card */}
            <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-white/[0.06] flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center shrink-0">
                <Flame className="w-6 h-6 text-red-400 animate-pulse" />
              </div>
              <div>
                <h4 className="text-[10px] font-black text-slate-400 dark:text-white/40 uppercase tracking-widest">MARKET DEMAND</h4>
                <p className="text-base font-black text-red-400 mt-0.5">{awareness.demand}</p>
              </div>
            </div>

            {/* Roles Card */}
            <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-white/[0.06] flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyber-cyan/10 border border-cyber-cyan/30 flex items-center justify-center shrink-0">
                <Briefcase className="w-6 h-6 text-cyber-cyan" />
              </div>
              <div>
                <h4 className="text-[10px] font-black text-slate-400 dark:text-white/40 uppercase tracking-widest">PLACEMENT ROLES</h4>
                <p className="text-[11px] font-bold text-slate-900 dark:text-white mt-0.5 line-clamp-2 leading-tight">
                  {awareness.roles.join(', ')}
                </p>
              </div>
            </div>
          </div>

          {/* Description Paragraphs */}
          <div className="space-y-4 text-sm text-slate-600 dark:text-white/70 leading-relaxed font-normal bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.05] p-6 rounded-2xl">
            <div className="flex items-start gap-2.5">
              <Info className="w-5 h-5 text-cyber-cyan shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-1">DOMAIN DIRECTIVE</h4>
                <p className="text-xs text-slate-500 dark:text-white/60">{awareness.description}</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 pt-2 border-t border-slate-100 dark:border-white/[0.04]">
              <TrendingUp className="w-5 h-5 text-cyber-magenta shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-1">TECH & MARKET OUTLOOK</h4>
                <p className="text-xs text-slate-500 dark:text-white/60">{awareness.marketInsight}</p>
              </div>
            </div>
          </div>

          {/* Call to action button */}
          <div className="text-center pt-4">
            <button
              onClick={handleLaunchDashboard}
              disabled={syncing}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-black flex items-center justify-center gap-2 group shadow-xl transition-all duration-300"
              style={{
                backgroundImage: `linear-gradient(to right, ${colorPalette.primary}, ${colorPalette.secondary})`,
                color: '#0A0E1A',
                boxShadow: `0 8px 30px ${colorPalette.primary}30`
              }}
            >
              {syncing ? (
                <>
                  <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin"></div>
                  <span>CREATING STUDENT PROFILE...</span>
                </>
              ) : (
                <>
                  <span>INITIALIZE DISPATCH & LAUNCH DASHBOARD</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
