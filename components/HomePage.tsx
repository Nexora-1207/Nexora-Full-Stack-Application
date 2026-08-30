'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  Target,
  Compass,
  BookOpen,
  Rocket,
  ChevronRight,
  Cpu,
  HeartPulse,
  Terminal,
  Wrench,
  Anchor,
  Palette,
  TrendingUp,
  Radio,
  Coffee,
  Sprout,
  Car,
  Building2,
  Sparkles,
  Truck,
  CheckCircle2,
  Lightbulb,
  HelpCircle,
  Menu,
  X,
  LogIn
} from 'lucide-react';

const ICON_MAP: Record<string, any> = {
  Cpu, HeartPulse, Terminal, Wrench, Anchor,
  Palette, TrendingUp, Radio, Coffee, Sprout,
  Car, Building2, Sparkles, Truck
};

const TOP_DOMAINS = [
  { id: 'ENGINEERING',    name: 'Engineering & Tech',       category: 'STEM Core',   icon: 'Cpu',       color: '#00F0FF', description: 'B.Tech, Robotics, AI Systems, Polytechnic Diplomas & Smart Engineering.' },
  { id: 'MEDICAL',        name: 'Medical & Healthcare',     category: 'Healthcare',  icon: 'HeartPulse',color: '#EC4899', description: 'MBBS, BDS, DMLT, Nursing, Pharmacy & Bio-Research careers.' },
  { id: 'COMPUTERS',      name: 'Computer Science',         category: 'Software',    icon: 'Terminal',  color: '#10B981', description: 'Software Development, Cloud, AI/ML, Cyber Security & Web Architecture.' },
  { id: 'MERCHANT-NAVY',  name: 'Merchant Navy',            category: 'Maritime',    icon: 'Anchor',    color: '#06B6D4', description: 'Nautical Science, Marine Engineering & Global Commercial Shipping.' },
  { id: 'BUSINESS',       name: 'Business & FinTech',       category: 'Commerce',    icon: 'TrendingUp',color: '#EAB308', description: 'CA, BBA, MBA, Chartered Accountancy & Corporate Finance careers.' },
  { id: 'AGRICULTURE',    name: 'Agriculture & Agri-Tech',  category: 'Bio-Systems', icon: 'Sprout',    color: '#22C55E', description: 'B.Sc Agriculture, Drone Farming, Hydroponics & Agricultural Research.' },
];

const CAPABILITIES = [
  { icon: Target,   title: 'Discover',     desc: 'Explore career domains, courses and possible futures.',                          color: '#00F0FF' },
  { icon: Compass,  title: 'Decide',       desc: 'Understand different education routes and choose the path that fits you.',       color: '#A855F7' },
  { icon: BookOpen, title: 'Explore',      desc: 'Compare courses, colleges and opportunities side by side.',                      color: '#10B981' },
  { icon: Rocket,   title: 'Take Action',  desc: 'Move from understanding your options to your next practical step.',              color: '#F59E0B' },
];

const JOURNEY_STEPS = [
  { num: '01', label: 'Discover', desc: 'Find career domains and understand different fields and what they actually involve.',                    color: '#00F0FF' },
  { num: '02', label: 'Decide',   desc: 'See possible academic routes — Intermediate, Polytechnic, ITI — and identify what suits you.',         color: '#A855F7' },
  { num: '03', label: 'Explore',  desc: 'Explore courses, branches, colleges and career opportunities within your chosen field.',                color: '#10B981' },
  { num: '04', label: 'Act',      desc: 'Take the next concrete step toward your education and career with confidence.',                         color: '#F59E0B' },
];

const WHY_NEXORA = [
  'Built specifically for students making education decisions after 10th & 12th',
  'Clear, simple explanations of every academic route — MPC, BiPC, Polytechnic, ITI, Commerce',
  '14 career domains covering every major field a student can enter',
  'Compare colleges, cut-offs, and course options in one place',
  'Honest, straightforward guidance — no jargon, no confusion',
  'AI career advisor available to answer your questions anytime',
];

