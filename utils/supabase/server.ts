import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { hasEnvVars } from "./check-env-vars";

export const createClient = async () => {
  // If Supabase environment variables are not set, return a mock client
  if (!hasEnvVars) {
    return createMockClient();
  }

  try {
    const cookieStore = await cookies();

    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options);
              });
            } catch (error) {
              // The `set` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      },
    );
  } catch (error) {
    console.warn('Error creating Supabase client:', error);
    return createMockClient();
  }
};

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
