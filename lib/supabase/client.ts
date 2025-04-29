import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // Explicitly configure cookie handling for browser 
      // to align with middleware implementation
      cookies: {
        get(name) {
          // Parse the cookies from document.cookie
          const cookies = document.cookie.split(';').map(cookie => cookie.trim());
          const cookie = cookies.find(cookie => cookie.startsWith(`${name}=`));
          return cookie ? cookie.split('=')[1] : undefined;
        },
        set(name, value, options) {
          // Set a cookie with proper attributes
          document.cookie = `${name}=${value}${options?.path ? `;path=${options.path}` : ''
            }${options?.maxAge ? `;max-age=${options.maxAge}` : ''
            }${options?.domain ? `;domain=${options.domain}` : ''
            }${options?.sameSite ? `;samesite=${options.sameSite}` : ''
            }${options?.secure ? ';secure' : ''}`;
        },
        remove(name, options) {
          // Remove a cookie by setting it with an expired date
          document.cookie = `${name}=;${options?.path ? `;path=${options.path}` : ''
            }${options?.domain ? `;domain=${options.domain}` : ''
            };max-age=0`;
        },
      },
    }
  );
} 