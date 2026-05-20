import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] pointer-events-none -z-0"
        style={{ background: "radial-gradient(ellipse at center, rgba(201,169,97,0.08), transparent 60%)" }} />

      {/* Brand */}
      <div className="py-10 flex justify-center relative z-10">
        <Link href="/" className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl grid place-items-center text-[#0A0A0B] font-bold text-2xl"
            style={{ background: "linear-gradient(135deg,#C9A961,#8B7338)", boxShadow: "0 8px 24px rgba(201,169,97,0.25)" }}>
            T
          </div>
          <div>
            <div className="text-base font-semibold">Tywin Capital</div>
            <div className="text-[9px] text-accent tracking-[2.5px] mt-0.5">PRIVATE WEALTH</div>
          </div>
        </Link>
      </div>

      {/* Gates */}
      <div className="flex-1 flex items-center justify-center px-8 py-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[900px] w-full">
          {/* Login */}
          <Link href="/login" className="relative overflow-hidden rounded-3xl p-14 px-10 text-center border border-line hover:border-line-strong transition-all hover:-translate-y-1"
            style={{ background: "linear-gradient(180deg,#0F0F11,#0A0A0B)" }}>
            <div className="w-16 h-16 rounded-2xl bg-tint-2 border border-line-strong grid place-items-center mx-auto mb-7 text-accent text-2xl">⌂</div>
            <div className="text-xl font-medium mb-3">ورود به پنل</div>
            <div className="text-sm text-text-dim leading-relaxed mb-7">
              مشتریان فعلی برای مشاهده داشبورد، عملکرد و تراکنش‌ها
            </div>
            <div className="text-accent font-medium text-sm">ورود ←</div>
          </Link>

          {/* Consultation */}
          <Link href="/consultation" className="relative overflow-hidden rounded-3xl p-14 px-10 text-center border border-line hover:border-line-strong transition-all hover:-translate-y-1"
            style={{ background: "linear-gradient(180deg,#0F0F11,#0A0A0B)" }}>
            <div className="w-16 h-16 rounded-2xl grid place-items-center mx-auto mb-7 text-[#0A0A0B] text-2xl"
              style={{ background: "linear-gradient(135deg,#C9A961,#8B7338)", boxShadow: "0 8px 24px rgba(201,169,97,0.25)" }}>✦</div>
            <div className="text-xl font-medium mb-3">درخواست مشاوره</div>
            <div className="text-sm text-text-dim leading-relaxed mb-7">
              برای آشنایی با خدمات و شروع همکاری، پیامتان را ارسال کنید
            </div>
            <div className="text-accent font-medium text-sm">ارسال درخواست ←</div>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="p-8 text-center text-[11px] text-text-faint relative z-10">
        contact@tywincapital.com · © ۱۴۰۴
      </div>
    </div>
  );
}
