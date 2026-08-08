'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        if (typeof window !== 'undefined') {
          const hash = window.location.hash;
          const search = window.location.search;

          if (search && search.includes('code=')) {
            const urlParams = new URLSearchParams(search);
            const code = urlParams.get('code');
            if (code) {
              await supabase.auth.exchangeCodeForSession(code);
            }
          }
        }
      } catch (err) {
        console.error('Error during callback exchange:', err);
      } finally {
        router.replace('/dashboard');
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <Loader2 className="w-8 h-8 text-cyber-cyan animate-spin mb-3" />
      <span className="text-xs font-black uppercase tracking-widest text-cyber-cyan">
        FINALIZING NEXORA SECURITY CLEARANCE...
      </span>
    </div>
  );
}
