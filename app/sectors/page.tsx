'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Compass, 
  ArrowRight, 
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
  CheckCircle2
} from 'lucide-react';
import { SECTORS } from '@/lib/data';
import { supabase } from '@/lib/supabase';

const ICON_MAP: Record<string, any> = {
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
  Truck
};

export default function SectorsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    // Check cache on client mount
    const cached = localStorage.getItem('userProfile') || localStorage.getItem('activeSector');
    if (cached) {
      setLoading(false);
    }

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
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

  const handleSelectSector = async (sectorId: string) => {
    setSelectedSector(sectorId);
    setSyncing(true);

    try {
      localStorage.setItem('activeSector', sectorId);

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('profiles').upsert({
          id: user.id,
          sector: sectorId,
          updated_at: new Date()
        });
      }

      setTimeout(() => {
        const routeId = sectorId.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
        router.push(`/sectors/${routeId}`);
      }, 500);
    } catch (e) {
      console.error(e);
      router.push('/dashboard');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-12 space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan text-xs font-black tracking-widest uppercase">
          <Compass className="w-4 h-4" />
          <span>ONBOARDING CLEARANCE MATRIX</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          SELECT CAREER DOMAIN
        </h1>
        <p className="text-xs sm:text-sm text-white/50 leading-relaxed font-medium">
          Choose your active academic sector. Selecting Engineering opens our deep branch mapper (MPC, BiPC, Polytechnic & ITI).
        </p>
      </div>

      {/* Grid of 14 Pods */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {SECTORS.map((sector) => {
          const Icon = ICON_MAP[sector.icon] || Compass;
          const isSelected = selectedSector === sector.id;

          return (
            <button
              key={sector.id}
              onClick={() => handleSelectSector(sector.id)}
              disabled={syncing}
              className={`text-left rounded-3xl p-6 border transition-all duration-300 relative group overflow-hidden ${
                isSelected
                  ? 'bg-surface border-cyber-cyan shadow-[0_0_40px_rgba(0,240,255,0.4)] scale-105'
                  : 'glass-card border-white/[0.08] hover:border-white/[0.2] hover:bg-surface-hover hover:-translate-y-1'
              }`}
            >
              {/* Sector Header */}
              <div className="flex items-center justify-between mb-4">
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center border shadow-lg group-hover:scale-110 transition-transform"
                  style={{
                    backgroundColor: `${sector.color}15`,
                    borderColor: `${sector.color}40`,
                    color: sector.color
                  }}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-white/50 px-2.5 py-1 rounded-lg bg-white/[0.04]">
                  {sector.category}
                </span>
              </div>

              {/* Title & Desc */}
              <h3 className="font-black text-lg text-white group-hover:text-cyber-cyan transition">
                {sector.name}
              </h3>
              <p className="text-xs text-white/50 mt-1.5 line-clamp-2 leading-relaxed">
                {sector.description}
              </p>

              {/* Footer action */}
              <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-[11px] font-bold text-cyber-cyan">
                  {sector.stats}
                </span>
                <div className="w-7 h-7 rounded-xl bg-white/[0.04] group-hover:bg-cyber-cyan group-hover:text-background flex items-center justify-center text-white/60 transition">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Glowing Background Mesh on Hover */}
              <div 
                className="absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none"
                style={{ backgroundColor: sector.color }}
              ></div>
            </button>
          );
        })}
      </div>

    </div>
  );
}
