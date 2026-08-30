'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import NexoraIntro from '@/components/NexoraIntro';
import HomePage from '@/components/HomePage';

const SESSION_KEY = 'nexoraIntroPlayed';

type ViewState = 'loading' | 'intro' | 'landing';

export default function RootPage() {
  const router = useRouter();
  const [view, setView] = useState<ViewState>('loading');

  useEffect(() => {
    const introPlayed = sessionStorage.getItem(SESSION_KEY) === 'true';
    const isGuest = localStorage.getItem('nexoraGuestMode') === 'true';

    // If intro already played this session, skip it and route immediately
    if (introPlayed) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session || isGuest) {
          router.replace('/dashboard');
        } else {
          // Intro played but logged out → show landing page directly (no re-animation)
          setView('landing');
        }
      });
      return;
    }

    // First visit this session → always show intro for everyone
    setView('intro');
  }, [router]);

  // Called when intro animation finishes
  const handleIntroComplete = async () => {
    sessionStorage.setItem(SESSION_KEY, 'true');
    const isGuest = typeof window !== 'undefined' && localStorage.getItem('nexoraGuestMode') === 'true';
    const { data: { session } } = await supabase.auth.getSession();

    if (session || isGuest) {
      // Authenticated → go to dashboard
      router.replace('/dashboard');
    } else {
      // Not logged in → reveal the landing homepage
      setView('landing');
    }
  };

  // Determining auth state
  if (view === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030712]">
        <div className="w-8 h-8 rounded-full border-2 border-[#00F0FF] border-t-transparent animate-spin" />
      </div>
    );
  }

  // Intro splash — plays for every first-time visitor this session
  if (view === 'intro') {
    return <NexoraIntro onComplete={handleIntroComplete} />;
  }

  // Public landing page — shown to logged-out visitors after intro
  return <HomePage />;
}
