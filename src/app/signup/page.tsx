"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("رمز عبور و تکرار آن یکسان نیستند");
      return;
    }
    if (password.length < 8) {
      setError("رمز عبور باید حداقل ۸ کاراکتر باشد");
      return;
    }
    if (!acceptTerms) {
      setError("لطفاً شرایط استفاده را بپذیرید");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email, password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          full_name: `${firstName} ${lastName}`,
          phone,
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/pending");
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[700px] pointer-events-none -z-0"
        style={{ background: "radial-gradient(ellipse at center, rgba(201,169,97,0.08), transparent 60%)" }} />

      <Link href="/" className="absolute top-10 right-8 text-xs text-text-dim hover:text-accent z-10">← بازگشت</Link>

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

      <div className="flex-1 flex items-center justify-center px-8 py-5 pb-15 relative z-10">
        <form onSubmit={handleSubmit}
          className="w-full max-w-[520px] rounded-3xl p-12 border border-line"
          style={{ background: "linear-gradient(180deg,#0F0F11,#0A0A0B)" }}>

          <div className="text-center mb-7">
            <h1 className="text-2xl font-medium mb-2.5">ایجاد حساب</h1>
            <p className="text-sm text-text-dim leading-relaxed">برای دسترسی به پنل، حساب کاربری بسازید</p>
          </div>

          {/* Pending notice */}
          <div className="mb-7 p-3.5 rounded-xl flex gap-3 border" style={{ background: "rgba(201,179,107,0.1)", borderColor: "rgba(201,179,107,0.3)" }}>
            <div className="text-warning text-base">ⓘ</div>
            <div className="text-xs leading-relaxed">
              <strong className="text-warning">نیاز به تأیید دارد.</strong> پس از ثبت‌نام، حساب شما تا زمان تأیید توسط ادمین در وضعیت انتظار قرار می‌گیرد. معمولاً ظرف ۲۴ ساعت.
            </div>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-lg text-xs text-down border" style={{ background: "rgba(201,122,107,0.1)", borderColor: "rgba(201,122,107,0.3)" }}>
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3.5 mb-4">
            <div>
              <label className="block text-[11px] text-text-dim tracking-wider mb-2 uppercase"><span className="text-accent">*</span> نام</label>
              <input required value={firstName} onChange={e => setFirstName(e.target.value)}
                className="w-full bg-bg border border-line rounded-xl px-4 py-3.5 text-sm outline-none focus:border-accent" />
            </div>
            <div>
              <label className="block text-[11px] text-text-dim tracking-wider mb-2 uppercase"><span className="text-accent">*</span> نام خانوادگی</label>
              <input required value={lastName} onChange={e => setLastName(e.target.value)}
                className="w-full bg-bg border border-line rounded-xl px-4 py-3.5 text-sm outline-none focus:border-accent" />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-[11px] text-text-dim tracking-wider mb-2 uppercase"><span className="text-accent">*</span> ایمیل</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              dir="ltr" className="text-right w-full bg-bg border border-line rounded-xl px-4 py-3.5 text-sm outline-none focus:border-accent" />
          </div>

          <div className="mb-4">
            <label className="block text-[11px] text-text-dim tracking-wider mb-2 uppercase"><span className="text-accent">*</span> شماره تماس</label>
            <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)}
              dir="ltr" className="text-right w-full bg-bg border border-line rounded-xl px-4 py-3.5 text-sm outline-none focus:border-accent" />
          </div>

          <div className="mb-4">
            <label className="block text-[11px] text-text-dim tracking-wider mb-2 uppercase"><span className="text-accent">*</span> رمز عبور</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
              dir="ltr" className="text-right w-full bg-bg border border-line rounded-xl px-4 py-3.5 text-sm outline-none focus:border-accent" />
            <div className="text-[10px] text-text-faint mt-1.5">حداقل ۸ کاراکتر</div>
          </div>

          <div className="mb-4">
            <label className="block text-[11px] text-text-dim tracking-wider mb-2 uppercase"><span className="text-accent">*</span> تکرار رمز عبور</label>
            <input type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
              dir="ltr" className="text-right w-full bg-bg border border-line rounded-xl px-4 py-3.5 text-sm outline-none focus:border-accent" />
          </div>

          <label className="flex items-start gap-2.5 my-5 text-xs text-text-dim cursor-pointer">
            <input type="checkbox" checked={acceptTerms} onChange={e => setAcceptTerms(e.target.checked)}
              className="mt-0.5 accent-accent" />
            <span>شرایط استفاده و حریم خصوصی Tywin Capital را خوانده‌ام و می‌پذیرم</span>
          </label>

          <button type="submit" disabled={loading}
            className="w-full py-3.5 rounded-xl text-[#0A0A0B] font-semibold text-sm"
            style={{ background: "linear-gradient(135deg,#C9A961,#8B7338)", boxShadow: "0 8px 24px rgba(201,169,97,0.2)" }}>
            {loading ? "در حال ساخت حساب..." : "ایجاد حساب"}
          </button>

          <div className="text-center text-sm text-text-dim mt-7 pt-6 border-t border-line">
            از قبل حساب دارید؟ <Link href="/login" className="text-accent font-medium hover:underline">وارد شوید</Link>
          </div>
        </form>
      </div>

      <div className="p-8 text-center text-[11px] text-text-faint relative z-10">
        contact@tywincapital.com · © ۱۴۰۴
      </div>
    </div>
  );
}
