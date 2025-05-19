import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Check if Supabase environment variables are set
export const hasSupabaseEnvVars = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Making the function async as required by supabase/ssr when cookie methods use await
export async function createClient() {
  // If Supabase environment variables are not set, return a mock client
  if (!hasSupabaseEnvVars) {
    return createMockClient();
  }

  try {
    const cookieStore = cookies()

    // Use the getAll/setAll pattern from Supabase SSR docs
    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      // process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use anon key for server client by default unless service role actions are needed
      {
        cookies: {
          // Define getAll and setAll as async methods
          async getAll() {
            // Await the cookieStore before calling methods
            const resolvedCookieStore = await cookieStore;
            return resolvedCookieStore.getAll()
          },
          async setAll(cookiesToSet) {
            // Await the cookieStore before calling methods
            const resolvedCookieStore = await cookieStore;
            try {
              // Loop through the array and call set for each cookie
              cookiesToSet.forEach(({ name, value, options }) => {
                // Use resolvedCookieStore here
                resolvedCookieStore.set(name, value, options)
              })
            } catch (error) {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    )
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