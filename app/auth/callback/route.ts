import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') || '/dashboard';

  if (code) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bokfsojrtgtmhsvizozv.supabase.co';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJva2Zzb2pydGd0bWhzdml6b3p2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNTU4NDQsImV4cCI6MjA4OTkzMTg0NH0.jA9qw_nX836NYxfZM2hrDrLBVHKk26dyuVLfV3pt_UU';

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Fallback to dashboard
  return NextResponse.redirect(`${origin}/dashboard`);
}
