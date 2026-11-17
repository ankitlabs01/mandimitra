import { createClient } from '@supabase/supabase-js';

// Support both NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY and NEXT_PUBLIC_SUPABASE_ANON_KEY
const getEnvUrl = () => {
  if (typeof process !== 'undefined' && process.env) {
    return process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  }
  return '';
};

const getEnvKey = () => {
  if (typeof process !== 'undefined' && process.env) {
    return (
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      ''
    );
  }
  return '';
};

// Check for runtime configured keys in browser localStorage if env is not yet set
const getRuntimeConfig = () => {
  if (typeof window !== 'undefined') {
    try {
      const storedUrl = localStorage.getItem('mandi_mitra_supabase_url');
      const storedKey = localStorage.getItem('mandi_mitra_supabase_key');
      if (storedUrl && storedKey) {
        return { url: storedUrl, key: storedKey };
      }
    } catch (e) {
      // ignore localStorage read error
    }
  }
  return null;
};

const runtime = getRuntimeConfig();
const supabaseUrl = getEnvUrl() || runtime?.url || '';
const supabaseKey = getEnvKey() || runtime?.key || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseKey &&
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('your-project') &&
  supabaseKey !== 'your-publishable-key' &&
  supabaseKey !== 'your-anon-key'
);

const effectiveUrl =
  supabaseUrl && supabaseUrl.startsWith('http')
    ? supabaseUrl
    : 'https://placeholder.supabase.co';

const effectiveKey = supabaseKey || 'placeholder-anon-key';

export const supabase = createClient(effectiveUrl, effectiveKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export const getSupabaseConfig = () => ({
  url: supabaseUrl,
  hasKey: Boolean(supabaseKey),
  isConfigured: isSupabaseConfigured,
});

/**
 * Helper to update runtime Supabase credentials directly from UI if needed
 */
export const setRuntimeSupabaseConfig = (url: string, key: string) => {
  if (typeof window !== 'undefined') {
    if (url && key) {
      localStorage.setItem('mandi_mitra_supabase_url', url.trim());
      localStorage.setItem('mandi_mitra_supabase_key', key.trim());
    } else {
      localStorage.removeItem('mandi_mitra_supabase_url');
      localStorage.removeItem('mandi_mitra_supabase_key');
    }
    window.location.reload();
  }
};
