'use client';

import React, { useState, useEffect } from 'react';
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
  Building2,
  Award
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { College, MOCK_COLLEGES, INITIAL_VAULT_FILES } from '@/lib/data';
import confetti from 'canvas-confetti';

const STREAMS = ['ALL', 'MPC', 'BiPC', 'Polytechnic', 'ITI'] as const;

export default function CollegesPage() {
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
          });
      }
    });

    const storedStream = localStorage.getItem('activeStream');
    if (storedStream) {
      setActiveStream(storedStream);
    }
  }, []);

  // Personalized Match Rate Calculation
  const getAdjustedMatch = (college: College) => {
    if (!profile?.skills || profile.skills.length === 0) {
      return college.matchRate;
    }

    let boost = 0;
    const mission = college.mission.toLowerCase();
    const desc = college.description.toLowerCase();
    
    profile.skills.forEach((skill: string) => {
      if (mission.includes(skill.toLowerCase()) || desc.includes(skill.toLowerCase())) {
        boost += 3;
      }
    });

    return Math.min(99, college.matchRate + boost);
  };

  // Filter colleges
  const filteredColleges = MOCK_COLLEGES.filter((col) => {
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

  // Apply Gateway
  const handleApply = (college: College) => {
    setApplyingId(college.id);
    setTimeout(() => {
      setApplyingId(null);
      const generatedToken = `NEX-${Math.floor(100000 + Math.random() * 900000)}`;
      setAppliedTokens((prev) => ({ ...prev, [college.id]: generatedToken }));
      setTokenAlert({
        collegeName: college.name,
        token: generatedToken,
        collegeId: college.id
      });
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    }, 1500);
  };

  // Save Token to Vault
  const handleSaveTokenToVault = () => {
    if (!tokenAlert) return;

    try {
      const stored = localStorage.getItem('vault_files');
      let files = stored ? JSON.parse(stored) : INITIAL_VAULT_FILES;
      
      const newFile = {
        id: Math.random().toString(),
        name: `Admissions_Token_${tokenAlert.token}.txt`,
        category: 'ADMISSIONS',
        size: '14 KB',
        date: new Date().toISOString().split('T')[0],
        content: `GATEWAY ADMISSION TOKEN: ${tokenAlert.token}\nINSTITUTION: ${tokenAlert.collegeName}\nVERIFICATION STATUS: VERIFIED CLOUD SYNC\nTIMESTAMP: ${new Date().toLocaleString()}`
      };

      files.unshift(newFile);
      localStorage.setItem('vault_files', JSON.stringify(files));
      setTokenAlert(null);
      alert('Admissions Gateway Token successfully encrypted and stored in your Document Vault locker!');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan text-[11px] font-black uppercase tracking-widest mb-1.5">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>ACADEMIC PLACEMENT NODES</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            INSTITUTES & ADMISSION GATES
          </h1>
          <p className="text-xs text-slate-500 dark:text-white/50 font-medium mt-1">
            Browse intermediate academies, polytechnic diploma hubs, and direct lateral entry universities.
          </p>
        </div>

        {/* Live Status Badge */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] text-xs font-black text-cyber-emerald self-start sm:self-auto shadow-sm">
          <span className="w-2 h-2 rounded-full bg-cyber-emerald animate-pulse"></span>
          <span>ONLINE SYNCED</span>
        </div>
      </div>

      {/* SEARCH AND STREAM FILTER PILLS */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search institute name, location, mission directive..."
              className="w-full bg-white dark:bg-surface-card border border-slate-200 dark:border-white/[0.1] rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none focus:border-cyber-cyan transition shadow-sm"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-white/40 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Stream Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {STREAMS.map((st) => (
              <button
                key={st}
                onClick={() => setActiveStream(st)}
                className={`px-4 py-3 rounded-2xl text-xs font-black tracking-wider uppercase transition-all shrink-0 ${
                  activeStream === st
                    ? 'bg-gradient-to-r from-cyber-cyan to-cyber-violet text-background shadow-lg shadow-cyber-cyan/20 scale-105'
                    : 'bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* COLLEGES GRID */}
      {filteredColleges.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center space-y-4">
          <Building2 className="w-12 h-12 text-slate-300 dark:text-white/20 mx-auto" />
          <h3 className="text-base font-black text-slate-900 dark:text-white">No College Nodes Found</h3>
          <p className="text-xs text-slate-500 dark:text-white/50 max-w-sm mx-auto">
            No matching institutes found for your query in the <span className="text-cyber-cyan font-bold">{activeStream}</span> stream.
          </p>
          <button
            onClick={() => { setActiveStream('ALL'); setSearchQuery(''); }}
            className="cyber-button-secondary px-5 py-2 rounded-xl text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredColleges.map((college) => {
            const adjustedMatch = getAdjustedMatch(college);
            const isApplied = !!appliedTokens[college.id];

            return (
              <div
                key={college.id}
                className="glass-card glass-card-hover rounded-3xl p-6 flex flex-col justify-between relative group overflow-hidden"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-cyber-magenta/10 border border-cyber-magenta/30 text-cyber-magenta">
                          {college.sector}
                        </span>
                        <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan">
                          {college.stream}
                        </span>
                      </div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-cyber-cyan transition pt-1">
                        {college.name}
                      </h3>
                      
                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-white/50 pt-0.5">
                        <span className="flex items-center gap-1 text-cyber-amber font-bold">
                          <Star className="w-3.5 h-3.5 fill-cyber-amber" />
                          {college.rating}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 truncate max-w-[160px]">
                          <MapPin className="w-3.5 h-3.5 text-cyber-cyan shrink-0" />
                          {college.location}
                        </span>
                      </div>
                    </div>

                    {/* Match Score Badge */}
                    <div className="w-14 h-14 rounded-2xl bg-cyber-cyan/10 border-2 border-cyber-cyan flex flex-col items-center justify-center shrink-0 shadow-md">
                      <span className="text-sm font-black text-slate-900 dark:text-white leading-none">{adjustedMatch}%</span>
                      <span className="text-[8px] font-black text-cyber-cyan tracking-wider mt-0.5">MATCH</span>
                    </div>
                  </div>

                  {/* Mission Directive Quote */}
                  <div className="p-3 rounded-xl bg-slate-100/60 dark:bg-white/[0.02] border-l-2 border-cyber-cyan mb-4">
                    <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 dark:text-white/40 block mb-1">
                      CAMPUS MISSION
                    </span>
                    <p className="text-xs text-slate-700 dark:text-white/70 italic leading-relaxed line-clamp-2">
                      &quot;{college.mission}&quot;
                    </p>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-4 border-t border-slate-200 dark:border-white/[0.06] flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedCollege(college)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-white/[0.04] hover:bg-slate-200 dark:hover:bg-white/[0.08] text-xs font-bold text-cyber-cyan flex items-center justify-center gap-1.5 transition"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>MISSION BRIEF</span>
                  </button>

                  <button
                    onClick={() => handleApply(college)}
                    disabled={isApplied || applyingId === college.id}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition ${
                      isApplied
                        ? 'bg-cyber-emerald/20 border border-cyber-emerald text-cyber-emerald'
                        : 'cyber-button-primary'
                    }`}
                  >
                    {applyingId === college.id ? (
                      <span className="animate-pulse">CONNECTING...</span>
                    ) : isApplied ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>SYNCD APPLY</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>APPLY GATEWAY</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* ADMISSION TOKEN MODAL ALERT */}
      {tokenAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md glass-panel rounded-3xl border border-cyber-cyan/30 p-6 sm:p-8 shadow-2xl text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-cyber-cyan/20 border border-cyber-cyan/40 text-cyber-cyan flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">GATEWAY ESTABLISHED</h3>
              <p className="text-xs text-slate-600 dark:text-white/60">
                Your Nexora Profile Dossier has been transmitted to <span className="font-bold text-slate-900 dark:text-white">{tokenAlert.collegeName}</span>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-surface border border-slate-200 dark:border-white/[0.1] space-y-1">
              <span className="text-[10px] font-black tracking-widest text-slate-400 dark:text-white/40 uppercase block">
                UNIQUE ADMISSIONS TOKEN
              </span>
              <span className="text-2xl font-mono font-black text-cyber-cyan tracking-widest block">
                {tokenAlert.token}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setTokenAlert(null)}
                className="flex-1 py-3 rounded-xl bg-slate-200 dark:bg-white/[0.05] hover:bg-slate-300 dark:hover:bg-white/[0.1] text-xs font-bold text-slate-800 dark:text-white transition"
              >
                Dismiss
              </button>
              <button
                onClick={handleSaveTokenToVault}
                className="flex-1 cyber-button-primary py-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-lg"
              >
                <FolderLock className="w-4 h-4" />
                <span>SAVE TO VAULT</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL BRIEFING MODAL */}
      {selectedCollege && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl glass-panel rounded-3xl border border-white/[0.12] p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/[0.08]">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-cyber-magenta px-2.5 py-0.5 rounded-md bg-cyber-magenta/10">
                    {selectedCollege.sector}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-wider text-cyber-cyan px-2.5 py-0.5 rounded-md bg-cyber-cyan/10">
                    {selectedCollege.stream} TRACK
                  </span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">{selectedCollege.name}</h2>
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-white/50">
                  <span className="text-cyber-amber font-bold flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-cyber-amber" />
                    {selectedCollege.rating} (Elite Standard)
                  </span>
                  <span>•</span>
                  <span>{selectedCollege.location}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedCollege(null)}
                className="w-8 h-8 rounded-full bg-slate-200 dark:bg-white/[0.05] hover:bg-slate-300 dark:hover:bg-white/[0.1] text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Directive & Description */}
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-cyber-cyan block">
                  THE MISSION DIRECTIVE
                </span>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-white/80 leading-relaxed">
                  {selectedCollege.description}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-white/[0.03] border-l-4 border-cyber-cyan space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-white/50 block">
                  CORE CAMPUS INITIATIVE
                </span>
                <p className="text-xs sm:text-sm text-slate-800 dark:text-white italic leading-relaxed">
                  &quot;{selectedCollege.mission}&quot;
                </p>
              </div>

              {/* Requirements */}
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-white/50 block">
                  ACADEMIC GATEWAY REQUIREMENTS
                </span>
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-surface border border-slate-200 dark:border-white/[0.08] text-xs font-bold text-slate-800 dark:text-white/80 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-cyber-amber shrink-0" />
                  <span>{selectedCollege.requirements}</span>
                </div>
              </div>

              {/* Perks */}
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-white/50 block">
                  NEXORA SCHOLARSHIPS & FELLOWSHIPS
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedCollege.perks.map((perk, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-cyber-pink/5 border border-cyber-pink/20 text-xs font-bold text-slate-800 dark:text-white/90 flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-cyber-pink shrink-0" />
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Bottom Apply Button */}
            <div className="pt-4 border-t border-slate-200 dark:border-white/[0.08]">
              <button
                onClick={() => {
                  const c = selectedCollege;
                  setSelectedCollege(null);
                  handleApply(c);
                }}
                className="w-full cyber-button-primary py-3.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-lg"
              >
                <Send className="w-4 h-4" />
                <span>INITIATE ADMISSIONS APPLICATION GATEWAY</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
