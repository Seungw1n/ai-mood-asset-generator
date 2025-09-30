export const config = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY',
  },
  gemini: {
    model: 'imagen-4.0-generate-001',
  },
} as const;

export const isSupabaseConfigured = (): boolean => {
  const hasUrl = config.supabase.url &&
                 config.supabase.url !== 'YOUR_SUPABASE_URL' &&
                 config.supabase.url.trim() !== '';
  const hasKey = config.supabase.anonKey &&
                 config.supabase.anonKey !== 'YOUR_SUPABASE_ANON_KEY' &&
                 config.supabase.anonKey.trim() !== '';

  console.log('Supabase config validation:', {
    hasUrl,
    hasKey,
    urlValue: config.supabase.url,
    keyLength: config.supabase.anonKey?.length || 0,
    envVars: {
      VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL ? 'SET' : 'NOT SET',
      VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET',
    }
  });

  return hasUrl && hasKey;
};