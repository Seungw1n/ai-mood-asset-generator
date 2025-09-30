export const config = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY',
  },
  gemini: {
    apiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
    model: 'imagen-4.0-generate-001',
  },
} as const;

export const isSupabaseConfigured = (): boolean => {
  return (
    config.supabase.url !== 'YOUR_SUPABASE_URL' &&
    config.supabase.anonKey !== 'YOUR_SUPABASE_ANON_KEY'
  );
};