'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  TrendingUp,
  Award,
  BookMarked
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { INITIAL_EVENTS } from '@/lib/data';
import { SECTOR_TREES } from '@/lib/sectorTrees';
import ResumeModal from '@/components/Modals/ResumeModal';
import InterviewModal from '@/components/Modals/InterviewModal';
import ExplainerModal from '@/components/Modals/ExplainerModal';
import NotesModal from '@/components/Modals/NotesModal';
import PlannerModal from '@/components/Modals/PlannerModal';

// Helper to get specialized schedule items for each sector
const getScheduleForSector = (sectorId: string) => {
  const normalized = (sectorId || 'ENGINEERING').toUpperCase();
  switch (normalized) {
    case 'ENGINEERING':
      return [
        { id: '1', time: '08:30 AM', title: 'Mathematics (Calculus & Vectors)', location: 'Hall 102' },
        { id: '2', time: '10:45 AM', title: 'Data Structures & Algorithms Lab', location: 'Lab Block 3' },
        { id: '3', time: '02:15 PM', title: 'Physics (Quantum & Telemetry)', location: 'Hall 104' },
      ];
    case 'MEDICAL SUPPORT':
      return [
        { id: '1', time: '09:00 AM', title: 'Clinical Biochemistry & Pathology', location: 'Lab Room 204' },
        { id: '2', time: '11:30 AM', title: 'Hematology Diagnostics Practice', location: 'Lab Block 1' },
        { id: '3', time: '03:00 PM', title: 'Anatomy & Physiology Lecture', location: 'Lecture Hall B' },
      ];
    case 'COMPUTERS':
      return [
        { id: '1', time: '08:30 AM', title: 'Web Frameworks & React Nodes', location: 'System Lab 1' },
        { id: '2', time: '10:45 AM', title: 'SQL & Database Indexing Lab', location: 'Server Block 2' },
        { id: '3', time: '02:15 PM', title: 'Network Security & Firewalls', location: 'Seminar Hall 3' },
      ];
    case 'SKILLED TRADES':
      return [
        { id: '1', time: '08:30 AM', title: 'Machine Workshop (Lathe Control)', location: 'Workshop B' },
        { id: '2', time: '11:00 AM', title: 'Industrial Electrical Relays Lab', location: 'Power Block 1' },
        { id: '3', time: '02:00 PM', title: 'Blueprint Reading & CAD Drafts', location: 'Drawing Room 2' },
      ];
    case 'MERCHANT NAVY':
      return [
        { id: '1', time: '08:00 AM', title: 'Nautical Science & Sea Bearings', location: 'Simulator Room' },
        { id: '2', time: '10:30 AM', title: 'Marine Engine Valve Calibrations', location: 'Workshop Block' },
        { id: '3', time: '01:30 PM', title: 'Maritime Safety & Fire Fighting', location: 'Drill Quad' },
      ];
    case 'FASHION & DESIGN':
      return [
        { id: '1', time: '09:00 AM', title: 'Pattern Drafting & Draping Lab', location: 'Studio Block' },
        { id: '2', time: '11:30 AM', title: 'Textile Fiber Quality Analysis', location: 'Materials Lab' },
        { id: '3', time: '02:30 PM', title: 'Illustrator & Pattern CAD Nodes', location: 'Computer Lab 4' },
      ];
    case 'BUSINESS':
      return [
        { id: '1', time: '08:30 AM', title: 'Financial Ledger Accounting', location: 'Classroom 301' },
        { id: '2', time: '11:00 AM', title: 'FinTech Database Queries (SQL)', location: 'Data Lab B' },
        { id: '3', time: '02:00 PM', title: 'Venture Capital & Pitch Deck Lab', location: 'Boardroom B' },
      ];
    case 'MEDIA':
      return [
        { id: '1', time: '09:00 AM', title: 'Video Editing & Timeline Control', location: 'Edit Bay 2' },
        { id: '2', time: '11:30 AM', title: '3D VFX Rendering & Compositing', location: 'VFX Lab A' },
        { id: '3', time: '02:30 PM', title: 'Broadcasting & Scripting Studio', location: 'Studio Block C' },
      ];
    case 'HOSPITALITY':
      return [
        { id: '1', time: '08:30 AM', title: 'Front Office Operation Systems', location: 'Mock Lobby' },
        { id: '2', time: '11:00 AM', title: 'Aviation Lounge Safety Checklist', location: 'Mock Cabin 1' },
        { id: '3', time: '02:00 PM', title: 'International Culinary & Bakery', location: 'Kitchen Block' },
      ];
    case 'AGRICULTURE':
      return [
        { id: '1', time: '08:30 AM', title: 'Soil PH Nutrient Calibration', location: 'Agri Lab 102' },
        { id: '2', time: '11:00 AM', title: 'Drone Surveying & Crop Gridding', location: 'Field Quad' },
        { id: '3', time: '02:00 PM', title: 'Hydroponics & Crop Breeding', location: 'Greenhouse 2' },
      ];
    case 'AUTOMOBILE':
      return [
        { id: '1', time: '08:30 AM', title: 'EV Battery Cell Thermal Analysis', location: 'EV Lab Room' },
        { id: '2', time: '11:00 AM', title: 'Vehicle Braking & Stop Calculation', location: 'Chassis Quad' },
        { id: '3', time: '02:00 PM', title: 'Automotive Servicing & Diagnostics', location: 'Garage Block' },
      ];
    case 'CONSTRUCTION':
      return [
        { id: '1', time: '08:30 AM', title: 'Concrete Mix Design & Slump Test', location: 'Materials Lab' },
        { id: '2', time: '11:00 AM', title: 'BIM Modeling & AutoCAD Layouts', location: 'Design Lab A' },
        { id: '3', time: '02:00 PM', title: 'Land Surveying & GPS Levelling', location: 'Field Site 2' },
      ];
    case 'BEAUTY & WELLNESS':
      return [
        { id: '1', time: '09:00 AM', title: 'Dermal Skincare & pH Treatment', location: 'Aesthetic Room' },
        { id: '2', time: '11:30 AM', title: 'Holistic Dietetics & Nutrition', location: 'Nutrition Lab' },
        { id: '3', time: '02:30 PM', title: 'Salon Management & Invoicing', location: 'Mock Salon' },
      ];
    case 'RETAIL & LOGISTICS':
      return [
        { id: '1', time: '08:30 AM', title: 'Stock Barcoding & POS Invoicing', location: 'Mock Warehouse' },
        { id: '2', time: '11:00 AM', title: 'SCM Route Finder Optimization', location: 'Systems Lab 2' },
        { id: '3', time: '02:00 PM', title: 'Inventory Auditing & Ledger Scan', location: 'Office Room A' },
      ];
    default:
      return [
        { id: '1', time: '08:30 AM', title: 'Core Academic Foundation Course', location: 'Hall 102' },
        { id: '2', time: '11:00 AM', title: 'Domain Lab & Interactive Workshop', location: 'Lab Block 3' },
        { id: '3', time: '02:15 PM', title: 'Professional Skills Seminar', location: 'Hall 104' },
      ];
  }
};

