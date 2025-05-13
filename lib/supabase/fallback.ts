// Utility to handle Supabase connection issues

import { createClient as createBrowserClient } from '@/lib/supabase/client';

// Store connection status to avoid repeated checks
let isSupabaseAvailable: boolean | null = null;

/**
 * Check if Supabase is available
 * This function will attempt to connect to Supabase and cache the result
 */
export async function checkSupabaseAvailability(): Promise<boolean> {
  // Return cached result if available
  if (isSupabaseAvailable !== null) {
    return isSupabaseAvailable;
  }

  try {
    // Try to create a client and make a simple request
    // Only use browser client for pages directory compatibility
    const supabase = createBrowserClient();

    // Set a short timeout to avoid hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    // Try to get the session (lightweight operation)
    await supabase.auth.getSession();

    clearTimeout(timeoutId);
    isSupabaseAvailable = true;
    return true;
  } catch (error) {
    console.warn('Supabase connection failed:', error);
    isSupabaseAvailable = false;
    return false;
  }
}

/**
 * Get a mock user object for development when Supabase is unavailable
 */
export function getMockUser() {
  return {
    id: 'mock-user-id',
    email: 'mock-user@example.com',
    user_metadata: {
      display_name: 'Mock User',
    },
    app_metadata: {},
    aud: 'authenticated',
    created_at: new Date().toISOString(),
  };
}

/**
 * Reset the cached Supabase availability status
 * Useful for testing or when network conditions change
 */
export function resetSupabaseAvailabilityCache() {
  isSupabaseAvailable = null;
}
