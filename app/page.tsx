'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  Compass, 
  GraduationCap, 
  FolderLock, 
  ArrowRight, 
  CheckCircle2, 
  Cpu, 
  ShieldCheck,
  Zap,
  Layers
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { SECTORS } from '@/lib/data';

export default function LandingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace('/dashboard');
      } else {
        setLoading(false);
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
          INITIALIZING NEXUS GATEWAY...
        </span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-20 space-y-24">
      
      {/* HERO SECTION */}
      <section className="text-center space-y-8 max-w-4xl mx-auto relative">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-cyber-cyan/30 text-cyber-cyan text-xs font-black tracking-widest uppercase">
          <Sparkles className="w-4 h-4 text-cyber-cyan" />
          <span>ACADEMIC & CAREER COMMAND PLATFORM</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-tight">
          ARCHITECT YOUR{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-cyber-violet to-cyber-pink">
            CAREER TRAJECTORY
          </span>
        </h1>

        <p className="text-base sm:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed font-normal">
          Bridge the gap between foundational schooling (MPC, BiPC, Polytechnic Diplomas, ITI) and premier engineering university placements with AI precision.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/auth"
            className="w-full sm:w-auto cyber-button-primary px-8 py-4 rounded-2xl text-sm font-black flex items-center justify-center gap-2 group"
          >
            <span>ENTER COMMAND HUB</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link
            href="/sectors"
            className="w-full sm:w-auto cyber-button-secondary px-8 py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2"
          >
            <Compass className="w-4 h-4 text-cyber-cyan" />
            <span>EXPLORE 14 CAREER SECTORS</span>
          </Link>
        </div>

        {/* Feature Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-12 text-left">
          {[
            { title: 'Stream Mapping', sub: 'MPC, BiPC & Diploma', icon: Compass, color: 'text-cyber-cyan' },
            { title: 'College Matrix', sub: 'Direct Lateral Gateways', icon: GraduationCap, color: 'text-cyber-violet' },
            { title: 'S-Node AI', sub: 'Interactive Doubt Solver', icon: Zap, color: 'text-cyber-pink' },
            { title: 'Document Vault', sub: 'Token & Timetable Safe', icon: FolderLock, color: 'text-cyber-amber' },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="glass-card rounded-2xl p-4 border border-white/[0.06] flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shrink-0 ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">{item.title}</h4>
                  <p className="text-[10px] font-bold text-white/40">{item.sub}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 14 CAREER SECTORS SHOWCASE */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-black tracking-widest text-cyber-cyan uppercase">MULTI-DISCIPLINARY CORES</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
              Selectable Career Ecosystems
            </h2>
          </div>
          <Link href="/sectors" className="text-xs font-black text-cyber-cyan hover:underline flex items-center gap-1">
            <span>VIEW ALL ROADMAPS</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SECTORS.slice(0, 8).map((sector) => (
            <Link
              key={sector.id}
              href={`/sectors/${sector.id === 'ENGINEERING' ? 'engineering' : ''}`}
              className="glass-card glass-card-hover rounded-2xl p-5 border border-white/[0.06] block group relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black uppercase tracking-wider text-white/40 px-2.5 py-1 rounded-md bg-white/[0.04]">
                  {sector.category}
                </span>
                <span className="text-[10px] font-black text-cyber-cyan">
                  {sector.stats}
                </span>
              </div>
              <h3 className="font-black text-base text-white group-hover:text-cyber-cyan transition">
                {sector.name}
              </h3>
              <p className="text-xs text-white/50 mt-1.5 leading-relaxed">
                {sector.description}
              </p>
              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-bold text-white/40 group-hover:text-cyber-cyan transition">
                <span>View Decision Tree</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
