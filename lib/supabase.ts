import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bokfsojrtgtmhsvizozv.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJva2Zzb2pydGd0bWhzdml6b3p2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNTU4NDQsImV4cCI6MjA4OTkzMTg0NH0.jA9qw_nX836NYxfZM2hrDrLBVHKk26dyuVLfV3pt_UU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
