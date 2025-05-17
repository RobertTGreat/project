import Sidebar from '@/components/sidebar';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { createClient } from '@/lib/supabase/server';
import { ThemeProvider } from "next-themes";
import { FavoritesProvider } from '@/lib/contexts/favorites-context';

export const metadata: Metadata = {
  title: "DEVTOOLS",
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{
          display: 'flex', 
          height: '100vh', 
          backgroundColor: '#212121', // Fallback background
          backgroundImage: 'url(/noise.png), radial-gradient(circle, #660000, #212121)',
        }}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <FavoritesProvider user={user}>
            <Sidebar user={user} />
            <main 
              style={{
                flexGrow: 1, 
                overflowY: 'auto', 
                backgroundColor: 'rgba(30, 30, 30, 0.25)', // Same as sidebar example
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)', // For Safari
                paddingTop: '1px', // Small padding to prevent content overlap with potential blurred edge
              }}
            >
              {children}
            </main>
          </FavoritesProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
