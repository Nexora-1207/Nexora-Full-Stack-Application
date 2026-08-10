'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import NexoraIntro from '@/components/NexoraIntro';

const SESSION_KEY = 'nexoraIntroPlayed';

export default function RootPage() {
  const router = useRouter();
  const [showIntro, setShowIntro] = useState<boolean | null>(null);

  useEffect(() => {
    const isGuest = localStorage.getItem('nexoraGuestMode') === 'true';
    const introPlayed = sessionStorage.getItem(SESSION_KEY) === 'true';

    if (introPlayed) {
      // Skip intro, navigate safely inside useEffect
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session || isGuest) {
          router.replace('/dashboard');
        } else {
          router.replace('/auth');
        }
      });
      setShowIntro(false);
    } else {
      setShowIntro(true);
    }
  }, [router]);

  const handleIntroComplete = async () => {
    sessionStorage.setItem(SESSION_KEY, 'true');
    const isGuest = typeof window !== 'undefined' && localStorage.getItem('nexoraGuestMode') === 'true';
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session || isGuest) {
      router.replace('/dashboard');
    } else {
      router.replace('/auth');
    }
  };

  if (showIntro === null || showIntro === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030712]">
        <div className="w-8 h-8 rounded-full border-2 border-cyber-cyan border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return <NexoraIntro onComplete={handleIntroComplete} />;
}
