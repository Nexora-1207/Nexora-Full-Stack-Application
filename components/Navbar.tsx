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
  Sun,
  Moon,
  Laptop
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/components/ThemeProvider';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme, toggleTheme, theme } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [activeSector, setActiveSector] = useState<string>('ENGINEERING');

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        supabase
          .from('profiles')
          .select('sector')
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

  // Do not show taskbar on auth page
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
      {/* MINIMAL TOP HEADER BAR */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-background/70 border-b border-black/5 dark:border-white/[0.08] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-cyber-cyan to-cyber-violet p-[1.5px] group-hover:scale-105 transition-transform shadow-md">
              <div className="w-full h-full bg-background rounded-[10px] flex items-center justify-center">
                <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-cyber-pink text-sm tracking-wider">
                  N
                </span>
              </div>
            </div>
            <div>
              <span className="font-black text-base tracking-widest text-slate-900 dark:text-white flex items-center gap-1.5 leading-none">
                NEXORA
                <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-pulse"></span>
              </span>
              <span className="text-[9px] tracking-widest font-bold text-slate-500 dark:text-white/40 block uppercase">
                STUDENT HUB
              </span>
            </div>
          </Link>

          {/* Right Controls: Sector, Theme Switcher & Logout */}
          <div className="flex items-center gap-2.5">
            {/* Sector Indicator */}
            <Link
              href="/sectors"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] hover:border-cyber-cyan/40 transition text-xs font-bold text-slate-700 dark:text-white/80"
              title="Switch Academic Sector"
            >
              <Compass className="w-3.5 h-3.5 text-cyber-cyan" />
              <span className="uppercase tracking-wider text-[10px] font-black text-cyber-cyan">
                {activeSector}
              </span>
            </Link>

            {/* Dynamic Light/Dark Theme Switcher Toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] hover:border-cyber-cyan/40 text-slate-700 dark:text-white/80 flex items-center justify-center transition shadow-sm"
              title={`Switch to ${resolvedTheme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {resolvedTheme === 'dark' ? (
                <Sun className="w-4 h-4 text-cyber-amber animate-spin-slow" />
              ) : (
                <Moon className="w-4 h-4 text-cyber-violet" />
              )}
            </button>

            {/* User State */}
            {user ? (
              <button
                onClick={handleLogout}
                className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] hover:bg-red-500/10 hover:border-red-500/30 text-slate-500 dark:text-white/60 hover:text-red-500 flex items-center justify-center transition"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            ) : (
              <Link
                href="/auth"
                className="cyber-button-primary px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>SIGN IN</span>
              </Link>
            )}
          </div>

        </div>
      </header>

      {/* ULTRA-CURVED FLOATING LIQUID GLASS TASKBAR DOCK (BOTTOM) */}
      <div className="fixed bottom-5 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <nav className="liquid-glass-dock pointer-events-auto w-full max-w-lg px-4 py-2 flex items-center justify-around">
          
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            if (item.isAi) {
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative -mt-8 w-14 h-14 rounded-full bg-gradient-to-tr from-cyber-cyan via-cyber-blue to-cyber-violet p-[2px] shadow-[0_10px_25px_rgba(0,240,255,0.5)] transition-transform duration-300 hover:scale-110 active:scale-95 group ${
                    isActive ? 'scale-110 ring-4 ring-cyber-cyan/30' : ''
                  }`}
                >
                  <div className="w-full h-full bg-background rounded-full flex flex-col items-center justify-center">
                    <Icon className="w-6 h-6 text-cyber-cyan animate-spin-slow group-hover:scale-110 transition-transform" />
                  </div>
                  {/* Glowing halo pulse */}
                  <span className="absolute inset-0 rounded-full bg-cyber-cyan/20 animate-ping pointer-events-none"></span>
                </Link>
              );
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`relative flex flex-col items-center justify-center py-2 px-3 rounded-2xl transition-all duration-200 ${
                  isActive
                    ? 'text-cyber-cyan font-black scale-105'
                    : 'text-slate-500 dark:text-white/40 hover:text-slate-900 dark:hover:text-white/80 hover:scale-105'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'stroke-[2.5px]' : ''}`} />
                <span className="text-[10px] font-bold tracking-wider mt-1">{item.name}</span>

                {/* Liquid Droplet Indicator */}
                {isActive && (
                  <span className="liquid-drop -bottom-1 left-1/2 -translate-x-1/2"></span>
                )}
              </Link>
            );
          })}

        </nav>
      </div>
    </>
  );
}
