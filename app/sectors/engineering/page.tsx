'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ChevronLeft, 
  ArrowRight, 
  CheckCircle2, 
  Cpu, 
  Compass, 
  BookOpen, 
  Wrench, 
  Layers, 
  Award,
  Sparkles,
  Info
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import confetti from 'canvas-confetti';

interface DecisionNode {
  question: string;
  subtitle: string;
  type?: 'options' | 'info';
  text?: string;
  next?: string;
  options?: {
    id: string;
    label: string;
    sub: string;
    brief: string;
    next: string;
  }[];
}

const CAREER_TREE: Record<string, DecisionNode> = {
  root: {
    question: "ACADEMIC FOUNDATION",
    subtitle: "Select your secondary entry level",
    options: [
      { id: 'inter', label: "INTERMEDIATE (10+2)", sub: "Academic Science / Arts Streams", next: 'inter_streams', brief: "The traditional academic route leading directly to Engineering, Medical, and pure science degrees." },
      { id: 'diploma', label: "POLYTECHNIC DIPLOMA", sub: "3-Year Technical Engineering", next: 'diploma_sector', brief: "A 3-year technical mastery program allowing direct 2nd-year Lateral Entry into B.Tech or immediate industry roles." },
      { id: 'iti', label: "ITI VOCATIONAL TRADES", sub: "Hands-on Industrial Skills", next: 'iti_sector', brief: "Intensive vocational craftsmanship designed for precision tooling, wiring, and manufacturing lines." }
    ]
  },
  inter_streams: {
    question: "STREAM SELECTION",
    subtitle: "Define your core domain specialization",
    options: [
      { id: 'science', label: "SCIENCE STREAM", sub: "Technical, Math & Bio-Research", next: 'science_path', brief: "The bedrock for Engineering (MPC) and Medical sciences (BiPC). High research and innovation potential." },
      { id: 'commerce', label: "COMMERCE STREAM", sub: "Finance, Audit & Global Trade", next: 'commerce_note', brief: "Gateway to FinTech, Corporate Law, and Chartered Accountancy." },
      { id: 'arts', label: "ARTS & HUMANITIES", sub: "Social Policy, Media & Judiciary", next: 'arts_note', brief: "Ideal for Public Policy, Journalism, and Civil Services." }
    ]
  },
  commerce_note: {
    type: 'info',
    question: "COMMERCE & FINTECH INTEL",
    subtitle: "Financial Architecture Directive",
    text: "Commerce is the heartbeat of international enterprise. By choosing this domain, you master algorithmic high-frequency finance, venture development, corporate audit, and global supply chain logistics.",
    next: 'commerce_path'
  },
  commerce_path: {
    question: "COMMERCE SPECIALIZATION",
    subtitle: "Select your financial minor",
    options: [
      { id: 'mec', label: "MEC (Math, Econ, Commerce)", sub: "Integrates Numerical Calculus", next: 'success', brief: "Combines advanced mathematics with finance, opening doors to quantitative trading." },
      { id: 'cec', label: "CEC (Civics, Econ, Commerce)", sub: "Corporate Governance & Trade", next: 'success', brief: "The classic business and legal foundation." }
    ]
  },
  arts_note: {
    type: 'info',
    question: "HUMANITIES & PUBLIC POLICY",
    subtitle: "Social Systems Directive",
    text: "Arts and Humanities allow you to explore governance, judiciary frameworks, and public communication. It is the cornerstone of critical policy development.",
    next: 'arts_path'
  },
  arts_path: {
    question: "HUMANITIES SPECIALIZATION",
    subtitle: "Select your creative focus",
    options: [
      { id: 'hec', label: "HEC (History, Econ, Civics)", sub: "Civil Services & Judiciary", next: 'success', brief: "Ideal for aspiring Civil Servants and legal policy analysts." },
      { id: 'arts_pure', label: "PURE HUMANITIES", sub: "Literature & Social Media", next: 'success', brief: "Focus on social sciences and digital media." }
    ]
  },
  science_path: {
    question: "SCIENCE CORE SPECIALIZATION",
    subtitle: "Select your academic focus",
    options: [
      { id: 'mpc', label: "INTERMEDIATE MPC", sub: "Math, Physics, Chemistry", next: 'success', brief: "Mandatory foundation for Bachelor of Engineering (B.Tech / B.E.), Aerospace, and AI Architecture." },
      { id: 'mbipc', label: "INTERMEDIATE BiPC", sub: "Biology, Physics, Chemistry", next: 'success', brief: "Pre-Medical gateway for Biotechnology, Clinical Research, and Robotic Surgical Diagnostics." }
    ]
  },
  diploma_sector: {
    question: "POLYTECHNIC DIPLOMA BRANCH",
    subtitle: "Select your technical diploma program",
    options: [
      { id: 'comp_eng', label: "COMPUTER ENGINEERING", sub: "Software, Networks & AI", next: 'success', brief: "Master low-level kernels, full-stack web, and hardware integration. Feeds into 2nd-year B.Tech CSE." },
      { id: 'mech_eng', label: "MECHANICAL ENGINEERING", sub: "Robotics & Thermodynamics", next: 'success', brief: "Design automated manufacturing assemblies, EV powertrains, and precision machinery." },
      { id: 'civil_eng', label: "CIVIL ENGINEERING", sub: "Structural & Smart Infrastructure", next: 'success', brief: "Master smart megastructure modeling, BIM design, and environmental engineering." },
      { id: 'elec_eng', label: "ELECTRICAL ENGINEERING", sub: "Smart Power Grids & Solar", next: 'success', brief: "Focus on high-voltage transmission, renewable energy grids, and EV chargers." },
      { id: 'ece_eng', label: "ECE (ELECTRONICS & TELECOM)", sub: "Microchips & IoT Transmitters", next: 'success', brief: "Explore semiconductor chips, RF communications, and satellite antennas." }
    ]
  },
  iti_sector: {
    question: "ITI VOCATIONAL CRAFT",
    subtitle: "Select your industrial trade specialization",
    options: [
      { id: 'elec_iti', label: "ELECTRICIAN (ITI)", sub: "Industrial Power & Smart Wiring", next: 'success', brief: "Focus on commercial electrical systems, automation panels, and domestic wiring." },
      { id: 'fitter_iti', label: "FITTER (ITI)", sub: "Precision Machine Assembly", next: 'success', brief: "Assembly of engineering components and turbine fittings in aerospace and automotive plants." },
      { id: 'turner_iti', label: "TURNER & MACHINIST (ITI)", sub: "CNC Lathe Tooling", next: 'success', brief: "Operate computer-controlled machine tooling with micron-level tolerance." },
      { id: 'copa_iti', label: "COPA (ITI)", sub: "Computer Programming Assistant", next: 'success', brief: "Database entry, office networking, and basic hardware diagnostics." }
    ]
  },
  success: {
    question: "MISSION STATUS: SYNCHRONIZED",
    subtitle: "Pathway parameters permanently recorded",
    options: []
  }
};

