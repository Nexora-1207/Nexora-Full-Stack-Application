import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://bokfsojrtgtmhsvizozv.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_j7jb_HxLqxVmivbc4Nl_8g_a99388SF';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true, // Picks up login tokens from Google and Password Reset URLs
    flowType: 'pkce',          // PKCE is more reliable than implicit: returns a ?code= param instead of fragment tokens
  },
});
