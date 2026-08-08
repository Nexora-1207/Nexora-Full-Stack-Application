'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Home, 
  GraduationCap, 
  Sparkles, 
  FolderLock, 
  User, 
  Compass, 
  LogOut, 
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeSector, setActiveSector] = useState<string>('ENGINEERING');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        supabase
          .from('profiles')
          .select('sector, stream, full_name')
          .eq('id', user.id)
          .single()
          .then(({ data }) => {
            if (data?.sector) setActiveSector(data.sector);
          });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
    });

    const stored = localStorage.getItem('activeSector');
    if (stored) setActiveSector(stored);

    return () => subscription.unsubscribe();
  }, [pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('activeSector');
    router.push('/auth');
  };

  // Do not show full navbar on auth page
  if (pathname === '/auth') return null;

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Colleges', href: '/colleges', icon: GraduationCap },
    { name: 'Nexora AI', href: '/ai', icon: Sparkles, isAi: true },
    { name: 'Vault', href: '/vault', icon: FolderLock },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  return (
    <>
      {/* DESKTOP STICKY NAVBAR */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-2xl bg-surface/80 border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-cyber-cyan to-cyber-violet p-[1.5px] group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-background rounded-[10px] flex items-center justify-center">
                <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-cyber-pink text-lg tracking-wider">
                  N
                </span>
              </div>
            </div>
            <div>
              <span className="font-black text-xl tracking-widest text-white flex items-center gap-1.5">
                NEXORA
                <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-pulse"></span>
              </span>
              <span className="text-[10px] tracking-widest font-bold text-white/40 block -mt-1 uppercase">
                STUDENT NEXUS
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              if (item.isAi) {
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`relative px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black tracking-wider transition-all duration-300 ${
                      isActive 
                        ? 'bg-gradient-to-r from-cyber-cyan to-cyber-violet text-background shadow-[0_0_20px_rgba(0,240,255,0.4)] scale-105' 
                        : 'text-cyber-cyan bg-cyber-cyan/10 hover:bg-cyber-cyan/20 border border-cyber-cyan/30'
                    }`}
                  >
                    <Icon className="w-4 h-4 animate-spin-slow" />
                    <span>{item.name}</span>
                  </Link>
                );
              }

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative px-3.5 py-2 rounded-xl flex items-center gap-2 text-xs font-bold tracking-wider transition-all ${
                    isActive
                      ? 'text-white bg-white/[0.08] shadow-inner'
                      : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyber-cyan' : 'text-white/40'}`} />
                  <span>{item.name}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-cyber-cyan rounded-full shadow-[0_0_8px_#00F0FF]"></span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            {/* Sector Indicator / Switcher Link */}
            <Link
              href="/sectors"
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-cyber-cyan/40 hover:bg-white/[0.08] transition text-xs font-bold text-white/80"
              title="Switch Academic Sector"
            >
              <Compass className="w-3.5 h-3.5 text-cyber-cyan" />
              <span className="uppercase tracking-wider text-[11px] font-black text-cyber-cyan">
                {activeSector}
              </span>
            </Link>

            {user ? (
              <button
                onClick={handleLogout}
                className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-red-500/20 hover:border-red-500/40 text-white/60 hover:text-red-400 flex items-center justify-center transition"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            ) : (
              <Link
                href="/auth"
                className="cyber-button-primary px-4 py-1.5 rounded-xl text-xs flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>SIGN IN</span>
              </Link>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/80 flex items-center justify-center"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu (For Secondary Links) */}
        {mobileMenuOpen && (
          <div className="md:hidden glass-panel border-t border-white/[0.08] px-4 py-4 space-y-2">
            <Link
              href="/sectors"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-bold"
            >
              <span className="text-white/60">Current Career Sector</span>
              <span className="text-cyber-cyan font-black">{activeSector}</span>
            </Link>
            <Link
              href="/sectors/engineering"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.02] text-xs font-bold text-white/80 hover:text-white"
            >
              <Compass className="w-4 h-4 text-cyber-violet" />
              <span>Engineering Stream Tree (MPC / BiPC / Polytechnic)</span>
            </Link>
          </div>
        )}
      </header>

      {/* MOBILE FLOATING BOTTOM DOCK */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-50">
        <div className="glass-panel rounded-3xl p-1.5 px-3 flex items-center justify-around border border-white/[0.12] shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            if (item.isAi) {
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`-mt-7 w-13 h-13 p-3 rounded-full bg-gradient-to-tr from-cyber-cyan to-cyber-violet flex items-center justify-center shadow-[0_0_25px_rgba(0,240,255,0.6)] border-2 border-background transition-transform active:scale-95 ${
                    isActive ? 'scale-110' : ''
                  }`}
                >
                  <Icon className="w-6 h-6 text-background animate-spin-slow" />
                </Link>
              );
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all relative ${
                  isActive ? 'text-cyber-cyan' : 'text-white/40 hover:text-white/70'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''}`} />
                <span className="text-[9px] font-black tracking-wider mt-0.5">{item.name}</span>
                {isActive && (
                  <span className="w-1 h-1 rounded-full bg-cyber-cyan shadow-[0_0_6px_#00F0FF] mt-0.5"></span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