export default function EngineeringDecisionTreePage() {
  const router = useRouter();
  const [currentNodeKey, setCurrentNodeKey] = useState('root');
  const [history, setHistory] = useState<string[]>([]);
  const [selectedStream, setSelectedStream] = useState<string>('MPC');
  const [selectedSubPath, setSelectedSubPath] = useState<string>('MPC');
  const [syncing, setSyncing] = useState(false);

  const node = CAREER_TREE[currentNodeKey] || CAREER_TREE.root;

  const handleSelectOption = async (nextKey: string, optionId?: string, optionLabel?: string) => {
    let updatedStream = selectedStream;
    let updatedSubPath = selectedSubPath;

    if (optionId === 'mpc') {
      updatedStream = 'MPC';
      updatedSubPath = 'Intermediate MPC';
    } else if (optionId === 'mbipc') {
      updatedStream = 'BiPC';
      updatedSubPath = 'Intermediate BiPC';
    } else if (currentNodeKey === 'diploma_sector') {
      updatedStream = 'Polytechnic';
      updatedSubPath = optionLabel || 'Polytechnic Diploma';
    } else if (currentNodeKey === 'iti_sector') {
      updatedStream = 'ITI';
      updatedSubPath = optionLabel || 'ITI Vocational Trade';
    }

    setSelectedStream(updatedStream);
    setSelectedSubPath(updatedSubPath);

    if (nextKey === 'success') {
      setCurrentNodeKey('success');
      setSyncing(true);

      // Trigger celebratory confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00F0FF', '#A855F7', '#FF008A', '#10B981']
      });

      // Save to local storage
      localStorage.setItem('activeSector', 'ENGINEERING');
      localStorage.setItem('activeStream', updatedStream);
      localStorage.setItem('activeSubPath', updatedSubPath);

      // Save to Supabase
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('profiles').upsert({
            id: user.id,
            sector: 'ENGINEERING',
            stream: updatedStream,
            sub_path: updatedSubPath,
            updated_at: new Date()
          });
        }
      } catch (e) {
        console.error(e);
      }

      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
      return;
    }

    setHistory([...history, currentNodeKey]);
    setCurrentNodeKey(nextKey);
  };

  const handleGoBack = () => {
    if (history.length > 0) {
      const newHistory = [...history];
      const prevKey = newHistory.pop();
      setHistory(newHistory);
      setCurrentNodeKey(prevKey || 'root');
    } else {
      router.push('/sectors');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-16 space-y-8">
      
      {/* Back and Progress Track */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={handleGoBack}
          disabled={syncing}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-xs font-bold text-white transition"
        >
          <ChevronLeft className="w-4 h-4 text-cyber-cyan" />
          <span>{history.length > 0 ? 'Previous Level' : 'Exit to Sectors'}</span>
        </button>

        {/* Progress Bar */}
        <div className="flex-1 max-w-xs h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-violet transition-all duration-500 shadow-[0_0_10px_#00F0FF]"
            style={{ width: `${Math.min(100, (history.length + 1) * 33)}%` }}
          ></div>
        </div>

        <span className="text-[10px] font-black uppercase text-cyber-cyan tracking-widest hidden sm:inline">
          PATH RESOLVER
        </span>
      </div>

      {/* Decision Card Container */}
      <div className="glass-panel rounded-3xl border border-white/[0.12] p-6 sm:p-10 shadow-[0_0_50px_rgba(0,240,255,0.1)] relative overflow-hidden">
        
        {/* Glowing Halo in Card Corner */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-cyber-cyan/15 rounded-full blur-3xl pointer-events-none"></div>

        {/* Title / Question */}
        <div className="text-center space-y-2 mb-8">
          <span className="inline-block text-[11px] font-black uppercase tracking-widest text-cyber-cyan px-3 py-1 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30">
            {node.subtitle}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {node.question}
          </h2>
        </div>

        {/* Info Slide State */}
        {node.type === 'info' ? (
          <div className="space-y-6 max-w-xl mx-auto">
            <div className="glass-card rounded-2xl p-6 border border-white/[0.08] space-y-3">
              <div className="flex items-center gap-2 text-xs font-black text-cyber-amber uppercase">
                <Info className="w-4 h-4" />
                <span>DOMAIN MANUAL</span>
              </div>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-medium">
                {node.text}
              </p>
            </div>

            <button
              onClick={() => handleSelectOption(node.next || 'success')}
              className="w-full cyber-button-primary py-4 rounded-xl text-xs font-black flex items-center justify-center gap-2"
            >
              <span>PROCEED TO SPECIALIZATION</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : currentNodeKey === 'success' ? (
          /* Success Synced Confirmation */
          <div className="py-8 text-center space-y-6 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-cyber-emerald/20 border border-cyber-emerald/40 text-cyber-emerald flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.4)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-black text-white">PATHWAY SYNCHRONIZED</h3>
              <p className="text-xs text-white/60">
                Registered: <span className="font-bold text-cyber-cyan">{selectedStream}</span> ({selectedSubPath})
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[11px] font-bold text-white/70">
              Launching your personalized student dashboard...
            </div>
          </div>
        ) : (
          /* Options List Grid */
          <div className="grid grid-cols-1 gap-3.5 max-w-2xl mx-auto">
            {node.options?.map((option) => (
              <button
                key={option.id}
                onClick={() => handleSelectOption(option.next, option.id, option.label)}
                className="text-left glass-card glass-card-hover rounded-2xl p-5 border border-white/[0.08] hover:border-cyber-cyan/40 block group transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] group-hover:bg-cyber-cyan group-hover:text-background flex items-center justify-center text-cyber-cyan transition">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-white group-hover:text-cyber-cyan transition">
                        {option.label}
                      </h4>
                      <p className="text-[11px] font-bold text-white/40">{option.sub}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-cyber-cyan group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="mt-3 pt-2.5 border-t border-white/[0.04] text-xs text-white/50 leading-relaxed">
                  {option.brief}
                </p>
              </button>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}
