import { createBrowserClient } from "@supabase/ssr";

// Check if Supabase environment variables are set
export const hasSupabaseEnvVars = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Client-side compatible version for Pages Router
export function createClient() {
  // If Supabase environment variables are not set, return a mock client
  if (!hasSupabaseEnvVars) {
    return createMockClient();
  }

  try {
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  } catch (error) {
    console.warn('Error creating Supabase client:', error);
    return createMockClient();
  }
}

// Create a mock client that can be used when Supabase is unavailable
function createMockClient() {
  return {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
      signInWithPassword: async () => ({ data: { user: null }, error: { message: 'Supabase connection unavailable' } }),
      signUp: async () => ({ data: { user: null }, error: { message: 'Supabase connection unavailable' } }),
      signOut: async () => ({ error: null }),
    },
  } as any;
}
