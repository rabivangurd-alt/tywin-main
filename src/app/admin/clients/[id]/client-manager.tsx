"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ClientManager({ client, contracts, transactions }: any) {
  const router = useRouter();
  const [tab, setTab] = useState<"overview" | "contracts" | "transactions">("overview");

  // Modals
  const [showContractModal, setShowContractModal] = useState(false);
  const [showTxModal, setShowTxModal] = useState(false);
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [editingContract, setEditingContract] = useState<any>(null);

  const totalBalance = contracts.reduce((s: number, c: any) => s + Number(c.current_balance || 0), 0);
  const totalInitial = contracts.reduce((s: number, c: any) => s + Number(c.initial_capital || 0), 0);
  const totalProfit = totalBalance - totalInitial;
  const profitPct = totalInitial > 0 ? (totalProfit / totalInitial) * 100 : 0;

  return (
    <div>
      {/* Header */}
      <div className="rounded-2xl p-6 border border-line mb-5 flex gap-5 items-center flex-wrap"
        style={{ background: "linear-gradient(135deg,rgba(201,169,97,0.04),transparent),linear-gradient(180deg,#0F0F11,#0A0A0B)" }}>
        <div className="w-16 h-16 rounded-2xl bg-tint-2 grid place-items-center text-accent font-semibold text-2xl">
          {client.full_name?.charAt(0) || "?"}
        </div>
        <div className="flex-1 min-w-[200px]">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xl font-medium">{client.full_name || "بدون نام"}</span>
            <StatusBadge status={client.status} />
          </div>
          <div className="text-sm text-text-dim mt-1.5 flex gap-3 flex-wrap">
            <span>{client.email}</span>
            {client.phone && <><span>·</span><span className="num">{client.phone}</span></>}
          </div>
        </div>
        <Link href={`/admin/kyc/${client.id}`}
          className="px-4 py-2.5 rounded-xl text-xs border border-line-strong bg-tint text-text">
          ⚖ مدیریت KYC
        </Link>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        <Kpi label="موجودی کل" value={`$${totalBalance.toLocaleString()}`} accent />
        <Kpi label="سرمایه اولیه" value={`$${totalInitial.toLocaleString()}`} />
        <Kpi label="سود/زیان" value={`${totalProfit >= 0 ? "+" : ""}$${totalProfit.toLocaleString()}`} color={totalProfit >= 0 ? "up" : "down"} />
        <Kpi label="بازده" value={`${profitPct >= 0 ? "+" : ""}${profitPct.toFixed(2)}%`} color={totalProfit >= 0 ? "up" : "down"} />
      </div>

      {/* Quick actions */}
      <div className="flex gap-2 mb-5 flex-wrap">
        <button onClick={() => { setEditingContract(null); setShowContractModal(true); }}
          className="px-4 py-2.5 rounded-xl text-xs text-[#0A0A0B] font-semibold"
          style={{ background: "linear-gradient(135deg,#C9A961,#8B7338)" }}>
          + قرارداد جدید
        </button>
        <button onClick={() => setShowTxModal(true)} disabled={contracts.length === 0}
          className="px-4 py-2.5 rounded-xl text-xs border border-line-strong bg-tint text-text disabled:opacity-40">
          + ثبت تراکنش
        </button>
        <button onClick={() => setShowBalanceModal(true)} disabled={contracts.length === 0}
          className="px-4 py-2.5 rounded-xl text-xs border border-line-strong bg-tint text-text disabled:opacity-40">
          ✎ ویرایش موجودی
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5 border-b border-line">
        {[["overview", "نمای کلی"], ["contracts", `قراردادها (${contracts.length})`], ["transactions", `تراکنش‌ها (${transactions.length})`]].map(([k, label]) => (
          <button key={k} onClick={() => setTab(k as any)}
            className={`px-4 py-2.5 text-sm border-b-2 -mb-px ${tab === k ? "border-accent text-accent" : "border-transparent text-text-dim"}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "overview" && (
        <OverviewTab client={client} contracts={contracts} transactions={transactions} />
      )}
      {tab === "contracts" && (
        <ContractsTab contracts={contracts}
          onEdit={(c: any) => { setEditingContract(c); setShowContractModal(true); }} />
      )}
      {tab === "transactions" && (
        <TransactionsTab transactions={transactions} contracts={contracts} />
      )}

      {/* Modals */}
      {showContractModal && (
        <ContractModal client={client} contract={editingContract}
          onClose={() => setShowContractModal(false)}
          onSaved={() => { setShowContractModal(false); router.refresh(); }} />
      )}
      {showTxModal && (
        <TransactionModal contracts={contracts}
          onClose={() => setShowTxModal(false)}
          onSaved={() => { setShowTxModal(false); router.refresh(); }} />
      )}
      {showBalanceModal && (
        <BalanceModal contracts={contracts}
          onClose={() => setShowBalanceModal(false)}
          onSaved={() => { setShowBalanceModal(false); router.refresh(); }} />
      )}
    </div>
  );
}

// ============ Overview Tab ============
function OverviewTab({ client, contracts, transactions }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div className="rounded-2xl border border-line bg-bg-2 p-6">
        <div className="text-sm font-medium mb-4">اطلاعات مشتری</div>
        <div className="space-y-3 text-sm">
          <Row label="نام" value={client.full_name || "—"} />
          <Row label="ایمیل" value={client.email} />
          <Row label="تلفن" value={client.phone || "—"} mono />
          <Row label="کد ملی" value={client.national_id || "—"} mono />
          <Row label="وضعیت" value={client.status} />
          <Row label="احراز هویت" value={client.kyc_verified ? "✓ تأیید شده" : "در انتظار"} />
          <Row label="تاریخ عضویت" value={new Date(client.created_at).toLocaleDateString("fa-IR")} />
        </div>
      </div>
      <div className="rounded-2xl border border-line bg-bg-2 p-6">
        <div className="text-sm font-medium mb-4">خلاصه فعالیت</div>
        <div className="space-y-3 text-sm">
          <Row label="تعداد قراردادها" value={String(contracts.length)} />
          <Row label="قراردادهای فعال" value={String(contracts.filter((c: any) => c.status === "active").length)} />
          <Row label="تعداد تراکنش‌ها" value={String(transactions.length)} />
          <Row label="کل واریز" value={`$${transactions.filter((t: any) => t.type === "deposit").reduce((s: number, t: any) => s + Number(t.amount), 0).toLocaleString()}`} />
          <Row label="کل برداشت" value={`$${transactions.filter((t: any) => t.type === "withdrawal").reduce((s: number, t: any) => s + Number(t.amount), 0).toLocaleString()}`} />
        </div>
      </div>
    </div>
  );
}

// ============ Contracts Tab ============
function ContractsTab({ contracts, onEdit }: any) {
  if (contracts.length === 0) {
    return <Empty icon="📄" text="هنوز قراردادی ندارد" sub="با دکمه «قرارداد جدید» اولین قرارداد را بسازید" />;
  }
  return (
    <div className="space-y-3">
      {contracts.map((c: any) => {
        const init = Number(c.initial_capital);
        const curr = Number(c.current_balance || 0);
        const profit = curr - init;
        const pct = init > 0 ? (profit / init * 100) : 0;
        return (
          <div key={c.id} className="rounded-2xl border border-line p-5 bg-bg-2">
            <div className="flex justify-between items-start mb-4 flex-wrap gap-3">
              <div>
                <div className="text-xs text-text-faint num">{c.contract_number}</div>
                <div className="text-base font-medium mt-1">شروع: {new Date(c.start_date).toLocaleDateString("fa-IR")}</div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={c.status} />
                <button onClick={() => onEdit(c)}
                  className="px-3 py-1.5 rounded-lg text-xs border border-line-strong bg-tint text-accent">
                  ✎ ویرایش
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-line pt-4">
              <MiniStat label="سرمایه اولیه" value={`$${init.toLocaleString()}`} />
              <MiniStat label="موجودی فعلی" value={`$${curr.toLocaleString()}`} accent />
              <MiniStat label="سود/زیان" value={`${profit >= 0 ? "+" : ""}$${profit.toLocaleString()}`} color={profit >= 0 ? "up" : "down"} />
              <MiniStat label="سهم سود مدیر" value={`${c.profit_share_pct}%`} />
            </div>
            {c.notes && <div className="mt-4 pt-3 border-t border-line text-xs text-text-dim">یادداشت: {c.notes}</div>}
          </div>
        );
      })}
    </div>
  );
}

// ============ Transactions Tab ============
function TransactionsTab({ transactions, contracts }: any) {
  if (transactions.length === 0) {
    return <Empty icon="💱" text="تراکنشی ثبت نشده" sub="با دکمه «ثبت تراکنش» واریز یا برداشت ثبت کنید" />;
  }
  const contractNum = (id: string) => contracts.find((c: any) => c.id === id)?.contract_number || "—";
  return (
    <div className="rounded-2xl border border-line overflow-hidden bg-bg-2">
      <table className="w-full">
        <thead style={{ background: "rgba(201,169,97,0.04)" }}>
          <tr className="text-[10px] text-text-dim tracking-wider uppercase">
            <th className="p-4 text-right">تاریخ</th>
            <th className="p-4 text-right">نوع</th>
            <th className="p-4 text-right">قرارداد</th>
            <th className="p-4 text-right">مبلغ</th>
            <th className="p-4 text-right">وضعیت</th>
            <th className="p-4 text-right">توضیح</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t: any) => (
            <tr key={t.id} className="border-t border-line text-sm">
              <td className="p-4 text-xs text-text-dim">{new Date(t.transaction_date).toLocaleDateString("fa-IR")}</td>
              <td className="p-4 text-xs">{txTypeLabel(t.type)}</td>
              <td className="p-4 text-xs text-text-faint num">{contractNum(t.contract_id)}</td>
              <td className={`p-4 num text-sm ${t.type === "deposit" || t.type === "profit" ? "text-up" : t.type === "withdrawal" || t.type === "loss" ? "text-down" : ""}`}>
                {t.type === "deposit" || t.type === "profit" ? "+" : t.type === "withdrawal" || t.type === "loss" ? "-" : ""}${Number(t.amount).toLocaleString()}
              </td>
              <td className="p-4"><TxStatus status={t.status} /></td>
              <td className="p-4 text-xs text-text-dim">{t.description || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============ Contract Modal ============
function ContractModal({ client, contract, onClose, onSaved }: any) {
  const isEdit = !!contract;
  const [form, setForm] = useState({
    initial_capital: contract?.initial_capital || "",
    current_balance: contract?.current_balance ?? contract?.initial_capital ?? "",
    profit_share_pct: contract?.profit_share_pct || "20",
    risk_level: contract?.risk_level || "medium",
    start_date: contract?.start_date || new Date().toISOString().split("T")[0],
    status: contract?.status || "active",
    notes: contract?.notes || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const save = async () => {
    if (!form.initial_capital || Number(form.initial_capital) <= 0) {
      setError("سرمایه اولیه باید بزرگتر از صفر باشد");
      return;
    }
    setLoading(true); setError("");
    const supabase = createClient();

    if (isEdit) {
      const { error } = await supabase.from("contracts").update({
        initial_capital: Number(form.initial_capital),
        current_balance: Number(form.current_balance),
        profit_share_pct: Number(form.profit_share_pct),
        risk_level: form.risk_level,
        start_date: form.start_date,
        status: form.status,
        notes: form.notes,
        updated_at: new Date().toISOString(),
      }).eq("id", contract.id);
      if (error) { setError(error.message); setLoading(false); return; }
    } else {
      // Generate contract number
      const num = "TC-" + Date.now().toString().slice(-8);
      const { error } = await supabase.from("contracts").insert({
        contract_number: num,
        client_id: client.id,
        initial_capital: Number(form.initial_capital),
        current_balance: Number(form.current_balance || form.initial_capital),
        currency: "USD",
        profit_share_pct: Number(form.profit_share_pct),
        risk_level: form.risk_level,
        start_date: form.start_date,
        status: form.status,
        notes: form.notes,
      });
      if (error) { setError(error.message); setLoading(false); return; }
    }
    setLoading(false);
    onSaved();
  };

  return (
    <Modal title={isEdit ? "ویرایش قرارداد" : "قرارداد جدید"} onClose={onClose}>
      {error && <ErrorBox msg={error} />}
      <div className="space-y-4">
        <Field label="سرمایه اولیه ($)" type="number" value={form.initial_capital}
          onChange={(v) => setForm({ ...form, initial_capital: v })} />
        <Field label="موجودی فعلی ($)" type="number" value={form.current_balance}
          onChange={(v) => setForm({ ...form, current_balance: v })}
          hint="معمولاً برابر سرمایه اولیه است؛ بعداً با سود/زیان تغییر می‌کند" />
        <Field label="سهم سود مدیر (%)" type="number" value={form.profit_share_pct}
          onChange={(v) => setForm({ ...form, profit_share_pct: v })} />
        <SelectField label="سطح ریسک" value={form.risk_level}
          onChange={(v) => setForm({ ...form, risk_level: v })}
          options={[["low", "کم"], ["medium", "متوسط"], ["high", "زیاد"]]} />
        <Field label="تاریخ شروع" type="date" value={form.start_date}
          onChange={(v) => setForm({ ...form, start_date: v })} />
        <SelectField label="وضعیت" value={form.status}
          onChange={(v) => setForm({ ...form, status: v })}
          options={[["active", "فعال"], ["paused", "متوقف"], ["closed", "بسته"]]} />
        <div>
          <label className="block text-[11px] text-text-dim tracking-wider mb-2 uppercase">یادداشت</label>
          <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
            rows={2} className="w-full bg-bg border border-line rounded-xl px-4 py-3 text-sm outline-none focus:border-accent resize-none" />
        </div>
      </div>
      <ModalActions loading={loading} onClose={onClose} onSave={save}
        saveLabel={isEdit ? "ذخیره تغییرات" : "ساخت قرارداد"} />
    </Modal>
  );
}

// ============ Transaction Modal ============
function TransactionModal({ contracts, onClose, onSaved }: any) {
  const [form, setForm] = useState({
    contract_id: contracts[0]?.id || "",
    type: "deposit",
    amount: "",
    transaction_date: new Date().toISOString().split("T")[0],
    description: "",
    adjustBalance: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const save = async () => {
    if (!form.contract_id) { setError("قرارداد را انتخاب کنید"); return; }
    if (!form.amount || Number(form.amount) <= 0) { setError("مبلغ باید بزرگتر از صفر باشد"); return; }
    setLoading(true); setError("");
    const supabase = createClient();

    const { error: txErr } = await supabase.from("capital_transactions").insert({
      contract_id: form.contract_id,
      type: form.type,
      amount: Number(form.amount),
      currency: "USD",
      status: "completed",
      transaction_date: form.transaction_date,
      description: form.description,
    });
    if (txErr) { setError(txErr.message); setLoading(false); return; }

    // Adjust contract balance if requested
    if (form.adjustBalance) {
      const contract = contracts.find((c: any) => c.id === form.contract_id);
      const cur = Number(contract.current_balance || 0);
      const amt = Number(form.amount);
      const isPlus = form.type === "deposit" || form.type === "profit";
      const newBalance = isPlus ? cur + amt : cur - amt;
      await supabase.from("contracts").update({
        current_balance: newBalance, updated_at: new Date().toISOString(),
      }).eq("id", form.contract_id);
    }

    setLoading(false);
    onSaved();
  };

  return (
    <Modal title="ثبت تراکنش" onClose={onClose}>
      {error && <ErrorBox msg={error} />}
      <div className="space-y-4">
        <SelectField label="قرارداد" value={form.contract_id}
          onChange={(v) => setForm({ ...form, contract_id: v })}
          options={contracts.map((c: any) => [c.id, `${c.contract_number} ($${Number(c.current_balance).toLocaleString()})`])} />
        <SelectField label="نوع تراکنش" value={form.type}
          onChange={(v) => setForm({ ...form, type: v })}
          options={[["deposit", "واریز (+)"], ["withdrawal", "برداشت (−)"], ["profit", "سود (+)"], ["loss", "زیان (−)"]]} />
        <Field label="مبلغ ($)" type="number" value={form.amount}
          onChange={(v) => setForm({ ...form, amount: v })} />
        <Field label="تاریخ" type="date" value={form.transaction_date}
          onChange={(v) => setForm({ ...form, transaction_date: v })} />
        <div>
          <label className="block text-[11px] text-text-dim tracking-wider mb-2 uppercase">توضیح</label>
          <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full bg-bg border border-line rounded-xl px-4 py-3 text-sm outline-none focus:border-accent" />
        </div>
        <label className="flex items-center gap-2.5 text-xs text-text-dim cursor-pointer">
          <input type="checkbox" checked={form.adjustBalance}
            onChange={(e) => setForm({ ...form, adjustBalance: e.target.checked })}
            className="accent-accent" />
          <span>موجودی قرارداد به‌طور خودکار به‌روز شود</span>
        </label>
      </div>
      <ModalActions loading={loading} onClose={onClose} onSave={save} saveLabel="ثبت تراکنش" />
    </Modal>
  );
}

// ============ Balance Modal ============
function BalanceModal({ contracts, onClose, onSaved }: any) {
  const [contractId, setContractId] = useState(contracts[0]?.id || "");
  const selected = contracts.find((c: any) => c.id === contractId);
  const [newBalance, setNewBalance] = useState(selected?.current_balance ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onContractChange = (id: string) => {
    setContractId(id);
    const c = contracts.find((x: any) => x.id === id);
    setNewBalance(c?.current_balance ?? "");
  };

  const save = async () => {
    if (newBalance === "" || Number(newBalance) < 0) { setError("موجودی نامعتبر است"); return; }
    setLoading(true); setError("");
    const supabase = createClient();
    const { error } = await supabase.from("contracts").update({
      current_balance: Number(newBalance), updated_at: new Date().toISOString(),
    }).eq("id", contractId);
    if (error) { setError(error.message); setLoading(false); return; }
    setLoading(false);
    onSaved();
  };

  return (
    <Modal title="ویرایش موجودی" onClose={onClose}>
      {error && <ErrorBox msg={error} />}
      <div className="space-y-4">
        <SelectField label="قرارداد" value={contractId} onChange={onContractChange}
          options={contracts.map((c: any) => [c.id, c.contract_number])} />
        {selected && (
          <div className="text-xs text-text-dim bg-tint rounded-lg p-3">
            موجودی فعلی: <span className="num text-accent">${Number(selected.current_balance).toLocaleString()}</span>
            {" · "}سرمایه اولیه: <span className="num">${Number(selected.initial_capital).toLocaleString()}</span>
          </div>
        )}
        <Field label="موجودی جدید ($)" type="number" value={newBalance}
          onChange={(v) => setNewBalance(v)}
          hint="این مقدار مستقیماً جایگزین موجودی فعلی می‌شود" />
      </div>
      <ModalActions loading={loading} onClose={onClose} onSave={save} saveLabel="ذخیره موجودی" />
    </Modal>
  );
}

// ============ Shared UI helpers ============

function Modal({ title, onClose, children }: any) {
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="rounded-2xl border border-line p-6 max-w-md w-full my-8"
        style={{ background: "linear-gradient(180deg,#0F0F11,#0A0A0B)" }}>
        <div className="flex justify-between items-center mb-5">
          <div className="text-lg font-medium">{title}</div>
          <button onClick={onClose} className="text-text-dim hover:text-text text-xl">×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ModalActions({ loading, onClose, onSave, saveLabel }: any) {
  return (
    <div className="flex gap-2 justify-end mt-6 pt-5 border-t border-line">
      <button onClick={onClose} className="px-4 py-2.5 rounded-lg text-xs text-text-dim border border-line">انصراف</button>
      <button onClick={onSave} disabled={loading}
        className="px-5 py-2.5 rounded-lg text-xs text-[#0A0A0B] font-semibold"
        style={{ background: "linear-gradient(135deg,#C9A961,#8B7338)" }}>
        {loading ? "در حال ذخیره..." : saveLabel}
      </button>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", hint }: any) {
  return (
    <div>
      <label className="block text-[11px] text-text-dim tracking-wider mb-2 uppercase">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
        dir={type === "number" ? "ltr" : undefined}
        className={`w-full bg-bg border border-line rounded-xl px-4 py-3 text-sm outline-none focus:border-accent ${type === "number" ? "text-right" : ""}`} />
      {hint && <div className="text-[10px] text-text-faint mt-1.5">{hint}</div>}
    </div>
  );
}

function SelectField({ label, value, onChange, options }: any) {
  return (
    <div>
      <label className="block text-[11px] text-text-dim tracking-wider mb-2 uppercase">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full bg-bg border border-line rounded-xl px-4 py-3 text-sm outline-none focus:border-accent cursor-pointer">
        {options.map(([v, l]: any) => <option key={v} value={v}>{l}</option>)}
      </select>
    </div>
  );
}

function ErrorBox({ msg }: any) {
  return (
    <div className="mb-4 p-3 rounded-lg text-xs text-down border"
      style={{ background: "rgba(201,122,107,0.1)", borderColor: "rgba(201,122,107,0.3)" }}>
      {msg}
    </div>
  );
}

function Kpi({ label, value, accent, color }: any) {
  const cls = color === "up" ? "text-up" : color === "down" ? "text-down" : accent ? "text-accent" : "";
  return (
    <div className="rounded-2xl p-5 border border-line bg-bg-2">
      <div className="text-[11px] text-text-dim mb-2">{label}</div>
      <div className={`text-xl font-semibold num ${cls}`}>{value}</div>
    </div>
  );
}

function MiniStat({ label, value, accent, color }: any) {
  const cls = color === "up" ? "text-up" : color === "down" ? "text-down" : accent ? "text-accent" : "";
  return (
    <div>
      <div className="text-[10px] text-text-dim tracking-wider mb-1.5 uppercase">{label}</div>
      <div className={`text-base font-medium num ${cls}`}>{value}</div>
    </div>
  );
}

function Row({ label, value, mono }: any) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-text-faint text-xs">{label}</span>
      <span className={mono ? "num" : ""}>{value}</span>
    </div>
  );
}

function Empty({ icon, text, sub }: any) {
  return (
    <div className="rounded-2xl border border-line p-16 text-center bg-bg-2">
      <div className="text-4xl mb-4 opacity-50">{icon}</div>
      <div className="text-base font-medium mb-2">{text}</div>
      <div className="text-xs text-text-dim">{sub}</div>
    </div>
  );
}

function StatusBadge({ status }: any) {
  const styles: any = {
    active: { bg: "rgba(107,174,124,0.12)", color: "#6BAE7C", label: "● فعال" },
    pending: { bg: "rgba(201,179,107,0.12)", color: "#C9B36B", label: "⏳ در انتظار" },
    rejected: { bg: "rgba(201,122,107,0.12)", color: "#C97A6B", label: "✕ رد شده" },
    suspended: { bg: "rgba(201,122,107,0.12)", color: "#C97A6B", label: "⛔ معلق" },
    closed: { bg: "rgba(138,133,123,0.12)", color: "#8A857B", label: "بسته" },
    paused: { bg: "rgba(201,179,107,0.12)", color: "#C9B36B", label: "⏸ متوقف" },
  };
  const s = styles[status] || styles.pending;
  return (
    <span className="text-[10px] px-2.5 py-1 rounded-md font-medium"
      style={{ background: s.bg, color: s.color, border: `1px solid ${s.color}40` }}>{s.label}</span>
  );
}

function TxStatus({ status }: any) {
  const styles: any = {
    completed: { bg: "rgba(107,174,124,0.12)", color: "#6BAE7C", label: "✓ تکمیل" },
    pending: { bg: "rgba(201,179,107,0.12)", color: "#C9B36B", label: "⏳ در انتظار" },
    rejected: { bg: "rgba(201,122,107,0.12)", color: "#C97A6B", label: "✕ رد" },
  };
  const s = styles[status] || styles.completed;
  return (
    <span className="text-[10px] px-2.5 py-1 rounded font-medium"
      style={{ background: s.bg, color: s.color, border: `1px solid ${s.color}40` }}>{s.label}</span>
  );
}

function txTypeLabel(type: string) {
  return { deposit: "↓ واریز", withdrawal: "↑ برداشت", profit: "✦ سود", loss: "▼ زیان" }[type] || type;
}
