"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ClientTopnav({ profile }: { profile: any }) {
  const pathname = usePathname();
  const initials = profile.full_name?.charAt(0) || "C";

  const tabs = [
    { href: "/dashboard", label: "داشبورد" },
    { href: "/contract", label: "قرارداد" },
    { href: "/transactions", label: "تراکنش‌ها" },
    { href: "/reports", label: "گزارش‌ها" },
    { href: "/tickets", label: "پیام‌ها" },
    { href: "/profile", label: "پروفایل" },
  ];

  return (
    <nav className="sticky top-0 z-10 py-4 border-b border-line backdrop-blur-xl"
      style={{ background: "linear-gradient(180deg,rgba(15,15,17,0.95),rgba(10,10,11,0.95))" }}>
      <div className="max-w-[1280px] mx-auto px-8 flex justify-between items-center">
        <Link href="/dashboard" className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl grid place-items-center text-[#0A0A0B] font-bold text-xl"
            style={{ background: "linear-gradient(135deg,#C9A961,#8B7338)" }}>T</div>
          <div>
            <div className="text-[15px] font-semibold">Tywin Capital</div>
            <div className="text-[9px] text-accent tracking-[2px] mt-0.5">PRIVATE WEALTH</div>
          </div>
        </Link>

        <div className="hidden md:flex gap-1.5">
          {tabs.map(t => {
            const active = pathname === t.href || (t.href !== "/dashboard" && pathname.startsWith(t.href));
            return (
              <Link key={t.href} href={t.href}
                className={`px-4 py-2 rounded-xl text-xs ${
                  active
                    ? "text-accent bg-tint-2 border border-line-strong"
                    : "text-text-dim hover:text-text hover:bg-tint border border-transparent"
                }`}>
                {t.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <form action="/api/auth/signout" method="POST">
            <button className="text-[11px] text-text-dim hover:text-down border border-line px-3 py-2 rounded-lg">
              خروج
            </button>
          </form>
          <div className="flex items-center gap-2.5 px-3.5 py-1 rounded-xl bg-tint border border-line">
            <div className="text-right">
              <div className="text-xs font-medium">{profile.full_name || "مشتری"}</div>
              <div className="text-[10px] text-text-faint tracking-wide">CLIENT</div>
            </div>
            <div className="w-8 h-8 rounded-lg bg-tint-2 grid place-items-center text-accent font-semibold text-xs">
              {initials}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
