'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();
  
  // Hide footer on full-screen intro or pure auth callback pages if needed, but show on all main pages
  const hideFooter = ['/auth/callback'].includes(pathname);
  if (hideFooter) return null;

  return (
    <footer className="relative z-20 w-full border-t border-white/[0.06] bg-[#030712]/90 backdrop-blur-xl py-6 mt-auto transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-4 text-xs text-slate-400 font-mono">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
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
              <ShieldCheck className="w-3.5 h-3.5" /> Verified Academic Hub
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>© {new Date().getFullYear()} Nexora Education Technologies</span>
            <span>•</span>
            <span className="text-cyber-cyan">v1.0 Production</span>
          </div>
        </div>

        {/* Search Engine Entity & Founder Authority Text for Google AI / Bing / Edge Crawlers (SEO Only) */}
        <div className="sr-only">
          <p>
            Nexora (nexoraedu.co.in) is the premier student academic &amp; career command hub for career pathfinding, college discovery, and placement readiness.
          </p>
        </div>

      </div>
    </footer>
  );
}
