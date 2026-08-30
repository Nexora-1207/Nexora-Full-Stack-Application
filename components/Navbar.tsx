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
  Globe,
  Users
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { SECTOR_TREES } from '@/lib/sectorTrees';
import { useCyberToast } from '@/components/CyberToast';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const toast = useCyberToast();
  const [user, setUser] = useState<any>(null);

  const [activeSector, setActiveSector] = useState<string>('ENGINEERING');
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    const guestMode = typeof window !== 'undefined' && localStorage.getItem('nexoraGuestMode') === 'true';
    setIsGuest(guestMode);

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

    const stored = typeof window !== 'undefined' ? localStorage.getItem('activeSector') : null;
    if (stored) setActiveSector(stored);

    return () => subscription.unsubscribe();
  }, [pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('activeSector');
      localStorage.removeItem('nexoraGuestMode');
    }
    toast.info('Signed Out', 'Session terminated. Clearance returned to gateway.');
    router.push('/auth');
  };

  // ONLY display taskbar and student header on the student portal pages:
  // /dashboard, /colleges, /ai, /vault, /profile
  // Hidden completely on Landing (/), Auth (/auth), Sector grid (/sectors), and Decision trees (/sectors/*)
  const dashboardRoutes = ['/dashboard', '/colleges', '/ai', '/vault', '/profile'];
  const showNav = dashboardRoutes.includes(pathname);

  if (!showNav) return null;

  // Resolve dynamic sector colors from SECTOR_TREES
  const sectorKey = Object.keys(SECTOR_TREES).find(
    (k) => SECTOR_TREES[k].id.toLowerCase() === activeSector.toLowerCase()
  ) || 'engineering';

  const sectorConfig = SECTOR_TREES[sectorKey] || SECTOR_TREES['engineering'];
  const primaryColor = sectorConfig?.colorPalette?.primary || '#00F0FF';
  const secondaryColor = sectorConfig?.colorPalette?.secondary || '#3B82F6';
  const glowColor = sectorConfig?.colorPalette?.glowColor || 'rgba(0, 240, 255, 0.35)';

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
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-background/65 border-b border-black/5 dark:border-white/[0.08] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div 
              className="relative w-8 h-8 rounded-xl p-[1.5px] group-hover:scale-105 transition-transform shadow-md"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`
              }}
            >
              <div className="w-full h-full bg-background rounded-[10px] flex items-center justify-center">
                <span 
                  className="font-black text-sm tracking-wider"
                  style={{ color: primaryColor }}
                >
                  N
                </span>
              </div>
            </div>
            <div>
              <span className="font-black text-base tracking-widest text-slate-900 dark:text-white flex items-center gap-1.5 leading-none">
                NEXORA
                <span 
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ backgroundColor: primaryColor }}
                ></span>
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] hover:border-white/20 transition text-xs font-bold text-slate-700 dark:text-white/80"
              title="Switch Academic Sector"
            >
              <Compass className="w-3.5 h-3.5" style={{ color: primaryColor }} />
              <span 
                className="uppercase tracking-wider text-[10px] font-black"
                style={{ color: primaryColor }}
              >
                {activeSector}
              </span>
            </Link>

            {/* User State */}
            {user || isGuest ? (
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

      {/* STREAMLINED SYMMETRICAL FLOATING GLASS DOCK (BOTTOM) */}
      <div className="fixed bottom-3 sm:bottom-5 left-0 right-0 z-50 flex justify-center px-3 sm:px-4 pointer-events-none">
        <nav 
          className="liquid-glass-dock pointer-events-auto w-full max-w-md px-2 py-2 grid grid-cols-5 items-center gap-1 shadow-2xl"
          style={{
            boxShadow: `0 15px 35px -5px rgba(0, 0, 0, 0.8), 0 0 25px -5px ${glowColor}`
          }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            if (item.isAi) {
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all duration-200 group ${
                    isActive
                      ? 'bg-cyber-cyan/15 border border-cyber-cyan/40 shadow-lg shadow-cyber-cyan/20'
                      : 'hover:bg-white/[0.04]'
                  }`}
                >
                  <div 
                    className="w-8 h-8 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm"
                    style={{
                      background: isActive 
                        ? `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` 
                        : 'rgba(0, 240, 255, 0.12)',
                      border: `1px solid ${primaryColor}50`
                    }}
                  >
                    <Icon 
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-background fill-background' : 'text-cyber-cyan'
                      }`} 
                    />
                  </div>
                  <span 
                    className="text-[9px] font-black tracking-tight mt-1 truncate max-w-full"
                    style={{ color: isActive ? primaryColor : 'rgba(255,255,255,0.7)' }}
                  >
                    Nexora AI
                  </span>
                </Link>
              );
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-white/[0.08] border border-white/[0.12] shadow-md'
                    : 'text-slate-400 dark:text-white/50 hover:text-white hover:bg-white/[0.04]'
                }`}
                style={isActive ? { borderColor: `${primaryColor}40` } : undefined}
              >
                <div className="w-8 h-8 flex items-center justify-center">
                  <Icon 
                    className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                      isActive ? 'stroke-[2.5px]' : 'stroke-[1.75px]'
                    }`}
                    style={isActive ? { color: primaryColor } : undefined}
                  />
                </div>
                <span 
                  className={`text-[9px] tracking-tight truncate max-w-full font-bold ${
                    isActive ? 'font-black' : ''
                  }`}
                  style={isActive ? { color: primaryColor } : undefined}
                >
                  {item.name}
                </span>

                {/* Subtle active pill indicator on top */}
                {isActive && (
                  <span 
                    className="absolute -top-[1px] w-6 h-[2px] rounded-full"
                    style={{
                      backgroundColor: primaryColor,
                      boxShadow: `0 0 8px ${primaryColor}`
                    }}
                  ></span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
