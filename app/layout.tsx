import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { FavoritesProvider } from "@/lib/contexts/favorites-context";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/sidebar";
import MobileNav from "@/components/mobile-nav";
import "./globals.css";
import type { Metadata } from "next";

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
          backgroundColor: '#212121',
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
            {/* Sidebar - visible on desktop, collapsible on mobile */}
            <div className="hidden md:block">
              <Sidebar user={user} />
            </div>
            {/* Mobile Navigation */}
            <MobileNav user={user} />
            <main 
              className="flex-1 overflow-y-auto"
              style={{
                backgroundColor: 'rgba(30, 30, 30, 0.25)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                paddingTop: '1px',
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
