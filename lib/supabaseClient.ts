// This file initializes the Supabase client.
// It is designed to be robust against misconfiguration to prevent the app from crashing on load.

const supabaseJs = (window as any).supabase;

// --- IMPORTANT ---
// TODO: Replace with your actual Supabase URL and Anon Key
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

let supabaseClient: any;

const isConfigured = supabaseJs && SUPABASE_URL !== 'YOUR_SUPABASE_URL' && SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY';

if (isConfigured) {
  supabaseClient = supabaseJs.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
  console.warn(
    `Supabase is not configured. Please replace placeholder values in lib/supabaseClient.ts, and ensure the Supabase script is loaded in index.html. The application will not be able to save or load assets.`
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
  });
}

export const supabase = supabaseClient;
