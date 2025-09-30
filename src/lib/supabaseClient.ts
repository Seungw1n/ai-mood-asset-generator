// This file initializes the Supabase client.
// It is designed to be robust against misconfiguration to prevent the app from crashing on load.
import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import { config, isSupabaseConfigured } from '../config/env';

let supabaseClient: SupabaseClient;

const isConfigured = isSupabaseConfigured();

if (isConfigured) {
  supabaseClient = createClient(config.supabase.url, config.supabase.anonKey);
} else {
  console.warn(
    `Supabase is not configured. Please replace placeholder values in src/lib/supabaseClient.ts. The application will not be able to save or load assets.`
  );

  // Create a mock client that will throw descriptive errors when its methods are called.
  // This prevents the app from crashing on load and provides better debugging info.
  const createMockService = (serviceName: string) => {
    return new Proxy({}, {
      get(_target, prop) {
        return () => {
          const errorMsg = `Supabase client is not configured. Cannot call ${serviceName}.${String(prop)}.`;
          // For async functions, we must return a rejected promise.
          return Promise.reject(new Error(errorMsg));
        };
      }
    });
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
