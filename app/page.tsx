'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import NexoraIntro from '@/components/NexoraIntro';

export default function RootPage() {
  const router = useRouter();
  const [introComplete, setIntroComplete] = useState(false);
  const [destination, setDestination] = useState<string | null>(null);

  // Determine where to route — but wait for intro first
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setDestination(session ? '/dashboard' : '/auth');
    });
  }, []);

  // When the intro calls onComplete, navigate
  const handleIntroComplete = () => {
    setIntroComplete(true);
    if (destination) {
      router.replace(destination);
    } else {
      // Fallback — keep checking until destination is resolved
      const poll = setInterval(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
          clearInterval(poll);
          router.replace(session ? '/dashboard' : '/auth');
        });
      }, 200);
    }
  };

  // Always render intro on root visit
  return <NexoraIntro onComplete={handleIntroComplete} />;
}
