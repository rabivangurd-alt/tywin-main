import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/layout/AdminSidebar";
import AdminTopbar from "@/components/layout/AdminTopbar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") redirect("/dashboard");

  // Count pending items for badges
  const { count: pendingCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  const { count: openTickets } = await supabase
    .from("tickets")
    .select("*", { count: "exact", head: true })
    .in("status", ["open", "in_progress"]);

  return (
    <div className="grid grid-cols-[250px_1fr] min-h-screen">
      <AdminSidebar pendingCount={pendingCount || 0} openTickets={openTickets || 0} />
      <main className="flex flex-col">
        <AdminTopbar profile={profile} />
        <div className="flex-1">{children}</div>
      </main>
    </div>
  );
}
