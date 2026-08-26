'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  Calendar, 
  Clock, 
  ChevronRight, 
  ChevronLeft,
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
import { useCyberToast } from '@/components/CyberToast';
import ResumeModal from '@/components/Modals/ResumeModal';
import InterviewModal from '@/components/Modals/InterviewModal';
import ExplainerModal from '@/components/Modals/ExplainerModal';
import NotesModal from '@/components/Modals/NotesModal';
import PlannerModal from '@/components/Modals/PlannerModal';

// Sector-specific high-resolution ambient thematic background images
const SECTOR_BACKGROUND_IMAGES: Record<string, string> = {
  ENGINEERING: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=2000&auto=format&fit=crop",
  "MEDICAL SUPPORT": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2000&auto=format&fit=crop",
  COMPUTERS: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2000&auto=format&fit=crop",
  "SKILLED TRADES": "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?q=80&w=2000&auto=format&fit=crop",
  "MERCHANT NAVY": "/images/merchant_navy_engine.jpg",
  "FASHION & DESIGN": "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2000&auto=format&fit=crop",
  BUSINESS: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2000&auto=format&fit=crop",
  MEDIA: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2000&auto=format&fit=crop",
  HOSPITALITY: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2000&auto=format&fit=crop",
  AGRICULTURE: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2000&auto=format&fit=crop",
  AUTOMOBILE: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=2000&auto=format&fit=crop",
  CONSTRUCTION: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?q=80&w=2000&auto=format&fit=crop",
  "BEAUTY & WELLNESS": "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2000&auto=format&fit=crop",
  "RETAIL & LOGISTICS": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2000&auto=format&fit=crop",
  AVIATION: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2000&auto=format&fit=crop",
  SPORTS: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=2000&auto=format&fit=crop",
  LAW: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2000&auto=format&fit=crop",
  VOCATIONAL: "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?q=80&w=2000&auto=format&fit=crop",
};

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
        { id: '1', time: '07:30 AM', title: 'Physical Drills & Shipboard Safety', location: 'Drill Deck' },
        { id: '2', time: '10:00 AM', title: 'Celestial Navigation & Radar', location: 'Bridge Sim 1' },
        { id: '3', time: '02:30 PM', title: 'Marine Diesel Maintenance', location: 'Engine Lab' },
      ];
    case 'FASHION & DESIGN':
      return [
        { id: '1', time: '09:00 AM', title: 'Fashion Illustration & Draping', location: 'Studio 4' },
        { id: '2', time: '11:30 AM', title: 'Textile Fiber Testing Lab', location: 'Weaving Lab' },
        { id: '3', time: '02:30 PM', title: 'Digital Pattern Drafting (CAD)', location: 'Design Lab 2' },
      ];
    case 'BUSINESS':
      return [
        { id: '1', time: '08:30 AM', title: 'Financial Accounting & Ledgers', location: 'Hall 201' },
        { id: '2', time: '11:00 AM', title: 'Macroeconomics & Global Markets', location: 'Hall 105' },
        { id: '3', time: '02:00 PM', title: 'FinTech Startup Analytics Lab', location: 'Computer Block 4' },
      ];
    case 'MEDIA':
      return [
        { id: '1', time: '09:00 AM', title: 'Digital Cinematography & Lighting', location: 'Studio Floor A' },
        { id: '2', time: '11:45 AM', title: 'Non-Linear Video Editing Lab', location: 'VFX Suite 3' },
        { id: '3', time: '03:00 PM', title: 'Mass Communication Law & Ethics', location: 'Seminar Room 1' },
      ];
    case 'HOSPITALITY':
      return [
        { id: '1', time: '08:30 AM', title: 'Food Production & Culinary Arts', location: 'Kitchen Lab A' },
        { id: '2', time: '11:15 AM', title: 'Front Office Operations Simulator', location: 'PMS Lab' },
        { id: '3', time: '02:30 PM', title: 'Tourism Geography & Guest Service', location: 'Room 302' },
      ];
    case 'AGRICULTURE':
      return [
        { id: '1', time: '08:00 AM', title: 'Soil Fertility & Nutrient Testing', location: 'Agronomy Field' },
        { id: '2', time: '10:30 AM', title: 'Agri-Drone Telemetry & Spraying', location: 'Hangar Block' },
        { id: '3', time: '02:00 PM', title: 'Horticulture & Plant Pathology', location: 'Greenhouse 2' },
      ];
    case 'AVIATION':
      return [
        { id: '1', time: '08:30 AM', title: 'Aerodynamics & Flight Mechanics', location: 'Sim Hall A' },
        { id: '2', time: '11:00 AM', title: 'Aircraft Systems & Avionics Lab', location: 'Hangar Lab' },
        { id: '3', time: '02:15 PM', title: 'Air Traffic Control Protocols', location: 'ATC Tower Sim' },
      ];
    case 'AUTOMOBILE':
      return [
        { id: '1', time: '08:30 AM', title: 'Internal Combustion & EV Battery Diagnostics', location: 'Auto Bay 1' },
        { id: '2', time: '11:00 AM', title: 'Chassis Dynamics & Aerodynamics Lab', location: 'Wind Tunnel' },
        { id: '3', time: '02:15 PM', title: 'ECU Telemetry & Engine Mapping', location: 'Dyno Room' },
      ];
    case 'CONSTRUCTION':
      return [
        { id: '1', time: '08:30 AM', title: 'Structural Analysis & Reinforced Concrete', location: 'Hall 204' },
        { id: '2', time: '11:00 AM', title: 'Building Information Modeling (BIM)', location: 'CAD Lab 2' },
        { id: '3', time: '02:00 PM', title: 'Geotechnical Soil Mechanics Lab', location: 'Civil Field' },
      ];
    case 'BEAUTY & WELLNESS':
      return [
        { id: '1', time: '09:00 AM', title: 'Dermatology Science & Botanical Cosmetology', location: 'Clinic Lab A' },
        { id: '2', time: '11:30 AM', title: 'Aesthetic Wellness & Hydrotherapy', location: 'Spa Studio' },
        { id: '3', time: '02:30 PM', title: 'Nutrition & Holistic Health Systems', location: 'Seminar 3' },
      ];
    case 'RETAIL & LOGISTICS':
      return [
        { id: '1', time: '08:30 AM', title: 'Supply Chain Optimization & Fleet Routing', location: 'Logistics Hub' },
        { id: '2', time: '11:00 AM', title: 'Warehouse Automation & RFID Tracking', location: 'Sim Lab 4' },
        { id: '3', time: '02:15 PM', title: 'Retail Category Management & CRM', location: 'Hall 108' },
      ];
    case 'SPORTS':
      return [
        { id: '1', time: '06:30 AM', title: 'Athletic Conditioning & Agility', location: 'Track Field' },
        { id: '2', time: '10:00 AM', title: 'Kinesiology & Biomechanics', location: 'Sports Science Lab' },
        { id: '3', time: '02:30 PM', title: 'Sports Nutrition & Injury Rehab', location: 'Fitness Centre' },
      ];
    case 'LAW':
      return [
        { id: '1', time: '09:00 AM', title: 'Constitutional Law & Jurisprudence', location: 'Moot Court 1' },
        { id: '2', time: '11:30 AM', title: 'Law of Torts & Consumer Protection', location: 'Hall 301' },
        { id: '3', time: '02:30 PM', title: 'Legal Drafting & Courtroom Advocacy', location: 'Seminar Hall 2' },
      ];
    case 'VOCATIONAL':
      return [
        { id: '1', time: '08:30 AM', title: 'CNC Machine Operation & CAD/CAM', location: 'Tooling Hub' },
        { id: '2', time: '11:00 AM', title: 'Solar PV Installation & Wiring', location: 'Renewable Lab' },
        { id: '3', time: '02:00 PM', title: 'Industrial Automation & PLC Lab', location: 'Robotics Wing' },
      ];
    default:
      return [
        { id: '1', time: '08:30 AM', title: 'Mathematics (Calculus & Vectors)', location: 'Hall 102' },
        { id: '2', time: '10:45 AM', title: 'Core Stream Technical Lab', location: 'Lab Block 3' },
        { id: '3', time: '02:15 PM', title: 'Applied Sciences & Field Telemetry', location: 'Hall 104' },
      ];
  }
};

