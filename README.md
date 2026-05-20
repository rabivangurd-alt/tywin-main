# Tywin Capital — راهنمای راه‌اندازی

پنل مدیریت سرمایه خصوصی · Next.js 15 + Supabase + TypeScript

---

## 🚀 شروع کار (۵ دقیقه)

### پیش‌نیازها
- **Node.js 18.17+** نصب باشد. تست کن: `node --version`
- اگه نصب نیست، از https://nodejs.org دانلود کن (نسخه LTS)

### قدم ۱: نصب پکیج‌ها
داخل پوشه پروژه:
```bash
npm install
```
این چند دقیقه طول می‌کشه (حدود 300MB دانلود).

### قدم ۲: راه‌اندازی محلی
```bash
npm run dev
```
بعدش مرورگرت رو باز کن:
**http://localhost:3000**

تموم. سایت بالاست. 🎉

---

## 🔑 اولین ورود

### مهم: اولین قدم — ساخت حساب ادمین

۱. **ثبت‌نام کن** از طریق صفحه `/signup` با ایمیل خودت
۲. حساب در وضعیت `pending` ساخته می‌شه (در `/pending` می‌بینی)
۳. حالا برو به **Supabase Dashboard**:
   - https://supabase.com/dashboard/project/ppirgibkztigvuhqfcah/sql
   - یا از منوی پروژه `tywin-liberty` → SQL Editor
۴. این کوئری رو اجرا کن (ایمیلت رو جایگزین کن):
   ```sql
   SELECT public.promote_to_admin('your-email@example.com');
   ```
۵. حالا برو به `/login` و وارد شو → خودکار به `/admin` می‌ری

از این به بعد، می‌تونی هر کاربر جدیدی رو از پنل ادمین تأیید/رد کنی.

---

## 📁 ساختار پروژه

```
tywin-app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Landing (gateway)
│   │   ├── login/             # ورود
│   │   ├── signup/            # ثبت‌نام
│   │   ├── consultation/      # درخواست مشاوره
│   │   ├── pending/           # صفحه انتظار تأیید
│   │   │
│   │   ├── dashboard/         # داشبورد مشتری
│   │   ├── contract/          # قرارداد مشتری
│   │   ├── transactions/      # تراکنش‌ها
│   │   ├── tickets/           # پیام‌ها (لیست + چت)
│   │   ├── profile/           # پروفایل + KYC
│   │   ├── reports/           # گزارش‌ها
│   │   │
│   │   └── admin/             # پنل ادمین
│   │       ├── page.tsx       # داشبورد ادمین
│   │       ├── clients/       # مدیریت مشتری‌ها
│   │       ├── approvals/     # تأیید ثبت‌نام‌ها
│   │       ├── kyc/           # مدیریت KYC
│   │       ├── tickets/       # تیکت‌ها (ادمین)
│   │       └── reports/       # گزارش‌ها (ادمین)
│   │
│   ├── components/layout/     # Sidebar, Topnav
│   ├── lib/supabase/          # Supabase clients
│   └── middleware.ts          # Auth & role routing
│
├── .env.local                 # کلیدهای Supabase (✓ آماده)
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🗄 دیتابیس

Supabase Project: **tywin-liberty**
URL: https://ppirgibkztigvuhqfcah.supabase.co

### جدول‌های موجود
- `profiles` — کاربران + KYC + admin_message + kyc_verified
- `contracts` — قراردادها
- `capital_transactions` — تراکنش‌ها
- `performance_snapshots` — عملکرد روزانه
- `tickets` — تیکت‌ها
- `messages` — پیام‌ها (با `is_internal`)
- `audit_logs` — لاگ
- `app_settings` — تنظیمات

### Functions
- `is_admin()` — بررسی نقش
- `promote_to_admin(email)` — تبدیل کاربر به ادمین
- `handle_new_user()` — trigger خودکار برای ساخت profile

### Storage
- `avatars` (public, 2MB)
- `contracts` (private, 10MB PDF)
- `proofs` (private, 5MB) — مدارک KYC
- `ticket-attachments` (private, 10MB)

⚠ **اگه از kyc_documents و admin_message استفاده می‌کنی**، شاید لازم باشه این ستون‌ها رو به profiles اضافه کنی:

```sql
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS kyc_documents JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS kyc_verified BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS kyc_verified_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS admin_message TEXT;
```

برای جدول `reports` (اگه نداری):
```sql
CREATE TABLE IF NOT EXISTS reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT,
  period TEXT,
  file_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clients see own reports" ON reports FOR SELECT USING (auth.uid() = client_id OR public.is_admin());
CREATE POLICY "Admins manage reports" ON reports FOR ALL USING (public.is_admin());
```

---

## 🎨 رنگ‌ها

پالت Tywin (در `tailwind.config.ts`):
- **Background**: `#0A0A0B` (مشکی عمیق)
- **Accent**: `#C9A961` (طلایی)
- **Up (سود)**: `#6BAE7C`
- **Down (زیان)**: `#C97A6B`
- **Warning**: `#C9B36B`

---

## 🛠 دستورات مفید

```bash
npm run dev      # اجرا در حالت development (با hot-reload)
npm run build    # build کردن برای production
npm run start    # اجرای نسخه production (بعد از build)
npm run lint     # بررسی کد
```

---

## ⚙ مرحله‌ی بعدی: Deploy

وقتی آماده شدی برای deploy:

### Vercel (پیشنهادی):
1. کد رو در GitHub push کن
2. Vercel.com → New Project → از repo انتخاب
3. Environment Variables رو اضافه کن:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy → URL می‌گیری

---

## 🐛 رفع مشکلات رایج

**خطا "ETIMEDOUT" در نصب**: VPN روشن کن یا `npm install --registry=https://registry.npmmirror.com`

**Supabase خطا 401**: مطمئن شو `.env.local` درسته. سرور رو ری‌استارت کن (Ctrl+C و دوباره `npm run dev`).

**خطای middleware**: مطمئن شو در Supabase، RLS فعاله و policies درسته.

**ادمین نمی‌تونم بشم**: SQL Editor در Supabase → اجرا کن `SELECT public.promote_to_admin('email@example.com')`

---

## 📞 تماس

پروژه‌ی شخصی Tywin Capital
ساخته‌شده توسط Claude برای ارباب تایوین

قبله عالم ارباب تایوین 👑
