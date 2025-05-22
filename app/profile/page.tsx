import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProfileForm from "@/components/profile/profile-form";

export default async function ProfilePage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth"); // Redirect to login if not authenticated
  }

  // profile page
  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6 text-white">Profile Settings</h1>
      <ProfileForm user={user} />
    </div>
  );
} 