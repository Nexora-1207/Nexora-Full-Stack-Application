'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Calendar, 
  Clock, 
  ChevronRight, 
  FileText, 
  Mic, 
  Lightbulb, 
  BookOpen, 
  CalendarPlus, 
  Megaphone, 
  Compass, 
  CheckCircle2, 
  Flame,
  ArrowUpRight,
  TrendingUp
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { INITIAL_EVENTS } from '@/lib/data';
import ResumeModal from '@/components/Modals/ResumeModal';
import InterviewModal from '@/components/Modals/InterviewModal';
import ExplainerModal from '@/components/Modals/ExplainerModal';
import NotesModal from '@/components/Modals/NotesModal';
import PlannerModal from '@/components/Modals/PlannerModal';

const SLIDES = [
  {
    id: 's1',
    tag: 'GLOBAL ADMISSION NODE',
    title: 'JEE Main Phase 3 Portal Active',
    date: 'Deadline: Aug 25, 2026',
    desc: 'Joint Entrance Examination portal is open for registration. Target elite NIT and IIT engineering blocks.',
    badge: 'CRITICAL',
    badgeColor: 'bg-cyber-magenta/15 text-cyber-magenta border-cyber-magenta/40'
  },
  {
    id: 's2',
    tag: 'HACKATHON LAUNCH',
    title: 'Nexora National Hackathon 2026',
    date: 'Starts: Sep 10, 2026',
    desc: '48-hour virtual engineering challenge in AI, Robotics, and Smart Grid software. Teams of 2 to 4 eligible.',
    badge: 'INR 2 LAKH PRIZE',
    badgeColor: 'bg-cyber-cyan/15 text-cyber-cyan border-cyber-cyan/40'
  },
  {
    id: 's3',
    tag: 'SEED FELLOWSHIP',
    title: 'Vanguard Entrepreneur Grant',
    date: 'Closes: Oct 02, 2026',
    desc: 'Pitch your technical prototype directly to Silicon Valley seed investor panels for 100% tuition coverage.',
    badge: '100% FUNDED',
    badgeColor: 'bg-cyber-amber/15 text-cyber-amber border-cyber-amber/40'
  }
];

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>({
    fullName: 'Nexora Student',
    sector: 'ENGINEERING',
    stream: 'MPC'
  });
  const [activeTab, setActiveTab] = useState<'Home' | 'Events'>('Home');
  const [currentSlide, setCurrentSlide] = useState(0);

  // Daily Schedule items
  const [schedule, setSchedule] = useState([
    { id: '1', time: '08:30 AM', title: 'Mathematics (Calculus & Vectors)', location: 'Hall 102' },
    { id: '2', time: '10:45 AM', title: 'Data Structures & Algorithms Lab', location: 'Lab Block 3' },
    { id: '3', time: '02:15 PM', title: 'Physics (Quantum & Telemetry)', location: 'Hall 104' },
  ]);

  // Modals state
  const [resumeOpen, setResumeOpen] = useState(false);
  const [interviewOpen, setInterviewOpen] = useState(false);
  const [explainerOpen, setExplainerOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [plannerOpen, setPlannerOpen] = useState(false);

  // Auto-play carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Fetch user profile
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase
          .from('profiles')
          .select('full_name, sector, stream, sub_path')
          .eq('id', user.id)
          .single()
          .then(({ data }) => {
            if (data) {
              setProfile({
                fullName: data.full_name || 'Nexora Student',
                sector: data.sector || 'ENGINEERING',
                stream: data.stream || 'MPC'
              });
            }
          });
      }
    });

    const storedSector = localStorage.getItem('activeSector');
    const storedStream = localStorage.getItem('activeStream');
    if (storedSector || storedStream) {
      setProfile((prev: any) => ({
        ...prev,
        sector: storedSector || prev.sector,
        stream: storedStream || prev.stream
      }));
    }
  }, []);

  const handleAddSchedule = (item: { time: string; title: string; location: string }) => {
    setSchedule([...schedule, { id: Math.random().toString(), ...item }]);
  };

  const studentFirstName = profile.fullName ? profile.fullName.split(' ')[0] : 'Student';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 space-y-8">
      
      {/* TOP WELCOME BAR & PILL SWITCHER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Hi, {studentFirstName} 👋
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-cyber-cyan/15 border border-cyber-cyan/40 text-[10px] font-black text-cyber-cyan tracking-wider uppercase">
              {profile.stream} TRACK
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-white/50 font-medium mt-0.5">
            Academic Sector: <span className="font-bold text-slate-800 dark:text-white/80">{profile.sector}</span> • Placement Readiness Matrix Synced
          </p>
        </div>

        {/* Home / Events Pill Switcher */}
        <div className="inline-flex p-1 rounded-2xl bg-slate-200/80 dark:bg-white/[0.04] border border-slate-300/80 dark:border-white/[0.08] self-start sm:self-auto shadow-inner">
          <button
            onClick={() => setActiveTab('Home')}
            className={`px-5 py-2 rounded-xl text-xs font-black tracking-wider transition-all ${
              activeTab === 'Home'
                ? 'bg-gradient-to-r from-cyber-cyan to-cyber-violet text-background shadow-lg shadow-cyber-cyan/20 scale-105'
                : 'text-slate-600 dark:text-white/50 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            HOME
          </button>
          <button
            onClick={() => setActiveTab('Events')}
            className={`px-5 py-2 rounded-xl text-xs font-black tracking-wider transition-all ${
              activeTab === 'Events'
                ? 'bg-gradient-to-r from-cyber-cyan to-cyber-violet text-background shadow-lg shadow-cyber-cyan/20 scale-105'
                : 'text-slate-600 dark:text-white/50 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            EVENTS
          </button>
        </div>
      </div>

      {/* TAB CONTENT */}
      {activeTab === 'Home' ? (
        <div className="space-y-8">
          
          {/* HERO ROW: Left Slideshow + Right Schedule */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Carousel Panel */}
            <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between min-h-[260px]">
              <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-cyber-cyan/15 to-transparent rounded-full blur-3xl pointer-events-none"></div>

              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <Megaphone className="w-4 h-4 text-cyber-magenta animate-bounce" />
                    <span className="text-[10px] font-black tracking-widest text-cyber-magenta uppercase">
                      {SLIDES[currentSlide].tag}
                    </span>
                  </div>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border ${SLIDES[currentSlide].badgeColor}`}>
                    {SLIDES[currentSlide].badge}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {SLIDES[currentSlide].title}
                </h2>
                <span className="inline-block text-xs font-bold text-cyber-amber mt-1">
                  {SLIDES[currentSlide].date}
                </span>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-white/60 mt-2 leading-relaxed max-w-xl">
                  {SLIDES[currentSlide].desc}
                </p>
              </div>

              {/* Bottom Pagination & Action */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-200 dark:border-white/[0.06]">
                <div className="flex items-center gap-1.5">
                  {SLIDES.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentSlide(i)}
                      className={`h-2 rounded-full transition-all ${
                        currentSlide === i 
                          ? 'w-6 bg-cyber-cyan shadow-[0_0_8px_#00F0FF]' 
                          : 'w-2 bg-slate-300 dark:bg-white/20 hover:bg-slate-400 dark:hover:bg-white/40'
                      }`}
                    ></button>
                  ))}
                </div>

                <Link
                  href="/colleges"
                  className="text-xs font-bold text-cyber-cyan hover:underline flex items-center gap-1"
                >
                  <span>Explore Admissions</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Right Schedule Displayer Panel */}
            <div className="lg:col-span-5 glass-panel rounded-3xl p-6 sm:p-7 flex flex-col justify-between min-h-[260px]">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/[0.08] mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-cyber-cyan" />
                    <h3 className="font-black text-xs uppercase tracking-widest text-slate-900 dark:text-white">
                      TODAY&apos;S ROUTINE
                    </h3>
                  </div>
                  <button
                    onClick={() => setPlannerOpen(true)}
                    className="text-[10px] font-black text-cyber-cyan hover:underline flex items-center gap-1"
                  >
                    <span>+ ADD CLASS</span>
                  </button>
                </div>

                {/* Checklist items */}
                <div className="space-y-2.5 max-h-[170px] overflow-y-auto pr-1">
                  {schedule.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-2xl bg-slate-100/70 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.06] hover:border-cyber-cyan/30 transition flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-cyber-cyan shadow-[0_0_6px_#00F0FF] shrink-0"></div>
                        <div>
                          <h4 className="text-xs font-black text-slate-900 dark:text-white">{item.title}</h4>
                          <span className="text-[10px] text-slate-500 dark:text-white/40 font-bold">{item.location}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-cyber-cyan px-2 py-0.5 rounded-lg bg-cyber-cyan/10 shrink-0">
                        {item.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-white/[0.06] flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-white/40">
                <span>{schedule.length} checkpoints scheduled</span>
                <span className="text-cyber-emerald flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> All systems nominal
                </span>
              </div>
            </div>

          </div>

          {/* INTERACTIVE TOOLKITS GRID */}
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-black tracking-widest text-cyber-cyan uppercase">INTELLIGENCE SUITE</span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Interactive Student Toolkits</h2>
            </div>

            {/* 3-Column Top Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Tool 1: Resume AI */}
              <button
                onClick={() => setResumeOpen(true)}
                className="text-left glass-card glass-card-hover rounded-3xl p-5 hover:border-cyber-amber/40 group relative overflow-hidden"
              >
                <div className="w-11 h-11 rounded-2xl bg-cyber-amber/15 border border-cyber-amber/30 text-cyber-amber flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="font-black text-base text-slate-900 dark:text-white group-hover:text-cyber-amber transition">
                  Resume AI
                </h3>
                <p className="text-xs text-slate-500 dark:text-white/50 mt-1 leading-relaxed">
                  Scan and benchmark your technical credentials against placement gates.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-white/[0.06] flex items-center justify-between text-[11px] font-bold text-cyber-amber">
                  <span>Launch Scanner</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </button>

              {/* Tool 2: Interview Prep */}
              <button
                onClick={() => setInterviewOpen(true)}
                className="text-left glass-card glass-card-hover rounded-3xl p-5 hover:border-cyber-magenta/40 group relative overflow-hidden"
              >
                <div className="w-11 h-11 rounded-2xl bg-cyber-magenta/15 border border-cyber-magenta/30 text-cyber-magenta flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Mic className="w-5 h-5" />
                </div>
                <h3 className="font-black text-base text-slate-900 dark:text-white group-hover:text-cyber-magenta transition">
                  Interview Prep
                </h3>
                <p className="text-xs text-slate-500 dark:text-white/50 mt-1 leading-relaxed">
                  Simulate technical engineering and behavioral interview questions with AI.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-white/[0.06] flex items-center justify-between text-[11px] font-bold text-cyber-magenta">
                  <span>Start Mock Session</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </button>

              {/* Tool 3: Concept Explainer */}
              <button
                onClick={() => setExplainerOpen(true)}
                className="text-left glass-card glass-card-hover rounded-3xl p-5 hover:border-cyber-cyan/40 group relative overflow-hidden"
              >
                <div className="w-11 h-11 rounded-2xl bg-cyber-cyan/15 border border-cyber-cyan/30 text-cyber-cyan flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <h3 className="font-black text-base text-slate-900 dark:text-white group-hover:text-cyber-cyan transition">
                  Concept Explainer
                </h3>
                <p className="text-xs text-slate-500 dark:text-white/50 mt-1 leading-relaxed">
                  Input complex science or mechanical terms to get analogy-rich summaries.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-white/[0.06] flex items-center justify-between text-[11px] font-bold text-cyber-cyan">
                  <span>Solve Terminology</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </button>

            </div>

            {/* Smart Note Pad Full Width Banner */}
            <button
              onClick={() => setNotesOpen(true)}
              className="w-full text-left glass-card glass-card-hover rounded-3xl p-5 hover:border-cyber-violet/40 flex items-center justify-between group transition"
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-cyber-violet/15 border border-cyber-violet/30 text-cyber-violet flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900 dark:text-white group-hover:text-cyber-violet transition">
                    Smart Lecture Note Pad
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-white/50 mt-0.5">
                    Draft lecture take-aways and instantly save notes to your Document Vault.
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 dark:text-white/40 group-hover:text-cyber-violet group-hover:translate-x-1 transition-transform shrink-0" />
            </button>
          </div>

          {/* SCHEDULE PLANNER ROW */}
          <div className="glass-panel rounded-3xl p-5 border border-cyber-cyan/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan flex items-center justify-center shrink-0">
                <CalendarPlus className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-black text-sm text-slate-900 dark:text-white">Academic Schedule Planner</h4>
                <p className="text-xs text-slate-500 dark:text-white/50">Manage semester routines, exam dates, and laboratory schedules</p>
              </div>
            </div>

            <button
              onClick={() => setPlannerOpen(true)}
              className="cyber-button-primary px-5 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 self-start sm:self-auto"
            >
              <CalendarPlus className="w-4 h-4" />
              <span>ADD TO SCHEDULE</span>
            </button>
          </div>

        </div>
      ) : (
        /* EVENTS TIMELINE FEED */
        <div className="space-y-4">
          <div className="mb-2">
            <span className="text-[10px] font-black tracking-widest text-cyber-cyan uppercase">LIVE RADAR</span>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Campus & Career Event Nodes</h2>
          </div>

          <div className="space-y-3.5">
            {INITIAL_EVENTS.map((evt) => (
              <div
                key={evt.id}
                className="glass-card rounded-3xl p-6 hover:border-cyber-cyan/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  {/* Date Badge */}
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-surface border border-slate-200 dark:border-white/[0.1] flex flex-col items-center justify-center shrink-0 text-center">
                    <span className="text-base font-black text-cyber-cyan leading-none">{evt.dateNum}</span>
                    <span className="text-[9px] font-black uppercase text-slate-500 dark:text-white/50 tracking-wider mt-0.5">{evt.dateMon}</span>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-200/60 dark:bg-white/[0.04] text-slate-700 dark:text-white/60">
                        {evt.category}
                      </span>
                      <span 
                        className="text-[9px] font-black px-2 py-0.5 rounded-md border"
                        style={{ borderColor: `${evt.badgeColor}40`, color: evt.badgeColor, backgroundColor: `${evt.badgeColor}15` }}
                      >
                        {evt.badge}
                      </span>
                    </div>
                    <h3 className="font-black text-base text-slate-900 dark:text-white">{evt.title}</h3>
                    <p className="text-xs text-slate-600 dark:text-white/60 leading-relaxed max-w-2xl">{evt.description}</p>
                  </div>
                </div>

                <Link
                  href="/colleges"
                  className="cyber-button-secondary px-5 py-2.5 rounded-xl text-xs font-bold shrink-0 self-start sm:self-auto flex items-center gap-1.5"
                >
                  <span>{evt.linkText}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL DIALOGS */}
      <ResumeModal isOpen={resumeOpen} onClose={() => setResumeOpen(false)} />
      <InterviewModal isOpen={interviewOpen} onClose={() => setInterviewOpen(false)} />
      <ExplainerModal isOpen={explainerOpen} onClose={() => setExplainerOpen(false)} />
      <NotesModal isOpen={notesOpen} onClose={() => setNotesOpen(false)} />
      <PlannerModal isOpen={plannerOpen} onClose={() => setPlannerOpen(false)} onAdd={handleAddSchedule} />

    </div>
  );
}
