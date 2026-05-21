"use client";

import { useState } from "react";
import Link from "next/link";

export default function ConsultationPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", phone: "", email: "", capital: "10K-50K", message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: send to Supabase consultation_requests table
    await new Promise(r => setTimeout(r, 600));
    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
        <div className="text-6xl mb-6 text-up">✓</div>
        <h1 className="text-2xl font-medium mb-4">درخواست شما ثبت شد</h1>
        <p className="text-text-dim text-sm mb-8 max-w-md leading-relaxed">
          ظرف ۴۸ ساعت با شما تماس خواهیم گرفت.
        </p>
        <Link href="/" className="text-accent text-sm hover:underline">بازگشت به صفحه اصلی</Link>
      </div>
    );
  }

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
          className="w-full max-w-[620px] rounded-3xl p-12 border border-line"
          style={{ background: "linear-gradient(180deg,#0F0F11,#0A0A0B)" }}>

          <div className="text-center mb-9">
            <h1 className="text-2xl font-medium mb-2.5">درخواست مشاوره</h1>
            <p className="text-sm text-text-dim leading-relaxed">فرم را پر کنید · ظرف ۴۸ ساعت پاسخ خواهید گرفت</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] text-text-dim tracking-wider mb-2 uppercase"><span className="text-accent">*</span> نام و نام خانوادگی</label>
              <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                className="w-full bg-bg border border-line rounded-xl px-4 py-3.5 text-sm outline-none focus:border-accent" />
            </div>
            <div>
              <label className="block text-[11px] text-text-dim tracking-wider mb-2 uppercase"><span className="text-accent">*</span> شماره تماس</label>
              <input type="tel" required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                dir="ltr" className="text-right w-full bg-bg border border-line rounded-xl px-4 py-3.5 text-sm outline-none focus:border-accent" />
            </div>
            <div>
              <label className="block text-[11px] text-text-dim tracking-wider mb-2 uppercase"><span className="text-accent">*</span> ایمیل</label>
              <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                dir="ltr" className="text-right w-full bg-bg border border-line rounded-xl px-4 py-3.5 text-sm outline-none focus:border-accent" />
            </div>
            <div>
              <label className="block text-[11px] text-text-dim tracking-wider mb-2 uppercase">سرمایه تقریبی</label>
              <select value={form.capital} onChange={e => setForm({...form, capital: e.target.value})}
                className="w-full bg-bg border border-line rounded-xl px-4 py-3.5 text-sm outline-none focus:border-accent cursor-pointer">
                <option>کمتر از $10,000</option>
                <option>$10K - $50K</option>
                <option>$50K - $100K</option>
                <option>$100K - $500K</option>
                <option>بیش از $500K</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-[11px] text-text-dim tracking-wider mb-2 uppercase">پیام شما</label>
              <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})}
                rows={4} className="w-full bg-bg border border-line rounded-xl px-4 py-3.5 text-sm outline-none focus:border-accent resize-none" />
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full mt-6 py-3.5 rounded-xl text-[#0A0A0B] font-semibold text-sm"
            style={{ background: "linear-gradient(135deg,#C9A961,#8B7338)", boxShadow: "0 8px 24px rgba(201,169,97,0.2)" }}>
            {loading ? "در حال ارسال..." : "ارسال درخواست"}
          </button>

          <div className="text-center text-[11px] text-text-faint mt-4 leading-relaxed">
            با ارسال این فرم، اطلاعات شما به صورت محرمانه نگهداری می‌شود.
          </div>

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
