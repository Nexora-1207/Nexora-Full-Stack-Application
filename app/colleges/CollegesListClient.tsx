'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  GraduationCap, 
  Search, 
  Star, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  FileText, 
  Send, 
  X, 
  ShieldAlert,
  FolderLock,
  Lock,
  Building2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { College, MOCK_COLLEGES, INITIAL_VAULT_FILES } from '@/lib/data';
import { useCyberToast } from '@/components/CyberToast';
import confetti from 'canvas-confetti';

const STREAMS = ['ALL', 'MPC', 'BiPC', 'Polytechnic', 'ITI'] as const;

export default function CollegesListClient() {
  const router = useRouter();
  const toast = useCyberToast();
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const [activeStream, setActiveStream] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [profile, setProfile] = useState<any>(null);
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  
  // Application token states
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [appliedTokens, setAppliedTokens] = useState<Record<string, string>>({});
  const [tokenAlert, setTokenAlert] = useState<{ collegeName: string; token: string; collegeId: string } | null>(null);

  // Load user profile & set default stream
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setIsGuest(false);
        supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
          .then(({ data }) => {
            if (data) {
              setProfile(data);
              if (data.stream) {
                setActiveStream(data.stream);
              }
            }
            setLoading(false);
          }, () => {
            setLoading(false);
          });
      } else if (localStorage.getItem('nexoraGuestMode') === 'true') {
        setIsGuest(true);
        setLoading(false);
      } else {
        router.replace('/auth');
      }
    });

    const storedStream = localStorage.getItem('activeStream');
    if (storedStream) {
      setActiveStream(storedStream);
    }
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

  // Filter colleges
  const allFilteredColleges = MOCK_COLLEGES.filter((col) => {
    const matchesStream = activeStream === 'ALL' || col.stream === activeStream;
    const q = searchQuery.toLowerCase();
    const matchesQuery = 
      col.name.toLowerCase().includes(q) ||
      col.shortName.toLowerCase().includes(q) ||
      col.location.toLowerCase().includes(q) ||
      col.mission.toLowerCase().includes(q) ||
      col.stream.toLowerCase().includes(q);
    return matchesStream && matchesQuery;
  });

  // Guest Account Limit: display maximum 3 colleges
  const displayedColleges = isGuest ? allFilteredColleges.slice(0, 3) : allFilteredColleges;

  // Apply Gateway - Navigate directly to dedicated admission page
  const handleApply = (college: College) => {
    if (isGuest) {
      toast.info('Registration Required', '🔒 Login or Register to submit college applications!');
      router.push('/auth');
      return;
    }
    router.push(`/colleges/${college.id}/apply`);
  };

  const handleInspectCollege = (collegeId: string) => {
    if (isGuest) {
      toast.info('Registration Required', '🔒 Register or Sign In to view detailed college specs & cutoff analytics!');
      router.push('/auth');
      return;
    }
    router.push(`/colleges/${collegeId}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-32 space-y-8">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan text-[11px] font-black uppercase tracking-widest mb-1.5">
            <Building2 className="w-3.5 h-3.5" />
            <span>INSTITUTIONAL ADMISSION HUB</span>
            {isGuest && (
              <span className="px-2 py-0.5 rounded-full bg-cyber-pink/20 text-cyber-pink text-[9px]">
                GUEST PREVIEW (3 COLLEGES)
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            COLLEGES & INSTITUTES
          </h1>
        </div>
      </div>

      {/* SEARCH AND STREAM FILTER BAR */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search colleges by name, location, or specialized stream..."
            className="w-full bg-white dark:bg-surface-card border border-slate-200 dark:border-white/[0.1] rounded-2xl pl-11 pr-4 py-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none focus:border-cyber-cyan transition shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {STREAMS.map((s) => (
            <button
              key={s}
              onClick={() => setActiveStream(s)}
              className={`px-4 py-2 rounded-xl text-xs font-black tracking-wider uppercase transition-all shrink-0 ${
                activeStream === s
                  ? 'bg-gradient-to-r from-cyber-cyan to-cyber-violet text-background shadow-md scale-105'
                  : 'bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* COLLEGES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedColleges.map((college) => (
          <div
            key={college.id}
            className="glass-card glass-card-hover rounded-3xl p-6 flex flex-col justify-between space-y-4 relative group overflow-hidden"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-md bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan">
                  {college.stream} TRACK
                </span>
                
                <span className="flex items-center gap-1 text-xs font-bold text-cyber-amber">
                  <Star className="w-3.5 h-3.5 fill-cyber-amber" />
                  <span>{college.rating}</span>
                </span>
              </div>

              <h3 className="font-black text-lg text-slate-900 dark:text-white group-hover:text-cyber-cyan transition line-clamp-1">
                {college.name}
              </h3>
              
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-white/50 mt-1">
                <MapPin className="w-3.5 h-3.5 text-cyber-cyan" />
                <span>{college.location}</span>
              </div>

              <p className="text-xs text-slate-600 dark:text-white/60 mt-3 line-clamp-2 leading-relaxed">
                {college.mission}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-white/[0.06] flex items-center justify-between gap-2">
              <button
                onClick={() => handleInspectCollege(college.id)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-white/[0.04] hover:bg-slate-200 dark:hover:bg-white/[0.08] text-xs font-bold text-cyber-cyan flex items-center justify-center gap-1.5 transition"
              >
                <span>Inspect Specs</span>
              </button>

              <button
                onClick={() => handleApply(college)}
                className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyber-cyan to-cyber-violet text-background font-black text-xs flex items-center justify-center gap-1.5 hover:brightness-110 transition shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Apply</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* GUEST BLURRED LOCKED OVERLAY CARD */}
      {isGuest && (
        <div className="glass-panel rounded-3xl p-8 border border-red-500/30 bg-gradient-to-r from-red-500/10 via-purple-500/10 to-cyber-cyan/10 text-center space-y-4 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-black text-white">
              250+ MORE COLLEGES & CUTOFF ANALYTICS LOCKED
            </h3>
            <p className="text-xs text-white/70 max-w-md mx-auto leading-relaxed">
              Register or Sign In to explore full institutional directories, seat matrices, fee structures, and placement analytics across India.
            </p>
          </div>
          <button
            onClick={() => router.push('/auth')}
            className="cyber-button-primary px-8 py-3.5 rounded-2xl text-xs font-black inline-flex items-center gap-2 shadow-xl"
          >
            <Lock className="w-4 h-4" />
            <span>REGISTER / SIGN IN TO UNLOCK FULL DIRECTORY</span>
          </button>
        </div>
      )}

    </div>
  );
}
