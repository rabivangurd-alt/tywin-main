import { createClient } from "@/lib/supabase/server";
import ApprovalsClient from "./approvals-client";

export default async function ApprovalsPage() {
  const supabase = await createClient();
  const { data: pending } = await supabase
    .from("profiles")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  return (
    <div className="p-7">
      <div className="mb-7">
        <h1 className="text-2xl font-medium mb-1.5">تأیید ثبت‌نام‌های جدید</h1>
        <p className="text-xs text-text-faint">
          {pending?.length || 0} درخواست در انتظار بررسی · با هر تأیید، مشتری به سیستم اضافه می‌شود
        </p>
      </div>

      <ApprovalsClient initialPending={pending || []} />
    </div>
  );
}
