import React from 'react';
import Link from 'next/link';
import { Linkedin, Mail, ShieldCheck, Sparkles, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative z-20 w-full border-t border-white/[0.08] bg-[#030712]/90 backdrop-blur-xl mt-auto transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-white/[0.06]">
          
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyber-cyan to-blue-600 p-[1px] shadow-sm shadow-cyber-cyan/30 flex items-center justify-center">
                <div className="w-full h-full bg-[#030712] rounded-[7px] flex items-center justify-center">
                  <span className="font-black text-xs text-cyber-cyan">N</span>
                </div>
              </div>
              <span className="font-black text-base tracking-widest text-white">
                NEXORA
              </span>
            </Link>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Premier student academic & career command hub connecting students with curated career branching trees, verified engineering colleges, and AI guidance.
            </p>
            <div className="flex items-center gap-3 pt-1 text-[11px] text-white/50">
              <span className="flex items-center gap-1 text-emerald-400 font-mono">
                <ShieldCheck className="w-3.5 h-3.5" /> Official Portal
              </span>
              <span>•</span>
              <span className="font-mono">nexoraedu.co.in</span>
            </div>
          </div>

          {/* Platform Nav */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest">Platform</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/dashboard" className="hover:text-cyber-cyan transition">Student Dashboard</Link></li>
              <li><Link href="/sectors" className="hover:text-cyber-cyan transition">Career Pathways</Link></li>
              <li><Link href="/colleges" className="hover:text-cyber-cyan transition">College Directory</Link></li>
              <li><Link href="/ai" className="hover:text-cyber-cyan transition">Nexora AI Counselor</Link></li>
              <li><Link href="/vault" className="hover:text-cyber-cyan transition">Encrypted Vault</Link></li>
            </ul>
          </div>

          {/* Founders & Leadership */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest">Founders & Leadership</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/about" className="hover:text-cyber-cyan font-bold text-white flex items-center gap-1.5 transition">
                  About & Founders <Sparkles className="w-3 h-3 text-cyber-cyan" />
                </Link>
              </li>
              <li>
                <a 
                  href="https://www.linkedin.com/in/nadeem-shaik-458981343" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-cyber-cyan flex items-center gap-1.5 transition text-slate-300"
                >
                  <Linkedin className="w-3.5 h-3.5 text-[#0077B5]" />
                  <span>Shaik Nadeem Ahmed <span className="text-[10px] text-white/40">(CEO)</span></span>
                </a>
              </li>
              <li>
                <a 
                  href="https://www.linkedin.com/in/rakesh-varma-gudipalli-88b417343" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-cyber-cyan flex items-center gap-1.5 transition text-slate-300"
                >
                  <Linkedin className="w-3.5 h-3.5 text-[#0077B5]" />
                  <span>Gudipalli Rakesh Varma <span className="text-[10px] text-white/40">(CMO)</span></span>
                </a>
              </li>
              <li className="pt-1">
                <a 
                  href="mailto:nexoraofficial1207@gmail.com" 
                  className="hover:text-cyber-cyan flex items-center gap-1.5 transition text-slate-400 font-mono text-[11px]"
                >
                  <Mail className="w-3 h-3 text-cyber-cyan" />
                  nexoraofficial1207@gmail.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 font-mono">
          <p>© {new Date().getFullYear()} Nexora Education Technologies. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:text-slate-300 transition">Executive Dossier</Link>
            <span>•</span>
            <Link href="/founders" className="hover:text-slate-300 transition">Founders</Link>
            <span>•</span>
            <span className="text-cyber-cyan">Nexora v2.0 Production</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
