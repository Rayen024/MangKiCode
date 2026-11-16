import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';

export const isSupabaseConfigured =
  typeof SUPABASE_URL === 'string' &&
  SUPABASE_URL.startsWith('http') &&
  !SUPABASE_URL.includes('placeholder') &&
  !SUPABASE_URL.includes('xxxxxxxx') &&
  typeof SUPABASE_ANON_KEY === 'string' &&
  SUPABASE_ANON_KEY.length > 10;

export const safeUrl =
  typeof SUPABASE_URL === 'string' && SUPABASE_URL.startsWith('http')
    ? SUPABASE_URL
    : 'https://placeholder.supabase.co';

export const safeKey =
  typeof SUPABASE_ANON_KEY === 'string' && SUPABASE_ANON_KEY.length > 0
    ? SUPABASE_ANON_KEY
    : 'placeholder-key';

export const supabase = createClient(safeUrl, safeKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
