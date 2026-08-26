"use client";

import {
  CheckCircle2,
  Copy,
  ExternalLink,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  X,
  XCircle,
} from "lucide-react";
import {
  fmtDate,
  hueOf,
  initials,
  inputCls,
  type Member,
  type Team,
} from "./shared";

interface Props {
  team: Team | null;
  editing: boolean;
  editTeam: Team | null;
  saving: boolean;
  deleting: boolean;
  confirmDelete: boolean;
  onClose: () => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSave: () => void;
  onQuickStatus: (t: Team, s: Team["payment_status"]) => void;
  onDelete: () => void;
  setConfirmDelete: (v: boolean) => void;
  onCopy: (t: string) => void;
  onShot: (url: string) => void;
  upd: (patch: Partial<Team>) => void;
  updMember: (i: number, patch: Partial<Member>) => void;
  addMember: () => void;
  removeMember: (i: number) => void;
}

export default function TeamDrawer(p: Props) {
  const t = p.editing && p.editTeam ? p.editTeam : p.team;
  if (!t) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-[2px]"
        onClick={p.onClose}
      />
      <aside className="fixed right-0 top-0 z-[90] flex h-full w-full max-w-[540px] flex-col border-l border-white/[0.07] bg-[#0B0810] shadow-[-40px_0_80px_rgba(0,0,0,0.5)]">
        {/* header */}
        <div className="flex items-start justify-between border-b border-white/[0.06] px-7 py-6">
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-600">
              team record
            </p>
            <h2 className="mt-1.5 truncate text-2xl font-semibold tracking-tight text-zinc-50">
              {t.team_name}
            </h2>
            <div className="mt-2 flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${
                  t.payment_status === "verified"
                    ? "bg-emerald-400"
                    : t.payment_status === "rejected"
                      ? "bg-rose-400"
                      : "bg-amber-300"
                }`}
              />
              <span className="font-mono text-xs uppercase tracking-[0.15em] text-zinc-500">
                {t.payment_status} · {fmtDate(t.created_at)}
              </span>
            </div>
          </div>
          <button
            onClick={p.onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-white/[0.04] hover:text-zinc-200"
          >
            <X size={18} />
          </button>
        </div>

        {/* body */}
        <div className="flex-1 overflow-y-auto px-7 py-6">
          {p.editing && p.editTeam ? (
            <div className="space-y-5">
              <Section label="team">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Team name" value={p.editTeam.team_name} onChange={(v) => p.upd({ team_name: v })} />
                  <Field label="Amount (₹)" value={String(p.editTeam.amount)} onChange={(v) => p.upd({ amount: Number(v) || 0 })} />
                  <Field label="Leader name" value={p.editTeam.leader_name} onChange={(v) => p.upd({ leader_name: v })} />
                  <Field label="Leader phone" value={p.editTeam.leader_phone} onChange={(v) => p.upd({ leader_phone: v })} />
                  <Field label="Leader email" value={p.editTeam.leader_email} onChange={(v) => p.upd({ leader_email: v })} />
                  <Field label="Referral person" value={p.editTeam.college ?? ""} onChange={(v) => p.upd({ college: v })} />
                  <Field label="UTR / Txn ID" value={p.editTeam.utr ?? ""} onChange={(v) => p.upd({ utr: v })} />
                  <label className="block">
                    <span className="mb-1.5 block font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-600">
                      status
                    </span>
                    <select
                      value={p.editTeam.payment_status}
                      onChange={(e) =>
                        p.upd({ payment_status: e.target.value as Team["payment_status"] })
                      }
                      className={`${inputCls} cursor-pointer`}
                    >
                      <option value="pending">pending</option>
                      <option value="verified">verified</option>
                      <option value="rejected">rejected</option>
                    </select>
                  </label>
                </div>
                <label className="mt-3 block">
                  <span className="mb-1.5 block font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-600">
                    notes
                  </span>
                  <textarea
                    value={p.editTeam.notes ?? ""}
                    onChange={(e) => p.upd({ notes: e.target.value })}
                    rows={2}
                    placeholder="internal notes…"
                    className={`${inputCls} resize-none`}
                  />
                </label>
              </Section>

              <Section
                label={`members (${p.editTeam.members.length})`}
                action={
                  <button
                    onClick={p.addMember}
                    className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.2em] text-violet-300 hover:text-violet-200"
                  >
                    <Plus size={11} /> add
                  </button>
                }
              >
                <div className="space-y-2">
                  {p.editTeam.members.map((m, i) => (
                    <div key={i} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-600">
                          member {String(i + 1).padStart(2, "0")}
                        </span>
                        <button
                          onClick={() => p.removeMember(i)}
                          className="text-zinc-600 transition-colors hover:text-rose-300"
                        >
                          <X size={13} />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input value={m.name} onChange={(e) => p.updMember(i, { name: e.target.value })} placeholder="Name" className={inputCls} />
                        <input value={m.email} onChange={(e) => p.updMember(i, { email: e.target.value })} placeholder="Email" className={inputCls} />
                        <input value={m.phone} onChange={(e) => p.updMember(i, { phone: e.target.value })} placeholder="Phone" className={`${inputCls} col-span-2`} />
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            </div>
          ) : (
            <div className="space-y-6">
              <Section label="leader">
                <div className="flex items-center gap-4">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold text-white"
                    style={{
                      background: `linear-gradient(135deg, hsl(${hueOf(t.leader_name)} 55% 32%), hsl(${hueOf(t.leader_name) + 40} 55% 22%))`,
                    }}
                  >
                    {initials(t.leader_name)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-medium text-zinc-100">{t.leader_name}</p>
                    <a href={`mailto:${t.leader_email}`} className="block truncate text-[13px] text-violet-300/80 hover:underline">
                      {t.leader_email}
                    </a>
                  </div>
                  <div className="flex-1" />
                  <span className="text-[13px] text-zinc-400">{t.leader_phone}</span>
                </div>
                {t.college && (
                  <p className="mt-3.5 text-[13px] text-zinc-500">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600">referral · </span>
                    {t.college}
                  </p>
                )}
              </Section>

              <Section label={`members (${t.members.length})`}>
                <div className="space-y-1">
                  {t.members.map((m, i) => (
                    <div key={m.id ?? i} className="flex items-center gap-3.5 rounded-lg px-2 py-2.5 transition-colors hover:bg-white/[0.02]">
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white"
                        style={{
                          background: `linear-gradient(135deg, hsl(${hueOf(m.name)} 55% 32%), hsl(${hueOf(m.name) + 40} 55% 22%))`,
                        }}
                      >
                        {initials(m.name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[15px] font-medium text-zinc-200">
                          {m.name}
                          {m.email === t.leader_email && (
                            <span className="ml-2 rounded border border-violet-400/25 px-1.5 py-px font-mono text-[10px] uppercase tracking-wider text-violet-300">
                              lead
                            </span>
                          )}
                        </p>
                        <p className="truncate text-xs text-zinc-600">{m.email} · {m.phone}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>

              <Section label="payment">
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="font-mono text-3xl font-semibold tabular-nums text-emerald-300">
                      ₹{t.amount}
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          t.payment_status === "verified"
                            ? "bg-emerald-400"
                            : t.payment_status === "rejected"
                              ? "bg-rose-400"
                              : "bg-amber-300"
                        }`}
                      />
                      <span className="font-mono text-xs uppercase tracking-[0.15em] text-zinc-400">
                        {t.payment_status}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4 flex items-center gap-2">
                    <code className="min-w-0 flex-1 truncate rounded-md bg-white/[0.04] px-3 py-2 font-mono text-sm text-zinc-300">
                      {t.utr || "no UTR"}
                    </code>
                    {t.utr && (
                      <button
                        onClick={() => p.onCopy(t.utr!)}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-white/[0.05] hover:text-zinc-200"
                      >
                        <Copy size={14} />
                      </button>
                    )}
                  </div>

                  {t.screenshot_url ? (
                    <button
                      onClick={() => p.onShot(t.screenshot_url!)}
                      className="group relative mb-3 block w-full overflow-hidden rounded-lg border border-white/[0.07]"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={t.screenshot_url}
                        alt="Payment proof"
                        className="h-36 w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2 text-left font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-300">
                        view full screenshot →
                      </span>
                    </button>
                  ) : (
                    <p className="mb-3 rounded-lg border border-dashed border-white/[0.08] px-3 py-4 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-700">
                      no screenshot uploaded
                    </p>
                  )}

                  <div className="flex gap-2.5">
                    <button
                      onClick={() => p.onQuickStatus(t, "verified")}
                      disabled={t.payment_status === "verified"}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-400/10 py-2.5 text-sm font-semibold text-emerald-300 transition-colors hover:bg-emerald-400/20 disabled:cursor-default disabled:opacity-35"
                    >
                      <CheckCircle2 size={15} /> Verify
                    </button>
                    <button
                      onClick={() => p.onQuickStatus(t, "rejected")}
                      disabled={t.payment_status === "rejected"}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-rose-400/10 py-2.5 text-sm font-semibold text-rose-300 transition-colors hover:bg-rose-400/20 disabled:cursor-default disabled:opacity-35"
                    >
                      <XCircle size={15} /> Reject
                    </button>
                  </div>
                </div>
              </Section>

              {t.notes && (
                <Section label="notes">
                  <p className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-[13px] leading-relaxed text-zinc-400">
                    {t.notes}
                  </p>
                </Section>
              )}
            </div>
          )}
        </div>

        {/* footer */}
        <div className="border-t border-white/[0.06] px-7 py-5">
          {p.editing ? (
            <div className="flex gap-2.5">
              <button
                onClick={p.onSave}
                disabled={p.saving}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-zinc-100 py-3 text-[15px] font-semibold text-zinc-900 transition-colors hover:bg-white disabled:opacity-50"
              >
                {p.saving ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
                Save changes
              </button>
              <button
                onClick={p.onCancelEdit}
                className="rounded-lg border border-white/[0.1] px-6 text-[15px] text-zinc-300 transition-colors hover:bg-white/[0.04]"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex gap-2.5">
              <button
                onClick={p.onStartEdit}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/[0.1] py-3 text-sm font-medium text-zinc-200 transition-colors hover:bg-white/[0.04]"
              >
                <Pencil size={14} /> Edit record
              </button>
              {p.confirmDelete ? (
                <button
                  onClick={p.onDelete}
                  disabled={p.deleting}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-rose-500/90 py-3 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {p.deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  Confirm delete
                </button>
              ) : (
                <button
                  onClick={() => p.setConfirmDelete(true)}
                  className="flex items-center justify-center gap-2 rounded-lg border border-white/[0.1] px-5 text-sm text-zinc-500 transition-colors hover:border-rose-400/40 hover:text-rose-300"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          )}
          {p.confirmDelete && !p.editing && (
            <button
              onClick={() => p.setConfirmDelete(false)}
              className="mt-2 w-full text-center font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-700 hover:text-zinc-500"
            >
              cancel
            </button>
          )}
          <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-800">
            id {t.id.slice(0, 12)} · updated {fmtDate(t.updated_at)}
          </p>
        </div>
      </aside>
    </>
  );
}

function Section({
  label,
  action,
  children,
}: {
  label: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-500">{label}</p>
        {action}
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-600">
        {label}
      </span>
      <input value={value} onChange={(e) => onChange(e.target.value)} className={inputCls} />
    </label>
  );
}