export default function DashboardPage() {
  const router = useRouter();
  
  const [profile, setProfile] = useState<any>({
    fullName: 'Nexora Student',
    sector: 'ENGINEERING',
    stream: 'MPC',
    sub_path: ''
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'Home' | 'Events'>('Home');
  const [currentSlide, setCurrentSlide] = useState(0);

  // Daily Schedule items loaded optimistically
  const [schedule, setSchedule] = useState<any[]>([]);

  // Hover states for active glowing cards
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Modals state
  const [resumeOpen, setResumeOpen] = useState(false);
  const [interviewOpen, setInterviewOpen] = useState(false);
  const [explainerOpen, setExplainerOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [plannerOpen, setPlannerOpen] = useState(false);

  // Get active sector configuration
  const sectorKey = (profile.sector || 'ENGINEERING').toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
  const sectorConfig = SECTOR_TREES[sectorKey] || SECTOR_TREES['engineering'];
  const { colorPalette } = sectorConfig;
  const primaryColor = colorPalette.primary;
  const secondaryColor = colorPalette.secondary;

  // Map sector opportunities to sliding carousel alerts
  const slides = sectorConfig.dashboard.opportunities.map((opp) => ({
    id: opp.id,
    tag: opp.tag,
    title: opp.title,
    date: opp.date,
    desc: opp.desc,
    badge: opp.tag,
    badgeColor: opp.badgeColor
  }));

  // Fetch user profile in background & sync cache
  useEffect(() => {
    // 1. Optimistic Local Cache Load on Mount
    const cached = localStorage.getItem('userProfile');
    const storedSector = localStorage.getItem('activeSector');
    const storedStream = localStorage.getItem('activeStream');
    const storedSubPath = localStorage.getItem('activeSubPath');

    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setProfile(parsed);
        setSchedule(getScheduleForSector(parsed.sector));
        setLoading(false);
      } catch (e) {}
    } else if (storedSector || storedStream || storedSubPath) {
      const activeSec = storedSector || 'ENGINEERING';
      setProfile({
        fullName: 'Nexora Student',
        sector: activeSec,
        stream: storedStream || 'MPC',
        sub_path: storedSubPath || ''
      });
      setSchedule(getScheduleForSector(activeSec));
      setLoading(false);
    }

    // 2. Background verification check
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase
          .from('profiles')
          .select('full_name, sector, stream, sub_path')
          .eq('id', user.id)
          .single()
          .then(({ data }) => {
            if (data) {
              const updatedProfile = {
                fullName: data.full_name || 'Nexora Student',
                sector: data.sector || 'ENGINEERING',
                stream: data.stream || 'MPC',
                sub_path: data.sub_path || ''
              };
              setProfile(updatedProfile);
              setSchedule(getScheduleForSector(updatedProfile.sector));
              localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
              localStorage.setItem('activeSector', updatedProfile.sector);
              localStorage.setItem('activeStream', updatedProfile.stream);
              localStorage.setItem('activeSubPath', updatedProfile.sub_path);
            }
            setLoading(false);
          }, () => {
            setLoading(false);
          });
      } else if (localStorage.getItem('nexoraGuestMode') === 'true') {
        // Guest / Demo mode — allow through with mock data
        setLoading(false);
      } else {
        router.replace('/auth');
      }
    });
  }, [router]);

  // Auto-play carousel
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleAddSchedule = (item: { time: string; title: string; location: string }) => {
    setSchedule([...schedule, { id: Math.random().toString(), ...item }]);
  };

  const studentFirstName = profile.fullName ? profile.fullName.split(' ')[0] : 'Student';

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

  // Active Tool mapping for Tool 1 and 2 based on SectorTrees metadata
  const customTool1 = sectorConfig.dashboard.tools[0] || { name: 'Resume AI', desc: 'Scan and benchmark your technical credentials against placement gates.' };
  const customTool2 = sectorConfig.dashboard.tools[1] || { name: 'Interview Prep', desc: 'Simulate technical engineering and behavioral interview questions with AI.' };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-32 space-y-8">
      
      {/* TOP WELCOME BAR & PILL SWITCHER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Hi, {studentFirstName} 👋
            </h1>
            <span 
              className="px-2.5 py-0.5 rounded-full border text-[10px] font-black tracking-wider uppercase"
              style={{
                color: primaryColor,
                borderColor: `${primaryColor}40`,
                backgroundColor: `${primaryColor}15`
              }}
            >
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
            className={`px-5 py-2 rounded-xl text-xs font-black tracking-wider transition-all`}
            style={activeTab === 'Home' ? {
              backgroundImage: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
              color: '#0A0E1A',
              boxShadow: `0 4px 15px ${primaryColor}30`
            } : undefined}
          >
            HOME
          </button>
          <button
            onClick={() => setActiveTab('Events')}
            className={`px-5 py-2 rounded-xl text-xs font-black tracking-wider transition-all`}
            style={activeTab === 'Events' ? {
              backgroundImage: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
              color: '#0A0E1A',
              boxShadow: `0 4px 15px ${primaryColor}30`
            } : undefined}
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
            <div 
              className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between min-h-[260px] border border-white/[0.08] transition-all"
              style={{
                boxShadow: hoveredCard === 'slides' ? `0 0 30px ${primaryColor}15` : 'none',
                borderColor: hoveredCard === 'slides' ? `${primaryColor}30` : 'rgba(255,255,255,0.08)'
              }}
              onMouseEnter={() => setHoveredCard('slides')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div 
                className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-all"
                style={{ backgroundColor: `${primaryColor}10` }}
              ></div>

              {slides.length > 0 ? (
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <Megaphone className="w-4 h-4 animate-bounce" style={{ color: secondaryColor }} />
                      <span className="text-[10px] font-black tracking-widest uppercase" style={{ color: secondaryColor }}>
                        {slides[currentSlide].tag}
                      </span>
                    </div>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border ${slides[currentSlide].badgeColor}`}>
                      {slides[currentSlide].badge}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {slides[currentSlide].title}
                  </h2>
                  <span className="inline-block text-xs font-bold text-cyber-amber mt-1">
                    {slides[currentSlide].date}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-white/60 mt-2 leading-relaxed font-medium">
                    {slides[currentSlide].desc}
                  </p>
                </div>
              ) : (
                <div className="my-auto text-center text-white/30 text-xs font-bold">
                  No active sector announcements.
                </div>
              )}

              {/* Bottom Pagination & Action */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-200 dark:border-white/[0.06]">
                <div className="flex items-center gap-1.5">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentSlide(i)}
                      className={`h-2 rounded-full transition-all`}
                      style={{
                        width: currentSlide === i ? '24px' : '8px',
                        backgroundColor: currentSlide === i ? primaryColor : 'rgba(255,255,255,0.2)',
                        boxShadow: currentSlide === i ? `0 0 8px ${primaryColor}` : 'none'
                      }}
                    ></button>
                  ))}
                </div>

                <Link
                  href="/colleges"
                  className="text-xs font-bold hover:underline flex items-center gap-1 transition-colors"
                  style={{ color: primaryColor }}
                >
                  <span>Explore Admissions</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Right Schedule Displayer Panel */}
            <div 
              className="lg:col-span-5 glass-panel rounded-3xl p-6 sm:p-7 flex flex-col justify-between min-h-[260px] border border-white/[0.08]"
              style={{
                boxShadow: hoveredCard === 'routine' ? `0 0 30px ${primaryColor}15` : 'none',
                borderColor: hoveredCard === 'routine' ? `${primaryColor}30` : 'rgba(255,255,255,0.08)'
              }}
              onMouseEnter={() => setHoveredCard('routine')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/[0.08] mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" style={{ color: primaryColor }} />
                    <h3 className="font-black text-xs uppercase tracking-widest text-slate-900 dark:text-white">
                      TODAY&apos;S ROUTINE
                    </h3>
                  </div>
                  <button
                    onClick={() => setPlannerOpen(true)}
                    className="text-[10px] font-black hover:underline flex items-center gap-1"
                    style={{ color: primaryColor }}
                  >
                    <span>+ ADD CLASS</span>
                  </button>
                </div>

                {/* Checklist items */}
                <div className="space-y-2.5 max-h-[170px] overflow-y-auto pr-1">
                  {schedule.map((item: any) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-2xl bg-slate-100/70 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.06] hover:border-white/[0.15] transition flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{
                            backgroundColor: primaryColor,
                            boxShadow: `0 0 6px ${primaryColor}`
                          }}
                        ></div>
                        <div>
                          <h4 className="text-xs font-black text-slate-900 dark:text-white">{item.title}</h4>
                          <span className="text-[10px] text-slate-500 dark:text-white/40 font-bold">{item.location}</span>
                        </div>
                      </div>
                      <span 
                        className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg shrink-0"
                        style={{
                          color: primaryColor,
                          backgroundColor: `${primaryColor}10`
                        }}
                      >
                        {item.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-white/[0.06] flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-white/40">
                <span>{schedule.length} checkpoints scheduled</span>
                <span className="flex items-center gap-1" style={{ color: primaryColor }}>
                  <CheckCircle2 className="w-3.5 h-3.5" /> All systems nominal
                </span>
              </div>
            </div>

          </div>

          {/* INTERACTIVE TOOLKITS GRID */}
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-black tracking-widest uppercase" style={{ color: primaryColor }}>INTELLIGENCE SUITE</span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Interactive Student Toolkits</h2>
            </div>

            {/* 3-Column Top Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Tool 1: Dynamic Custom Tool */}
              <button
                onClick={() => setResumeOpen(true)}
                className="text-left glass-card glass-card-hover rounded-3xl p-5 group relative overflow-hidden transition-all duration-300"
                style={{
                  boxShadow: hoveredCard === 'tool1' ? `0 0 25px ${primaryColor}15` : 'none',
                  borderColor: hoveredCard === 'tool1' ? `${primaryColor}30` : 'rgba(255,255,255,0.06)'
                }}
                onMouseEnter={() => setHoveredCard('tool1')}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div 
                  className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border"
                  style={{
                    backgroundColor: `${primaryColor}15`,
                    borderColor: `${primaryColor}30`,
                    color: primaryColor
                  }}
                >
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="font-black text-base text-slate-900 dark:text-white group-hover:text-white transition">
                  {customTool1.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-white/50 mt-1 leading-relaxed">
                  {customTool1.desc}
                </p>
                <div 
                  className="mt-4 pt-3 border-t border-slate-200 dark:border-white/[0.06] flex items-center justify-between text-[11px] font-bold"
                  style={{ color: primaryColor }}
                >
                  <span>Launch Tool</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </button>

              {/* Tool 2: Dynamic Custom Tool 2 */}
              <button
                onClick={() => setInterviewOpen(true)}
                className="text-left glass-card glass-card-hover rounded-3xl p-5 group relative overflow-hidden transition-all duration-300"
                style={{
                  boxShadow: hoveredCard === 'tool2' ? `0 0 25px ${secondaryColor}15` : 'none',
                  borderColor: hoveredCard === 'tool2' ? `${secondaryColor}30` : 'rgba(255,255,255,0.06)'
                }}
                onMouseEnter={() => setHoveredCard('tool2')}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div 
                  className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border"
                  style={{
                    backgroundColor: `${secondaryColor}15`,
                    borderColor: `${secondaryColor}30`,
                    color: secondaryColor
                  }}
                >
                  <Mic className="w-5 h-5" />
                </div>
                <h3 className="font-black text-base text-slate-900 dark:text-white group-hover:text-white transition">
                  {customTool2.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-white/50 mt-1 leading-relaxed">
                  {customTool2.desc}
                </p>
                <div 
                  className="mt-4 pt-3 border-t border-slate-200 dark:border-white/[0.06] flex items-center justify-between text-[11px] font-bold"
                  style={{ color: secondaryColor }}
                >
                  <span>Start Mock Session</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </button>

              {/* Tool 3: Concept Explainer */}
              <button
                onClick={() => setExplainerOpen(true)}
                className="text-left glass-card glass-card-hover rounded-3xl p-5 group relative overflow-hidden transition-all duration-300"
                style={{
                  boxShadow: hoveredCard === 'tool3' ? `0 0 25px ${primaryColor}15` : 'none',
                  borderColor: hoveredCard === 'tool3' ? `${primaryColor}30` : 'rgba(255,255,255,0.06)'
                }}
                onMouseEnter={() => setHoveredCard('tool3')}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div 
                  className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border"
                  style={{
                    backgroundColor: `${primaryColor}15`,
                    borderColor: `${primaryColor}30`,
                    color: primaryColor
                  }}
                >
                  <Lightbulb className="w-5 h-5" />
                </div>
                <h3 className="font-black text-base text-slate-900 dark:text-white group-hover:text-white transition">
                  Concept Explainer
                </h3>
                <p className="text-xs text-slate-500 dark:text-white/50 mt-1 leading-relaxed">
                  Input complex course terminologies to get analogy-rich dynamic summaries.
                </p>
                <div 
                  className="mt-4 pt-3 border-t border-slate-200 dark:border-white/[0.06] flex items-center justify-between text-[11px] font-bold"
                  style={{ color: primaryColor }}
                >
                  <span>Solve Terminology</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </button>

            </div>

            {/* Smart Note Pad Full Width Banner */}
            <button
              onClick={() => setNotesOpen(true)}
              className="w-full text-left glass-card glass-card-hover rounded-3xl p-5 flex items-center justify-between group transition-all duration-300 border border-white/[0.06]"
              style={{
                boxShadow: hoveredCard === 'notepad' ? `0 0 25px ${secondaryColor}15` : 'none',
                borderColor: hoveredCard === 'notepad' ? `${secondaryColor}30` : 'rgba(255,255,255,0.06)'
              }}
              onMouseEnter={() => setHoveredCard('notepad')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="flex items-center gap-4">
                <div 
                  className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border"
                  style={{
                    backgroundColor: `${secondaryColor}15`,
                    borderColor: `${secondaryColor}30`,
                    color: secondaryColor
                  }}
                >
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900 dark:text-white transition">
                    Smart Lecture Note Pad
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-white/50 mt-0.5">
                    Draft lecture take-aways and instantly save notes to your Document Vault.
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 dark:text-white/40 group-hover:translate-x-1 transition-transform shrink-0" style={{ color: secondaryColor }} />
            </button>
          </div>

          {/* SCHEDULE PLANNER ROW */}
          <div 
            className="glass-panel rounded-3xl p-5 border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
            style={{
              borderColor: `${primaryColor}20`,
              boxShadow: `0 0 20px ${primaryColor}05`
            }}
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border"
                style={{
                  backgroundColor: `${primaryColor}10`,
                  borderColor: `${primaryColor}30`,
                  color: primaryColor
                }}
              >
                <CalendarPlus className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-black text-sm text-slate-900 dark:text-white">Academic Schedule Planner</h4>
                <p className="text-xs text-slate-500 dark:text-white/50">Manage semester routines, exam dates, and laboratory schedules</p>
              </div>
            </div>

            <button
              onClick={() => setPlannerOpen(true)}
              className="cyber-button-primary px-5 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 self-start sm:self-auto shadow-lg"
              style={{
                backgroundImage: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
                color: '#0A0E1A',
                boxShadow: `0 4px 15px ${primaryColor}20`
              }}
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
            <span className="text-[10px] font-black tracking-widest uppercase" style={{ color: primaryColor }}>LIVE RADAR</span>
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
                    <span className="text-base font-black leading-none" style={{ color: primaryColor }}>{evt.dateNum}</span>
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
