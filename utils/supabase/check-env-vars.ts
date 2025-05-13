// Check if Supabase environment variables are set
// Used to handle fallback behavior when Supabase is unavailable

export const hasEnvVars = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Check if we can actually connect to Supabase
export const checkSupabaseConnection = async (): Promise<boolean> => {
  if (!hasEnvVars) return false;

  try {
    // Try to make a simple request to check connectivity
    const response = await fetch(process.env.NEXT_PUBLIC_SUPABASE_URL + '/auth/v1/health', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      },
      cache: 'no-store',
    });

    return response.ok;
  } catch (error) {
    console.warn('Supabase connection check failed:', error);
    return false;
  }
};
