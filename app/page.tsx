'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import NexoraIntro from '@/components/NexoraIntro';

const SESSION_KEY = 'nexoraIntroPlayed';

export default function RootPage() {
  const router = useRouter();
  const [destination, setDestination] = useState<string | null>(null);

  // Check auth destination in the background immediately
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setDestination(session ? '/dashboard' : '/auth');
    });
  }, []);

  // Decide whether to skip intro or show it
  const introAlreadyPlayed =
    typeof window !== 'undefined' &&
    sessionStorage.getItem(SESSION_KEY) === 'true';

  const navigate = (dest: string) => {
    router.replace(dest);
  };

  // If intro was already played this browser session, skip straight to the destination
  if (introAlreadyPlayed) {
    if (destination) {
      navigate(destination);
    } else {
      // Auth check still in flight — wait for it
      supabase.auth.getSession().then(({ data: { session } }) => {
        navigate(session ? '/dashboard' : '/auth');
      });
    }
    // Return null while redirecting
    return null;
  }

  // First visit this session — show the intro
  const handleIntroComplete = () => {
    // Mark intro as played for the remainder of this session (tab open)
    sessionStorage.setItem(SESSION_KEY, 'true');

    if (destination) {
      navigate(destination);
    } else {
      // Poll until session check resolves
      const poll = setInterval(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
          clearInterval(poll);
          navigate(session ? '/dashboard' : '/auth');
        });
      }, 200);
    }
  };

  return <NexoraIntro onComplete={handleIntroComplete} />;
}