export default function HomePage() {
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen]   = useState(false);
  const [scrolled, setScrolled]             = useState(false);
  const [hoveredDomain, setHoveredDomain]   = useState<string | null>(null);
  const [exiting, setExiting]               = useState(false);   // fade-out before navigate

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /** Smooth fade-out → navigate to /auth */
  const goToAuth = useCallback((e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (exiting) return;
    setExiting(true);
    setTimeout(() => router.push('/auth'), 450);
  }, [exiting, router]);

  return (
    <div
      className={`nexora-landing-visible min-h-screen bg-[#030712] text-white overflow-x-hidden transition-all duration-500 ease-in-out ${exiting ? 'opacity-0 scale-[0.98] blur-sm' : 'opacity-100 scale-100 blur-0'}`}
    >

      {/* ─── STICKY NAV ─── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#030712]/95 backdrop-blur-xl border-b border-white/[0.06] shadow-xl' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo — clicking logo also goes to /auth */}
            <button onClick={goToAuth} className="flex items-center gap-2 cursor-pointer">
              <span className="text-2xl font-black tracking-[0.15em] bg-gradient-to-r from-[#00F0FF] to-[#A855F7] bg-clip-text text-transparent">NEXORA</span>
            </button>

            {/* Desktop nav links — all gate through /auth */}
            <div className="hidden md:flex items-center gap-8">
              <button onClick={goToAuth} className="text-sm font-semibold text-white/60 hover:text-white transition">Career Domains</button>
              <button onClick={goToAuth} className="text-sm font-semibold text-white/60 hover:text-white transition">Colleges</button>
              <button onClick={goToAuth} className="text-sm font-semibold text-white/60 hover:text-white transition">AI Advisor</button>
            </div>

            {/* Desktop CTAs */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={goToAuth}
                className="text-sm font-bold text-white/70 hover:text-white transition px-4 py-2 rounded-xl hover:bg-white/[0.06] flex items-center gap-1.5"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </button>
              <button
                onClick={goToAuth}
                className="text-sm font-bold px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#A855F7] text-[#030712] shadow-lg hover:opacity-90 transition-opacity"
              >
                Get Started
              </button>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="md:hidden w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.1] flex items-center justify-center text-white"
            >
              {mobileNavOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile nav drawer */}
        {mobileNavOpen && (
          <div className="md:hidden border-t border-white/[0.06] bg-[#030712]/98 backdrop-blur-xl px-4 py-4 space-y-3">
            <button onClick={goToAuth} className="block w-full text-left text-sm font-semibold text-white/70 hover:text-white py-2 transition">Career Domains</button>
            <button onClick={goToAuth} className="block w-full text-left text-sm font-semibold text-white/70 hover:text-white py-2 transition">Colleges</button>
            <button onClick={goToAuth} className="block w-full text-left text-sm font-semibold text-white/70 hover:text-white py-2 transition">AI Advisor</button>
            <div className="pt-3 border-t border-white/[0.06] flex flex-col gap-2">
              <button onClick={goToAuth} className="text-center text-sm font-bold text-white/70 py-2.5 px-4 rounded-xl border border-white/[0.12] hover:bg-white/[0.06] transition">Sign In</button>
              <button onClick={goToAuth} className="text-center text-sm font-bold py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#A855F7] text-[#030712]">Get Started</button>
            </div>
          </div>
        )}
      </nav>

      {/* ─── HERO SECTION ─── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 pt-20 pb-16 overflow-hidden">

        {/* Background ambient orbs */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-[#00F0FF]/[0.04] blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-[#A855F7]/[0.06] blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-[#3B82F6]/[0.03] blur-3xl pointer-events-none" />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage: 'linear-gradient(rgba(0,240,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00F0FF]/30 bg-[#00F0FF]/[0.07] mb-8">
            <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse shadow-[0_0_8px_#00F0FF]" />
            <span className="text-xs font-bold text-[#00F0FF] tracking-wider uppercase">Education & Career Guidance Platform</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-6">
            Build Your Future.{' '}
            <span className="bg-gradient-to-r from-[#00F0FF] via-[#A855F7] to-[#3B82F6] bg-clip-text text-transparent block sm:inline">
              The Right Way.
            </span>
          </h1>

          {/* Supporting text */}
          <p className="text-base sm:text-lg md:text-xl text-white/60 font-medium max-w-2xl mx-auto leading-relaxed mb-4">
            NEXORA helps students discover the right courses, career paths, colleges, and next steps — all in one place.
          </p>
          <p className="text-sm sm:text-base text-white/40 font-medium max-w-xl mx-auto mb-10">
            Built for students exploring options after 10th and 12th class. No confusion. No jargon. Just clear guidance.
          </p>

          {/* Primary CTAs → both go to /auth */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={goToAuth}
              id="hero-explore-cta"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-gradient-to-r from-[#00F0FF] to-[#A855F7] text-[#030712] font-black text-base shadow-[0_0_40px_rgba(0,240,255,0.2)] hover:shadow-[0_0_60px_rgba(0,240,255,0.35)] transition-all duration-300 hover:scale-[1.02]"
            >
              <Compass className="w-5 h-5" />
              Explore Career Paths
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={goToAuth}
              id="hero-quiz-cta"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl border border-white/20 bg-white/[0.04] text-white font-bold text-base hover:bg-white/[0.08] hover:border-white/30 transition-all duration-300"
            >
              <HelpCircle className="w-5 h-5 text-[#A855F7]" />
              Take Career Quiz
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Scroll nudge */}
          <div className="mt-16 flex flex-col items-center gap-2 text-white/25">
            <span className="text-xs font-medium">See what NEXORA helps you do</span>
            <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
          </div>
        </div>
      </section>

      {/* ─── CAPABILITY STRIP ─── */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-16 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-12">
            <p className="text-[#00F0FF] text-xs font-black tracking-widest uppercase mb-3">What NEXORA Does</p>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Everything a student needs, in one place.</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CAPABILITIES.map((cap, i) => {
              const Icon = cap.icon;
              return (
                <div
                  key={i}
                  className="group relative rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.12] p-6 transition-all duration-300 cursor-default"
                >
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: `radial-gradient(ellipse at top left, ${cap.color}08 0%, transparent 70%)` }} />
                  <div
                    className="relative w-11 h-11 rounded-xl flex items-center justify-center mb-4 border transition-all duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${cap.color}15`, borderColor: `${cap.color}30`, color: cap.color }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="relative font-black text-lg text-white mb-2">{cap.title}</h3>
                  <p className="relative text-sm text-white/50 font-medium leading-relaxed">{cap.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── STUDENT JOURNEY ─── */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#0a0d1a] to-[#030712] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#A855F7] text-xs font-black tracking-widest uppercase mb-3">The NEXORA Journey</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-4">
              One connected experience.<br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-[#00F0FF] to-[#A855F7] bg-clip-text text-transparent">From lost to certain.</span>
            </h2>
            <p className="text-sm text-white/40 font-medium max-w-lg mx-auto">
              Four clear stages that take a student from uncertainty to confident action.
            </p>
          </div>

          {/* Connecting line (desktop) */}
          <div className="relative">
            <div className="hidden lg:block absolute top-[52px] left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-[#00F0FF]/30 via-[#A855F7]/30 to-[#F59E0B]/30" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
              {JOURNEY_STEPS.map((step, i) => (
                <div key={i} className="relative flex flex-col items-center text-center">
                  <div
                    className="relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center mb-5 border-2 font-black text-xl shadow-lg"
                    style={{ backgroundColor: `${step.color}12`, borderColor: `${step.color}50`, color: step.color, boxShadow: `0 0 30px ${step.color}20` }}
                  >
                    {step.num}
                  </div>
                  {i < 3 && (
                    <div className="sm:hidden absolute left-1/2 -translate-x-1/2 -bottom-6 text-white/20">
                      <ChevronRight className="w-5 h-5 rotate-90" />
                    </div>
                  )}
                  <h3 className="font-black text-lg mb-2" style={{ color: step.color }}>{step.label}</h3>
                  <p className="text-sm text-white/50 font-medium leading-relaxed max-w-[220px] mx-auto">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA → /auth */}
          <div className="flex justify-center mt-14">
            <button
              onClick={goToAuth}
              id="journey-start-cta"
              className="group inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-gradient-to-r from-[#00F0FF] to-[#A855F7] text-[#030712] font-black text-sm shadow-[0_0_40px_rgba(0,240,255,0.15)] hover:shadow-[0_0_60px_rgba(0,240,255,0.3)] transition-all hover:scale-[1.02]"
            >
              Start Your Journey
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* ─── NOT SURE? CAREER QUIZ ─── */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden border border-[#A855F7]/30 bg-gradient-to-br from-[#A855F7]/10 via-[#3B82F6]/[0.06] to-[#00F0FF]/[0.05] p-8 sm:p-12">
            <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-[#A855F7]/[0.12] blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-[#00F0FF]/[0.08] blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#A855F7]/20 border border-[#A855F7]/40 flex items-center justify-center mb-6">
                <HelpCircle className="w-7 h-7 text-[#A855F7]" />
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
                Not sure what to choose?
              </h2>
              <p className="text-base sm:text-lg text-white/55 font-medium max-w-xl leading-relaxed mb-8">
                Many students don't know what career they want — and that's completely okay.
                Sign in to NEXORA and answer a few simple questions to explore career paths that fit your interests, strengths and goals.
              </p>
              <button
                onClick={goToAuth}
                id="career-quiz-section-cta"
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl border-2 border-[#A855F7] bg-[#A855F7]/15 text-white font-black text-base hover:bg-[#A855F7]/25 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all duration-300"
              >
                <Lightbulb className="w-5 h-5 text-[#A855F7]" />
                Take the Career Quiz
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CAREER DOMAINS PREVIEW ─── */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20 border-t border-white/[0.05]">
        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-12">
            <p className="text-[#10B981] text-xs font-black tracking-widest uppercase mb-3">Career Domains</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-4">Explore Career Domains</h2>
            <p className="text-sm sm:text-base text-white/45 font-medium max-w-2xl mx-auto leading-relaxed">
              Choose a field you're interested in. Sign in to NEXORA to explore the courses, education routes, careers and opportunities within it.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {TOP_DOMAINS.map((domain) => {
              const Icon = ICON_MAP[domain.icon] || Sparkles;
              const isHovered = hoveredDomain === domain.id;
              return (
                <button
                  key={domain.id}
                  onClick={goToAuth}
                  id={`domain-${domain.id.toLowerCase()}`}
                  className="group relative rounded-2xl border bg-white/[0.02] hover:bg-white/[0.05] p-6 transition-all duration-300 overflow-hidden text-left cursor-pointer"
                  style={{
                    borderColor: isHovered ? `${domain.color}40` : 'rgba(255,255,255,0.07)',
                    boxShadow: isHovered ? `0 0 30px ${domain.color}10` : 'none',
                  }}
                  onMouseEnter={() => setHoveredDomain(domain.id)}
                  onMouseLeave={() => setHoveredDomain(null)}
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                    style={{ background: `radial-gradient(ellipse at top left, ${domain.color}06 0%, transparent 70%)` }}
                  />
                  <div className="relative flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border group-hover:scale-110 transition-transform duration-300"
                      style={{ backgroundColor: `${domain.color}15`, borderColor: `${domain.color}30`, color: domain.color }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="font-black text-base text-white truncate">{domain.name}</h3>
                        <ChevronRight className="w-4 h-4 shrink-0 text-white/30 group-hover:translate-x-1 transition-transform" style={{ color: isHovered ? domain.color : undefined }} />
                      </div>
                      <span
                        className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border mb-2 inline-block"
                        style={{ color: domain.color, borderColor: `${domain.color}30`, backgroundColor: `${domain.color}12` }}
                      >
                        {domain.category}
                      </span>
                      <p className="text-xs text-white/45 font-medium leading-relaxed">{domain.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* View All → /auth */}
          <div className="flex justify-center">
            <button
              onClick={goToAuth}
              id="view-all-domains-cta"
              className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-white/15 bg-white/[0.03] text-white/70 font-bold text-sm hover:bg-white/[0.07] hover:text-white hover:border-white/25 transition-all"
            >
              <Compass className="w-4 h-4" />
              Not Sure? Explore All Career Domains
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* ─── WHY NEXORA ─── */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20 border-t border-white/[0.05]">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            <div>
              <p className="text-[#00F0FF] text-xs font-black tracking-widest uppercase mb-4">Why NEXORA?</p>
              <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-6">
                Guidance designed for students.{' '}
                <span className="bg-gradient-to-r from-[#00F0FF] to-[#A855F7] bg-clip-text text-transparent">
                  Not for everyone else.
                </span>
              </h2>
              <p className="text-sm sm:text-base text-white/45 font-medium leading-relaxed mb-8">
                Most students feel overwhelmed when choosing courses and colleges after 10th or 12th. NEXORA cuts through the noise and gives you clear, honest, structured guidance.
              </p>
              <button
                onClick={goToAuth}
                id="why-nexora-cta"
                className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#A855F7] text-[#030712] font-black text-sm hover:opacity-90 transition-all shadow-[0_0_30px_rgba(0,240,255,0.15)]"
              >
                Get Started — It's Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="space-y-4">
              {WHY_NEXORA.map((point, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-[#10B981]/20 border border-[#10B981]/40 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                  </div>
                  <p className="text-sm text-white/70 font-medium leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── BOTTOM CTA BANNER ─── */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20 border-t border-white/[0.05] overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] rounded-full bg-[#A855F7]/[0.06] blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 w-[400px] h-[200px] rounded-full bg-[#00F0FF]/[0.04] blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto text-center">
          <p className="text-xs font-black tracking-widest uppercase text-[#A855F7] mb-4">Ready to start?</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
            Your education journey<br />starts here.
          </h2>
          <p className="text-base sm:text-lg text-white/45 font-medium mb-10 max-w-xl mx-auto">
            Join students across India who use NEXORA to discover their right career path, understand their options, and take the next step.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={goToAuth}
              id="final-explore-cta"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#00F0FF] to-[#A855F7] text-[#030712] font-black text-base shadow-[0_0_50px_rgba(0,240,255,0.2)] hover:shadow-[0_0_70px_rgba(0,240,255,0.4)] hover:scale-[1.02] transition-all"
            >
              <Compass className="w-5 h-5" />
              Explore Career Paths
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={goToAuth}
              id="final-signin-cta"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border border-white/20 bg-white/[0.03] text-white font-bold text-base hover:bg-white/[0.07] hover:border-white/30 transition-all"
            >
              <LogIn className="w-5 h-5" />
              Sign In to Your Account
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-white/[0.06] px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <button onClick={goToAuth} className="flex items-center gap-3 group">
            <span className="text-xl font-black tracking-[0.15em] bg-gradient-to-r from-[#00F0FF] to-[#A855F7] bg-clip-text text-transparent">NEXORA</span>
            <span className="text-white/20 text-sm">•</span>
            <span className="text-white/30 text-xs font-medium group-hover:text-white/50 transition">nexoraedu.co.in</span>
          </button>
          <div className="flex items-center gap-6">
            <button onClick={goToAuth} className="text-xs text-white/40 hover:text-white/70 font-medium transition">Careers</button>
            <button onClick={goToAuth} className="text-xs text-white/40 hover:text-white/70 font-medium transition">Colleges</button>
            <button onClick={goToAuth} className="text-xs text-white/40 hover:text-white/70 font-medium transition">AI Advisor</button>
            <button onClick={goToAuth} className="text-xs text-white/40 hover:text-white/70 font-medium transition">Login</button>
          </div>
          <p className="text-xs text-white/25 font-medium">© 2026 Nexora Education Technologies</p>
        </div>
      </footer>

    </div>
  );
}
