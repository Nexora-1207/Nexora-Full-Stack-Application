'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, Compass, Sparkles } from 'lucide-react';


export default function Footer() {
  const pathname = usePathname();
  
  // Keep the UI ultra-clean and seamless for student navigation
  const showFooter = ['/dashboard', '/colleges', '/ai', '/vault', '/profile'].includes(pathname);
  if (!showFooter) return null;

  return (
    <footer className="relative z-20 w-full border-t border-white/[0.06] bg-[#030712]/80 backdrop-blur-xl py-6 mt-auto transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-mono">
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-cyber-cyan to-blue-600 p-[1px] flex items-center justify-center">
              <div className="w-full h-full bg-[#030712] rounded-[5px] flex items-center justify-center">
                <span className="font-black text-[10px] text-cyber-cyan">N</span>
              </div>
            </div>
            <span className="font-black tracking-widest text-white text-xs">NEXORA</span>
          </div>
          <span>•</span>
          <span className="flex items-center gap-1 text-emerald-400 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5" /> Verified Student Hub
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-slate-500">
          <span>© {new Date().getFullYear()} Nexora Education Technologies</span>
          <span>•</span>
          <span className="text-cyber-cyan">v2.0 Production</span>
        </div>

      </div>
    </footer>
  );
}
