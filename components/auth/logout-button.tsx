'use client';

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth'); // Redirect to login page after logout
    router.refresh(); // Refresh server components
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLogout}
      className="bg-white/5 hover:bg-white/10 text-white border border-white/10 backdrop-blur-md"
    >
      <LogOut className="mr-2 h-4 w-4" />
      Logout
    </Button>
  );
}