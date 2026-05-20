"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError("ایمیل یا رمز عبور نادرست است");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[700px] pointer-events-none -z-0"
        style={{ background: "radial-gradient(ellipse at center, rgba(201,169,97,0.08), transparent 60%)" }} />

      <Link href="/" className="absolute top-10 right-8 text-xs text-text-dim hover:text-accent z-10">← بازگشت</Link>

      {/* Brand */}
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
        <form onSubmit={handleSubmit}
          className="w-full max-w-[440px] rounded-3xl p-12 border border-line"
          style={{ background: "linear-gradient(180deg,#0F0F11,#0A0A0B)" }}>

          <div className="text-center mb-9">
            <h1 className="text-2xl font-medium mb-2">ورود به پنل</h1>
            <p className="text-sm text-text-dim">وارد شوید تا داشبورد را مشاهده کنید</p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-lg text-xs text-down border" style={{ background: "rgba(201,122,107,0.1)", borderColor: "rgba(201,122,107,0.3)" }}>
              {error}
            </div>
          )}

          <div className="mb-5">
            <label className="block text-[11px] text-text-dim tracking-wider mb-2 uppercase">ایمیل</label>
            <input
              type="email" required
              value={email} onChange={e => setEmail(e.target.value)}
              dir="ltr" className="text-right w-full bg-bg border border-line rounded-xl px-4 py-3.5 text-sm outline-none focus:border-accent focus:bg-tint" />
          </div>

          <div className="mb-5">
            <label className="block text-[11px] text-text-dim tracking-wider mb-2 uppercase">رمز عبور</label>
            <input
              type="password" required
              value={password} onChange={e => setPassword(e.target.value)}
              dir="ltr" className="text-right w-full bg-bg border border-line rounded-xl px-4 py-3.5 text-sm outline-none focus:border-accent focus:bg-tint" />
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-3.5 rounded-xl text-[#0A0A0B] font-semibold text-sm"
            style={{ background: "linear-gradient(135deg,#C9A961,#8B7338)", boxShadow: "0 8px 24px rgba(201,169,97,0.2)" }}>
            {loading ? "در حال ورود..." : "ورود"}
          </button>

          <div className="text-center my-6 text-[11px] text-text-faint tracking-wider relative">
            <span className="relative px-3 bg-bg-2">یا</span>
          </div>

          <div className="text-center text-sm text-text-dim">
            مشتری جدید هستید؟{" "}
            <Link href="/signup" className="text-accent font-medium hover:underline">ثبت‌نام کنید</Link>
          </div>
        </form>
      </div>

      <div className="p-8 text-center text-[11px] text-text-faint relative z-10">
        contact@tywincapital.com · © ۱۴۰۴
      </div>
    </div>
  );
}
