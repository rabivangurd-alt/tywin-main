import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ClientTopnav from "@/components/layout/ClientTopnav";

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/login");
  if (profile.status === "pending") redirect("/pending");
  if (profile.role === "admin") redirect("/admin");

  return (
    <div className="min-h-screen">
      <ClientTopnav profile={profile} />
      <main>{children}</main>
    </div>
  );
}