export default function DashboardPage() {
  const router = useRouter();
  const toast = useCyberToast();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'Home' | 'Events'>('Home');
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);

  // Profile data
  const [profile, setProfile] = useState({
    fullName: 'Nexora Student',
    sector: 'ENGINEERING',
    stream: 'MPC',
    sub_path: 'Intermediate MPC'
  });

  // Schedule & Tasks
  const [schedule, setSchedule] = useState<any[]>([]);
  const [tasks, setTasks] = useState([
    { id: 't1', text: 'Review Calculus formula sheet for weekly assessment', done: true },
    { id: 't2', text: 'Execute B.Tech lateral entry eligibility check in Colleges hub', done: false },
    { id: 't3', text: 'Upload 10th Marks Memo & Transfer Certificate to Vault', done: false },
    { id: 't4', text: 'Practice AI mock technical interview on mechatronics', done: false },
  ]);

  // Modals state
  const [resumeOpen, setResumeOpen] = useState(false);
  const [interviewOpen, setInterviewOpen] = useState(false);
  const [explainerOpen, setExplainerOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [plannerOpen, setPlannerOpen] = useState(false);

  // Interactive Hover Cards
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Load profile & initial telemetry
  useEffect(() => {
    // 1. Check local cache first for instant UI response
    const cachedProfile = localStorage.getItem('userProfile');
    const cachedSector = localStorage.getItem('activeSector');
    const cachedStream = localStorage.getItem('activeStream');
    const cachedSubPath = localStorage.getItem('activeSubPath');

    if (cachedProfile) {
      try {
        const parsed = JSON.parse(cachedProfile);
        setProfile(parsed);
        setSchedule(getScheduleForSector(parsed.sector));
      } catch (e) {}
    } else if (cachedSector) {
      setProfile({
        fullName: 'Nexora Student',
        sector: cachedSector,
        stream: cachedStream || 'MPC',
        sub_path: cachedSubPath || ''
      });
      setSchedule(getScheduleForSector(cachedSector));
    }

    // 2. Hydrate from Supabase session
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase
          .from('profiles')
          .select('*')
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

  // Resolve dynamic sector colors from SECTOR_TREES
  const sectorKey = Object.keys(SECTOR_TREES).find(
    (k) => SECTOR_TREES[k].id.toLowerCase() === profile.sector.toLowerCase()
  ) || 'engineering';

  const sectorConfig = SECTOR_TREES[sectorKey] || SECTOR_TREES['engineering'];
  const primaryColor = sectorConfig?.colorPalette?.primary || '#00F0FF';
  const secondaryColor = sectorConfig?.colorPalette?.secondary || '#3B82F6';
  const glowColor = sectorConfig?.colorPalette?.glowColor || 'rgba(0, 240, 255, 0.4)';
  const sectorBgImage = SECTOR_BACKGROUND_IMAGES[profile.sector.toUpperCase()] || SECTOR_BACKGROUND_IMAGES.ENGINEERING;

  // Dynamic slides tailored to current sector
  const slides = sectorConfig?.dashboard?.opportunities || [
    {
      id: 's1',
      title: 'JEE Main Phase 3 Portal Active',
      date: 'Aug 25, 2026',
      desc: 'Joint Entrance Examination portal is open for registration. Target elite NIT and IIT engineering blocks.',
      tag: 'CRITICAL',
      badgeColor: 'bg-red-500/10 text-red-500 border-red-500/30'
    },
    {
      id: 's2',
      title: 'National Polytechnic Skill Matrix',
      date: 'Sep 02, 2026',
      desc: 'Annual evaluation for 2nd and 3rd year diploma students. Top rankers receive industry sponsorships.',
      tag: 'DIPLOMA GATE',
      badgeColor: 'bg-cyber-cyan/15 text-cyber-cyan border-cyber-cyan/40'
    },
    {
      id: 's3',
      title: 'Nexora AI Placement Assessment',
      date: 'Rolling',
      desc: 'Benchmark your aptitude, coding, and verbal skills to generate a verified industry credential token.',
      tag: 'PLACEMENT',
      badgeColor: 'bg-cyber-emerald/15 text-cyber-emerald border-cyber-emerald/40'
    }
  ];

  // Auto-play carousel
  useEffect(() => {
    if (!slides || slides.length === 0 || isCarouselPaused) return;
    const timer = setInterval(() => {
      setActiveSlideIndex((prev) => (prev + 1) % Math.max(1, slides.length));
    }, 4500);
    return () => clearInterval(timer);
  }, [slides.length, isCarouselPaused]);

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, done: !t.done } : t));
  };

  const handleAddScheduleEvent = (newEvent: any) => {
    setSchedule((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        time: newEvent.time || '10:00 AM',
        title: newEvent.title,
        location: newEvent.type || 'Main Campus'
      }
    ]);
  };

  const studentFirstName = profile.fullName ? profile.fullName.split(' ')[0] : 'Nexora';

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div 
          className="w-12 h-12 rounded-2xl border-2 border-t-transparent animate-spin"
          style={{ borderColor: primaryColor, borderTopColor: 'transparent' }}
        ></div>
        <span 
          className="text-xs font-black uppercase tracking-widest"
          style={{ color: primaryColor }}
        >
          VERIFYING ACCESS AUTHORIZATION...
        </span>
      </div>
    );
  }

  // Active Tool mapping for Tool 1 and 2 based on SectorTrees metadata
  const customTool1 = sectorConfig.dashboard.tools[0] || { name: 'Resume AI', desc: 'Scan and benchmark your technical credentials against placement gates.' };
  const customTool2 = sectorConfig.dashboard.tools[1] || { name: 'Interview Prep', desc: 'Simulate technical engineering and behavioral interview questions with AI.' };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-32 space-y-8 relative">
      
      {/* SECTOR-SPECIFIC AMBIENT HIGH-TECH BACKGROUND OVERLAY */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-[0.07] dark:opacity-[0.09] transition-all duration-1000">
        <img 
          src={sectorBgImage} 
          alt="" 
          className="w-full h-full object-cover object-center filter saturate-150 blur-[1px] transform scale-105 transition-all duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background"></div>
      </div>

      {/* TOP WELCOME BAR & SLIDING CAPSULE SWITCHER */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Hi, {studentFirstName} 👋
            </h1>
            <span 
              className="px-2.5 py-0.5 rounded-full border text-[10px] font-black tracking-wider uppercase shadow-sm"
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

        {/* HOME / EVENTS PHYSICAL SLIDING CAPSULE TOGGLE */}
        <div className="relative inline-flex p-1 rounded-full bg-slate-900/90 dark:bg-slate-950/90 border border-slate-700/60 dark:border-white/10 shadow-lg backdrop-blur-xl self-start sm:self-auto overflow-hidden">
          {/* Physical Sliding Pill Background */}
          <div
            className="absolute top-1 bottom-1 rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-md"
            style={{
              width: 'calc(50% - 4px)',
              left: activeTab === 'Home' ? '4px' : 'calc(50%)',
              backgroundImage: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
              boxShadow: `0 4px 18px ${primaryColor}40`
            }}
          />

          <button
            onClick={() => setActiveTab('Home')}
            className={`relative z-10 w-24 sm:w-28 py-2 rounded-full text-xs tracking-wider transition-colors duration-200 text-center ${
              activeTab === 'Home'
                ? 'text-slate-950 font-black'
                : 'text-white/60 hover:text-white font-bold'
            }`}
          >
            HOME
          </button>
          <button
            onClick={() => setActiveTab('Events')}
            className={`relative z-10 w-24 sm:w-28 py-2 rounded-full text-xs tracking-wider transition-colors duration-200 text-center ${
              activeTab === 'Events'
                ? 'text-slate-950 font-black'
                : 'text-white/60 hover:text-white font-bold'
            }`}
          >
            EVENTS
          </button>
        </div>
      </div>

      {/* TAB CONTENT WITH SMOOTH ANIMATION */}
      {activeTab === 'Home' ? (
        <div key="home-tab" className="space-y-8 animate-tab-slide relative z-10">
          
          {/* HERO ROW: Left Slideshow Cards Track + Right Schedule */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Carousel Panel - Sliding Cards Track */}
            <div 
              className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between min-h-[290px] border border-white/[0.08] transition-all"
              style={{
                boxShadow: hoveredCard === 'slides' ? `0 0 30px ${primaryColor}15` : 'none',
                borderColor: hoveredCard === 'slides' ? `${primaryColor}30` : 'rgba(255,255,255,0.08)'
              }}
              onMouseEnter={() => {
                setHoveredCard('slides');
                setIsCarouselPaused(true);
              }}
              onMouseLeave={() => {
                setHoveredCard(null);
                setIsCarouselPaused(false);
              }}
            >
              {/* Ambient Glow */}
              <div 
                className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-all"
                style={{ backgroundColor: `${primaryColor}10` }}
              ></div>

              {/* Header inside carousel with left/right controls */}
              <div className="flex items-center justify-between gap-2 mb-2 relative z-10">
                <div className="flex items-center gap-2">
                  <Megaphone className="w-4 h-4 animate-bounce" style={{ color: secondaryColor }} />
                  <span className="text-[10px] font-black tracking-widest uppercase" style={{ color: secondaryColor }}>
                    GLOBAL ADMISSION NODE
                  </span>
                </div>

                {/* Left / Right Carousel Controls */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setActiveSlideIndex((prev) => (prev - 1 + slides.length) % slides.length)}
                    className="w-7 h-7 rounded-xl bg-slate-200/60 dark:bg-white/[0.06] border border-slate-300 dark:border-white/[0.1] hover:border-white/30 flex items-center justify-center text-slate-700 dark:text-white transition shadow-sm"
                    title="Previous Slide"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveSlideIndex((prev) => (prev + 1) % slides.length)}
                    className="w-7 h-7 rounded-xl bg-slate-200/60 dark:bg-white/[0.06] border border-slate-300 dark:border-white/[0.1] hover:border-white/30 flex items-center justify-center text-slate-700 dark:text-white transition shadow-sm"
                    title="Next Slide"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* SLIDING CARDS TRACK */}
              <div className="relative overflow-hidden w-full my-auto py-2 z-10">
                <div 
                  className="flex transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    transform: `translateX(-${activeSlideIndex * 100}%)`
                  }}
                >
                  {slides.map((slide, idx) => (
                    <div 
                      key={slide.id || idx} 
                      className="w-full shrink-0 pr-2 space-y-3"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase border shadow-sm ${slide.badgeColor || 'bg-cyber-cyan/15 text-cyber-cyan border-cyber-cyan/40'}`}>
                          {slide.tag || 'OPPORTUNITY'}
                        </span>
                        <div className="flex items-center gap-1 text-xs font-bold text-slate-500 dark:text-white/40">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Deadline: {slide.date}</span>
                        </div>
                      </div>

                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
                        {slide.title}
                      </h2>

                      <p className="text-xs sm:text-sm text-slate-600 dark:text-white/60 font-medium leading-relaxed max-w-xl">
                        {slide.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Slide indicators & link */}
              <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-200 dark:border-white/[0.08] relative z-10">
                <div className="flex items-center gap-2">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveSlideIndex(idx)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        idx === activeSlideIndex 
                          ? 'w-7 shadow-md' 
                          : 'w-2 bg-slate-300 dark:bg-white/20 hover:bg-white/40'
                      }`}
                      style={idx === activeSlideIndex ? { 
                        backgroundColor: primaryColor,
                        boxShadow: `0 0 10px ${primaryColor}80`
                      } : undefined}
                    />
                  ))}
                </div>

                <Link
                  href="/colleges"
                  className="text-xs font-black tracking-wider flex items-center gap-1 hover:underline"
                  style={{ color: primaryColor }}
                >
                  <span>Explore Admissions</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right: Daily Schedule Panel */}
            <div 
              className="lg:col-span-5 glass-panel rounded-3xl p-6 sm:p-7 relative overflow-hidden flex flex-col justify-between border border-white/[0.08]"
              style={{
                boxShadow: hoveredCard === 'sched' ? `0 0 30px ${secondaryColor}15` : 'none',
                borderColor: hoveredCard === 'sched' ? `${secondaryColor}30` : 'rgba(255,255,255,0.08)'
              }}
              onMouseEnter={() => setHoveredCard('sched')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-8 h-8 rounded-xl flex items-center justify-center border shadow-sm"
                      style={{
                        backgroundColor: `${primaryColor}15`,
                        borderColor: `${primaryColor}30`,
                        color: primaryColor
                      }}
                    >
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-wider">TODAY'S ROUTINE</h3>
                      <span className="text-[10px] font-bold text-slate-500 dark:text-white/40 block">
                        {profile.sector} TIMETABLE
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setPlannerOpen(true)}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border hover:bg-white/[0.04] transition"
                    style={{
                      borderColor: `${primaryColor}40`,
                      color: primaryColor
                    }}
                  >
                    + Add Class
                  </button>
                </div>

                {/* Schedule list */}
                <div className="space-y-2.5">
                  {schedule.map((item) => (
                    <div 
                      key={item.id}
                      className="p-3 rounded-2xl bg-slate-100/80 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.06] hover:border-white/20 transition flex items-center justify-between"
                    >
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-slate-900 dark:text-white block">{item.title}</span>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-white/40">
                          <span className="font-mono font-medium">{item.time}</span>
                          <span>•</span>
                          <span>{item.location}</span>
                        </div>
                      </div>
                      <span 
                        className="w-2 h-2 rounded-full animate-pulse"
                        style={{ backgroundColor: secondaryColor }}
                      ></span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Routine footer */}
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-white/[0.06] flex items-center justify-between text-[11px] font-medium text-slate-500 dark:text-white/50">
                <span>Semester Routine Status</span>
                <span className="font-bold" style={{ color: primaryColor }}>3 of 3 Completed</span>
              </div>
            </div>

          </div>

          {/* TELEMETRY METRIC STATS ROW */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {sectorConfig.dashboard.stats.map((stat, i) => (
              <div 
                key={i} 
                className="glass-card rounded-2xl p-4 border border-white/[0.06] flex items-center justify-between hover:border-white/20 transition group"
              >
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-500 dark:text-white/40 tracking-wider block mb-1">
                    {stat.label}
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {stat.value}
                  </span>
                </div>
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform border"
                  style={{
                    backgroundColor: `${primaryColor}15`,
                    borderColor: `${primaryColor}30`,
                    color: primaryColor
                  }}
                >
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
            ))}
          </div>

          {/* DAILY TASK & ROADMAP CHECKLIST */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/[0.08]">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div 
                  className="w-8 h-8 rounded-xl flex items-center justify-center border shadow-sm"
                  style={{
                    backgroundColor: `${secondaryColor}15`,
                    borderColor: `${secondaryColor}30`,
                    color: secondaryColor
                  }}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900 dark:text-white tracking-wide">
                    PLACEMENT READINESS CHECKLIST
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-white/40">
                    Complete tasks to boost your academic clearance rate
                  </span>
                </div>
              </div>

              <span 
                className="px-3 py-1 rounded-full text-xs font-black tracking-wider border shadow-sm"
                style={{
                  backgroundColor: `${primaryColor}15`,
                  borderColor: `${primaryColor}30`,
                  color: primaryColor
                }}
              >
                {tasks.filter(t => t.done).length} / {tasks.length} Completed
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                    task.done
                      ? 'bg-slate-100/60 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.04] opacity-75'
                      : 'bg-slate-100 dark:bg-white/[0.04] border-slate-200 dark:border-white/[0.08] hover:border-white/20'
                  }`}
                >
                  <button
                    className="w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition"
                    style={task.done ? {
                      backgroundColor: primaryColor,
                      borderColor: primaryColor,
                      color: '#030712'
                    } : {
                      borderColor: 'rgba(255,255,255,0.2)'
                    }}
                  >
                    {task.done && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3px]" />}
                  </button>
                  <span className={`text-xs font-bold leading-relaxed ${task.done ? 'line-through text-slate-400 dark:text-white/40' : 'text-slate-800 dark:text-white/90'}`}>
                    {task.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* INTERACTIVE SECTOR AI TOOLKITS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black tracking-widest uppercase" style={{ color: primaryColor }}>
                  {profile.sector} TOOLKITS
                </span>
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  Academic & Placement Accelerators
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* Tool 1: Dynamic Sector Tool 1 */}
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
                  className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border shadow-sm"
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
                  <span>Launch Scanner</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </button>

              {/* Tool 2: Dynamic Sector Tool 2 */}
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
                  className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border shadow-sm"
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
                  className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border shadow-sm"
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
                  Break down complex theorems, circuit logic, and formulas into step-by-step breakdowns.
                </p>
                <div 
                  className="mt-4 pt-3 border-t border-slate-200 dark:border-white/[0.06] flex items-center justify-between text-[11px] font-bold"
                  style={{ color: primaryColor }}
                >
                  <span>Explain Concept</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </button>

            </div>

            {/* Smart Lecture Notes Banner */}
            <button
              onClick={() => setNotesOpen(true)}
              className="w-full text-left glass-panel rounded-3xl p-5 sm:p-6 border border-white/[0.06] hover:border-white/20 transition-all flex items-center justify-between gap-4 group"
              style={{
                boxShadow: hoveredCard === 'notepad' ? `0 0 25px ${secondaryColor}15` : 'none',
                borderColor: hoveredCard === 'notepad' ? `${secondaryColor}30` : 'rgba(255,255,255,0.06)'
              }}
              onMouseEnter={() => setHoveredCard('notepad')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="flex items-center gap-4">
                <div 
                  className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border shadow-sm"
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
                className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border shadow-sm"
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
        /* EVENTS TIMELINE FEED WITH SMOOTH ANIMATION */
        <div key="events-tab" className="space-y-4 animate-tab-slide relative z-10">
          <div className="mb-2">
            <span className="text-[10px] font-black tracking-widest uppercase" style={{ color: primaryColor }}>LIVE RADAR</span>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Campus & Career Event Nodes</h2>
          </div>

          <div className="space-y-3.5">
            {INITIAL_EVENTS.map((evt) => (
              <div
                key={evt.id}
                className="glass-card rounded-3xl p-6 hover:border-white/30 transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  {/* Date Badge */}
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-surface border border-slate-200 dark:border-white/[0.1] flex flex-col items-center justify-center shrink-0 text-center shadow-sm">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-white/50 uppercase leading-none">
                      {evt.dateMon}
                    </span>
                    <span 
                      className="text-lg font-black leading-none mt-1"
                      style={{ color: primaryColor }}
                    >
                      {evt.dateNum}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-black text-slate-900 dark:text-white">{evt.title}</h3>
                      <span 
                        className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border"
                        style={{
                          backgroundColor: `${secondaryColor}15`,
                          borderColor: `${secondaryColor}30`,
                          color: secondaryColor
                        }}
                      >
                        {evt.category}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-white/50 font-medium max-w-xl">
                      {evt.description}
                    </p>

                    <div className="flex items-center gap-4 text-[11px] text-slate-500 dark:text-white/40 pt-1 font-medium">
                      <span className="font-bold" style={{ color: primaryColor }}>{evt.badge}</span>
                      <span>•</span>
                      <span>{evt.linkText}</span>
                    </div>
                  </div>
                </div>

                {/* Register Action */}
                <button
                  onClick={() => toast.success('Event Registration Confirmed!', `Access pass for ${evt.title} has been encrypted and synced with your Document Vault.`)}
                  className="cyber-button-primary px-5 py-2.5 rounded-xl text-xs font-black shrink-0 self-start sm:self-auto shadow-md"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
                    color: '#0A0E1A',
                    boxShadow: `0 4px 15px ${primaryColor}20`
                  }}
                >
                  REGISTER ACCESS
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GLOBAL FOOTER */}
      <footer className="pt-12 pb-6 border-t border-slate-200 dark:border-white/[0.08] text-center space-y-2">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-bold text-slate-500 dark:text-white/50">
          <span>Nexora Academic &amp; Career Command Hub</span>
          <span>&middot;</span>
          <span>Official Launch 2026</span>
          <span>&middot;</span>
          <span className="font-mono text-cyber-cyan">nexoraedu.co.in</span>
        </div>
        <p className="text-[10px] text-slate-400 dark:text-white/30 tracking-widest uppercase">
          Nexora Education Technologies &copy; 2026 &middot; All Rights Reserved
        </p>
      </footer>

      {/* MODAL DIALOGS */}
      <ResumeModal isOpen={resumeOpen} onClose={() => setResumeOpen(false)} />
      <InterviewModal isOpen={interviewOpen} onClose={() => setInterviewOpen(false)} />
      <ExplainerModal isOpen={explainerOpen} onClose={() => setExplainerOpen(false)} />
      <NotesModal isOpen={notesOpen} onClose={() => setNotesOpen(false)} />
      <PlannerModal isOpen={plannerOpen} onClose={() => setPlannerOpen(false)} onAdd={handleAddScheduleEvent} />

    </div>
  );
}
