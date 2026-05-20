import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function PendingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("status, role, full_name")
    .eq("id", user.id)
    .single();

  if (profile?.status === "active") {
    if (profile.role === "admin") redirect("/admin");
    redirect("/dashboard");
  }

  if (profile?.status === "rejected") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-6">✕</div>
          <h1 className="text-2xl font-medium mb-4">درخواست شما رد شده است</h1>
          <p className="text-text-dim text-sm leading-relaxed mb-8">
            متأسفانه درخواست عضویت شما تأیید نشد. اگر سؤالی دارید با ما در تماس باشید.
          </p>
          <Link href="/" className="text-accent text-sm hover:underline">بازگشت به صفحه اصلی</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[700px] pointer-events-none -z-0"
        style={{ background: "radial-gradient(ellipse at center, rgba(201,179,107,0.08), transparent 60%)" }} />

      <div className="py-10 flex justify-center relative z-10">
        <Link href="/" className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl grid place-items-center text-[#0A0A0B] font-bold text-2xl"
            style={{ background: "linear-gradient(135deg,#C9A961,#8B7338)" }}>T</div>
          <div>
            <div className="text-base font-semibold">Tywin Capital</div>
            <div className="text-[9px] text-accent tracking-[2.5px] mt-0.5">PRIVATE WEALTH</div>
          </div>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-8 py-10 relative z-10">
        <div className="w-full max-w-[520px] rounded-3xl p-12 border text-center"
          style={{ background: "linear-gradient(180deg,#0F0F11,#0A0A0B)", borderColor: "rgba(201,179,107,0.3)" }}>
          <div className="w-16 h-16 rounded-2xl mx-auto mb-7 grid place-items-center text-3xl text-[#0A0A0B]"
            style={{ background: "#C9B36B" }}>⏳</div>
          <h1 className="text-2xl font-medium mb-3">حساب شما در انتظار تأیید است</h1>
          <p className="text-sm text-text-dim leading-relaxed mb-6">
            {profile?.full_name && <>سلام <span className="text-text">{profile.full_name}</span>. </>}
            ثبت‌نام شما با موفقیت ثبت شد. تیم ما در حال بررسی است و معمولاً ظرف <strong className="text-text">۲۴ ساعت</strong> پاسخ می‌دهیم.
          </p>
          <div className="text-xs text-text-faint mb-8">
            وقتی حساب فعال شد، با ایمیل به شما اطلاع می‌دهیم.
          </div>
          <form action="/api/auth/signout" method="POST">
            <button className="px-6 py-2.5 rounded-lg text-xs text-text-dim border border-line hover:text-accent hover:border-line-strong">
              خروج
            </button>
          </form>
        </div>
      </div>

      <div className="p-8 text-center text-[11px] text-text-faint relative z-10">
        contact@tywincapital.com · © ۱۴۰۴
      </div>
    </div>
  );
}
