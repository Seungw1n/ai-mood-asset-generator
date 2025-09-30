// This file initializes the Supabase client.
// It is designed to be robust against misconfiguration to prevent the app from crashing on load.
import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import { config, isSupabaseConfigured } from '../config/env';

let supabaseClient: SupabaseClient;

const isConfigured = isSupabaseConfigured();

console.log('Supabase Configuration Check:', {
  isConfigured,
  url: config.supabase.url,
  hasAnonKey: config.supabase.anonKey ? 'Yes' : 'No',
  anonKeyLength: config.supabase.anonKey.length
});

if (isConfigured) {
  console.log('✅ Supabase client initialized successfully');
  supabaseClient = createClient(config.supabase.url, config.supabase.anonKey);
} else {
  console.error('❌ Supabase is NOT configured. Using mock client.');
  console.warn(
    `Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables. The application will not be able to save or load assets.`
  );

  // Create a mock client that will throw descriptive errors when its methods are called.
  // This prevents the app from crashing on load and provides better debugging info.
  const createMockService = (serviceName: string) => {
    const handler = {
      get(_target: any, prop: string) {
        // Return a function that returns the proxy itself for chaining
        return (..._args: any[]) => {
          const errorMsg = `Supabase client is not configured. Cannot call ${serviceName}.${String(prop)}.`;
          // For async functions, we must return a rejected promise.
          if (prop === 'then' || prop === 'catch' || prop === 'finally') {
            return Promise.reject(new Error(errorMsg));
          }
          // Return the proxy for chaining
          return new Proxy({}, handler);
        };
      }
    };
    return new Proxy({}, handler);
  };

  const mockStorage = {
     from: () => createMockService('storage')
  };

  const mockDb = {
    from: () => createMockService('database')
  }

  supabaseClient = new Proxy({}, {
    get(_target, prop) {
      if (prop === 'storage') {
        return mockStorage;
      }
       if (prop === 'from') {
        return mockDb.from;
      }
      return () => {
        const errorMsg = `Supabase client is not configured. Cannot access property '${String(prop)}'.`;
        throw new Error(errorMsg);
      };
    }
  }) as SupabaseClient;
}

export const supabase = supabaseClient;
