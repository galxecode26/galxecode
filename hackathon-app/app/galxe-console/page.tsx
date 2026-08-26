"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  Copy,
  Download,
  ExternalLink,
  Loader2,
  LogOut,
  ScanLine,
  Search,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import LoginGate from "@/components/admin/LoginGate";
import TeamDrawer from "@/components/admin/TeamDrawer";
import QRScanner from "@/components/admin/QRScanner";
import {
  emptyMember,
  fmtDate,
  hueOf,
  initials,
  type Member,
  type StatusFilter,
  type Team,
} from "@/components/admin/shared";

export default function ConsolePage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authing, setAuthing] = useState(false);

  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const [drawerTeam, setDrawerTeam] = useState<Team | null>(null);
  const [editing, setEditing] = useState(false);
  const [editTeam, setEditTeam] = useState<Team | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [shotUrl, setShotUrl] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  }, []);

  const loadTeams = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    setLoadError("");
    try {
      const { data, error } = await supabase.rpc("admin_list_teams");
      if (error) throw error;
      setTeams((data as Team[]) ?? []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load";
      setLoadError(msg);
      if (!silent && msg === "UNAUTHORIZED") {
        setAuthed(false);
        setAuthError("Session expired — log in again");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setAuthed(true);
        loadTeams();
      }
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        setAuthed(false);
        setTeams([]);
        setEmail("");
        setPassword("");
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [loadTeams]);

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setAuthing(true);
    setAuthError("");
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;
      setAuthed(true);
      loadTeams();
    } catch {
      setAuthError("Invalid email or password");
      setPassword("");
    } finally {
      setAuthing(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setConfirmLogout(false);
    setAuthed(false);
    setTeams([]);
  };

  const stats = useMemo(() => {
    const verified = teams.filter((t) => t.payment_status === "verified");
    return {
      teams: teams.length,
      members: teams.reduce((s, t) => s + t.members.length, 0),
      revenue: verified.reduce((s, t) => s + t.amount, 0),
      potential: teams.reduce((s, t) => s + t.amount, 0),
      pending: teams.filter((t) => t.payment_status === "pending").length,
      rejected: teams.filter((t) => t.payment_status === "rejected").length,
      colleges: new Set(teams.map((t) => t.college).filter(Boolean)).size,
    };
  }, [teams]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return teams.filter((t) => {
      if (statusFilter !== "all" && t.payment_status !== statusFilter) return false;
      if (!q) return true;
      return [
        t.team_name,
        t.leader_name,
        t.leader_email,
        t.leader_phone,
        t.utr,
        t.college,
        ...t.members.map((m) => `${m.name} ${m.email} ${m.college ?? ""}`),
      ]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [teams, search, statusFilter]);

  const openDrawer = (t: Team) => {
    setDrawerTeam(t);
    setEditing(false);
    setEditTeam(null);
    setConfirmDelete(false);
  };

  const closeDrawer = () => {
    setDrawerTeam(null);
    setEditing(false);
    setEditTeam(null);
    setConfirmDelete(false);
  };

  const startEdit = () => {
    if (!drawerTeam) return;
    setEditTeam(JSON.parse(JSON.stringify(drawerTeam)));
    setEditing(true);
  };

  const fireApprovalEmail = (teamId: string) => {
    supabase.functions
      .invoke("notify-approval", { body: { team_id: teamId } })
      .catch(() => {});
  };

  const saveEdit = async () => {
    if (!editTeam) return;
    setSaving(true);
    try {
      const statusChangedToVerified =
        editTeam.payment_status === "verified" &&
        drawerTeam?.payment_status !== "verified";
      const { error } = await supabase.rpc("admin_update_team", {
        p_id: editTeam.id,
        p_updates: {
          team_name: editTeam.team_name,
          leader_name: editTeam.leader_name,
          leader_email: editTeam.leader_email,
          leader_phone: editTeam.leader_phone,
          college: editTeam.college,
          team_size: editTeam.team_size,
          amount: editTeam.amount,
          utr: editTeam.utr,
          payment_status: editTeam.payment_status,
          notes: editTeam.notes,
        },
        p_members: editTeam.members.map((m, i) => ({
          name: m.name,
          email: m.email,
          phone: m.phone,
          college: m.college,
          position: i + 1,
        })),
      });
      if (error) throw error;
      if (statusChangedToVerified) fireApprovalEmail(editTeam.id);
      await loadTeams(true);
      closeDrawer();
      showToast(
        statusChangedToVerified
          ? "Verified — confirmation emails sent to all members"
          : "Changes saved"
      );
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const quickStatus = async (t: Team, status: Team["payment_status"]) => {
    try {
      const wasVerified = t.payment_status === "verified";
      const { error } = await supabase.rpc("admin_update_team", {
        p_id: t.id,
        p_updates: { payment_status: status },
      });
      if (error) throw error;
      if (status === "verified" && !wasVerified) fireApprovalEmail(t.id);
      setTeams((prev) =>
        prev.map((x) =>
          x.id === t.id
            ? { ...x, payment_status: status, updated_at: new Date().toISOString() }
            : x
        )
      );
      setDrawerTeam((d) => (d && d.id === t.id ? { ...d, payment_status: status } : d));
      showToast(
        status === "verified" && !wasVerified
          ? "Verified — confirmation emails sent to all members"
          : `Marked ${status}`
      );
    } catch {
      showToast("Failed to update");
    }
  };

  const removeTeam = async () => {
    if (!drawerTeam) return;
    setDeleting(true);
    try {
      const { error } = await supabase.rpc("admin_delete_team", {
        p_id: drawerTeam.id,
      });
      if (error) throw error;
      setTeams((prev) => prev.filter((t) => t.id !== drawerTeam.id));
      closeDrawer();
      showToast("Team deleted");
    } catch {
      showToast("Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast("Copied to clipboard");
  };

  const exportCsv = () => {
    const rows = [
      ["Team", "Leader", "Leader Email", "Leader Phone", "Referral", "Size", "Amount", "UTR", "Status", "Members", "Registered"],
      ...filtered.map((t) => [
        t.team_name,
        t.leader_name,
        t.leader_email,
        t.leader_phone,
        t.college ?? "",
        String(t.team_size),
        String(t.amount),
        t.utr ?? "",
        t.payment_status,
        t.members.map((m) => `${m.name} (${m.email})`).join(" | "),
        new Date(t.created_at).toISOString(),
      ]),
    ];
    const csv = rows
      .map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `galxecode-teams-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
    showToast("CSV exported");
  };

  const upd = (patch: Partial<Team>) =>
    setEditTeam((p) => (p ? { ...p, ...patch } : p));

  const updMember = (i: number, patch: Partial<Member>) =>
    setEditTeam((p) =>
      p
        ? { ...p, members: p.members.map((m, j) => (j === i ? { ...m, ...patch } : m)) }
        : p
    );

  const addMember = () =>
    setEditTeam((p) =>
      p
        ? {
            ...p,
            team_size: p.members.length + 1,
            members: [...p.members, emptyMember(p.members.length + 1)],
          }
        : p
    );

  const removeMember = (i: number) =>
    setEditTeam((p) =>
      p
        ? {
            ...p,
            team_size: p.members.length - 1,
            members: p.members.filter((_, j) => j !== i),
          }
        : p
    );

  if (!authed) {
    return (
      <LoginGate
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        error={authError}
        loading={authing}
        onSubmit={onLogin}
      />
    );
  }

  const filters: StatusFilter[] = ["all", "pending", "verified", "rejected"];

  return (
    <div className="min-h-screen bg-[#060309] text-zinc-100">
      {/* ===== main column ===== */}
      <div>
        {/* top bar */}
        <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#060309]/85 backdrop-blur-xl">
          <div className="mx-auto flex max-w-5xl items-center gap-3 px-6 py-3.5">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 overflow-hidden rounded-lg border border-white/[0.08]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/header-logo.png"
                  alt="GalxeCode"
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="text-sm font-semibold tracking-tight">Console</span>
            </div>
            <div className="relative min-w-0 flex-1 lg:max-w-[340px]">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search teams, members, UTR…"
                className="w-full rounded-lg border border-white/[0.07] bg-white/[0.03] py-2 pl-9 pr-3 text-[13px] outline-none transition-colors placeholder:text-zinc-600 focus:border-violet-400/40"
              />
            </div>
            <div className="flex-1" />

            <button
              onClick={() => setShowScanner(true)}
              title="Scan QR"
              className="flex h-8 items-center gap-1.5 rounded-lg border border-white/[0.08] px-3 text-xs text-zinc-400 transition-colors hover:bg-white/[0.04] hover:text-zinc-200"
            >
              <ScanLine size={13} />
              <span className="hidden sm:inline">Scan QR</span>
            </button>
            <button
              onClick={exportCsv}
              title="Export CSV"
              className="flex h-8 items-center gap-1.5 rounded-lg border border-white/[0.08] px-3 text-xs text-zinc-400 transition-colors hover:bg-white/[0.04] hover:text-zinc-200"
            >
              <Download size={13} />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button
              onClick={() => setConfirmLogout(true)}
              title="Log out"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-white/[0.04] hover:text-rose-300"
            >
              <LogOut size={14} />
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-6 pb-24">
          {/* ===== hero stats ===== */}
          <section className="flex flex-wrap items-end gap-x-12 gap-y-8 pt-10 pb-9">
            <div>
              <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-600">
                verified revenue
              </p>
              <p className="text-[52px] font-semibold leading-none tracking-tight tabular-nums text-zinc-50">
                ₹{stats.revenue.toLocaleString("en-IN")}
              </p>
              <p className="mt-3 text-[13px] text-zinc-500">
                of{" "}
                <span className="tabular-nums text-zinc-300">
                  ₹{stats.potential.toLocaleString("en-IN")}
                </span>{" "}
                total · {stats.pending} awaiting verification
              </p>
            </div>
            <div className="hidden h-16 w-px bg-white/[0.07] sm:block" />
            {[
              { label: "teams", value: stats.teams, sub: `${stats.colleges} colleges` },
              { label: "members", value: stats.members, sub: "registered" },
              { label: "pending", value: stats.pending, sub: `${stats.rejected} rejected` },
            ].map((s) => (
              <div key={s.label}>
                <p className="mb-2.5 font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-600">
                  {s.label}
                </p>
                <p className="text-[34px] font-semibold leading-none tracking-tight tabular-nums text-zinc-200">
                  {s.value}
                </p>
                <p className="mt-2.5 text-[13px] text-zinc-600">{s.sub}</p>
              </div>
            ))}
          </section>

          {/* ===== filter row ===== */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] pt-5">
            <div className="flex rounded-lg border border-white/[0.07] bg-white/[0.02] p-0.5">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={`rounded-[7px] px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.15em] transition-colors ${
                    statusFilter === f
                      ? "bg-white/[0.07] text-zinc-100"
                      : "text-zinc-600 hover:text-zinc-400"
                  }`}
                >
                  {f}
                  {f !== "all" && (
                    <span className="ml-1.5 tabular-nums">
                      {teams.filter((t) => t.payment_status === f).length}
                    </span>
                  )}
                </button>
              ))}
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600">
              {filtered.length} of {teams.length} shown
            </p>
          </div>

          {loadError && (
            <div className="mt-5 rounded-lg border border-rose-400/20 bg-rose-400/[0.06] px-4 py-3 font-mono text-xs text-rose-300">
              {loadError}
            </div>
          )}

          {/* ===== table ===== */}
          <section className="mt-2">
            {!loading && filtered.length === 0 && !loadError && (
              <div className="py-24 text-center">
                <p className="font-mono text-xs text-zinc-600">
                  {teams.length === 0 ? "No registrations yet" : "No teams match your filters"}
                </p>
              </div>
            )}

            {filtered.length > 0 && (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    {["#", "Team", "Members", "Status", "UTR", "Amount", ""].map((h) => (
                      <th
                        key={h}
                        className={`py-3.5 pr-5 text-left font-mono text-[10px] font-medium uppercase tracking-[0.25em] text-zinc-600 ${
                          h === "Amount" ? "text-right" : ""
                        } ${h === "Members" ? "hidden sm:table-cell" : ""} ${
                          h === "UTR" ? "hidden md:table-cell" : ""
                        } ${h === "" ? "w-8" : ""} ${h === "#" ? "w-10" : ""}`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t, idx) => (
                    <tr
                      key={t.id}
                      onClick={() => openDrawer(t)}
                      className="group cursor-pointer border-b border-white/[0.04] transition-colors hover:bg-white/[0.02]"
                    >
                      {/* serial */}
                      <td className="py-4 pr-5 font-mono text-xs tabular-nums text-zinc-600">
                        #{String(idx + 1).padStart(2, "0")}
                      </td>
                      {/* team */}
                      <td className="py-4 pr-5">
                        <p className="text-[15.5px] font-medium text-zinc-100">{t.team_name}</p>
                        <p className="mt-1 truncate text-xs text-zinc-600">
                          {t.leader_name} · {t.college || "—"}
                        </p>
                      </td>
                      {/* members */}
                      <td className="hidden py-4 pr-5 sm:table-cell">
                        <div className="flex -space-x-2">
                          {t.members.slice(0, 3).map((m, i) => (
                            <div
                              key={m.id ?? i}
                              className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#060309] text-[9px] font-semibold text-white"
                              style={{
                                background: `linear-gradient(135deg, hsl(${hueOf(m.name)} 50% 30%), hsl(${hueOf(m.name) + 40} 50% 20%))`,
                              }}
                            >
                              {initials(m.name)}
                            </div>
                          ))}
                          {t.members.length > 3 && (
                            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#060309] bg-zinc-800 text-[9px] font-semibold text-zinc-400">
                              +{t.members.length - 3}
                            </div>
                          )}
                        </div>
                      </td>
                      {/* status */}
                      <td className="py-4 pr-5">
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
                          <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-300">
                            {t.payment_status}
                          </span>
                        </div>
                      </td>
                      {/* utr */}
                      <td className="hidden py-4 pr-5 md:table-cell">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (t.utr) copy(t.utr);
                          }}
                          className="flex items-center gap-1.5 font-mono text-xs text-zinc-400 transition-colors hover:text-zinc-200"
                        >
                          <span className="max-w-[130px] truncate">{t.utr || "—"}</span>
                          {t.utr && (
                            <Copy
                              size={12}
                              className="opacity-0 transition-opacity group-hover:opacity-60"
                            />
                          )}
                        </button>
                      </td>
                      {/* amount */}
                      <td className="py-4 pr-5 text-right font-mono text-sm font-medium tabular-nums text-zinc-100">
                        ₹{t.amount}
                      </td>
                      <td className="py-4 text-right">
                        <ChevronDown
                          size={15}
                          className="-rotate-90 text-zinc-700 transition-all group-hover:translate-x-0.5 group-hover:text-zinc-400"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </main>
      </div>

      {/* drawer */}
      {drawerTeam && (
        <TeamDrawer
          team={drawerTeam}
          editing={editing}
          editTeam={editTeam}
          saving={saving}
          deleting={deleting}
          confirmDelete={confirmDelete}
          onClose={closeDrawer}
          onStartEdit={startEdit}
          onCancelEdit={() => {
            setEditing(false);
            setEditTeam(null);
          }}
          onSave={saveEdit}
          onQuickStatus={quickStatus}
          onDelete={removeTeam}
          setConfirmDelete={setConfirmDelete}
          onCopy={copy}
          onShot={setShotUrl}
          upd={upd}
          updMember={updMember}
          addMember={addMember}
          removeMember={removeMember}
        />
      )}

      {/* screenshot modal */}
      {shotUrl && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/85 p-6 backdrop-blur-sm"
          onClick={() => setShotUrl(null)}
        >
          <div
            className="max-h-full w-full max-w-md overflow-hidden rounded-xl border border-white/[0.09] bg-[#0B0810]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3">
              <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-zinc-500">
                payment receipt
              </p>
              <div className="flex gap-1">
                <a
                  href={shotUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-white/[0.05] hover:text-zinc-200"
                >
                  <ExternalLink size={13} />
                </a>
                <button
                  onClick={() => setShotUrl(null)}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-white/[0.05] hover:text-zinc-200"
                >
                  <X size={13} />
                </button>
              </div>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={shotUrl}
              alt="Payment screenshot"
              className="max-h-[70vh] w-full object-contain"
            />
          </div>
        </div>
      )}

      {/* logout confirmation */}
      {confirmLogout && (
        <div
          className="fixed inset-0 z-[140] flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm"
          onClick={() => setConfirmLogout(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[320px] rounded-xl border border-white/[0.08] bg-[#0d0912] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.7)]"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-rose-400/20 bg-rose-400/[0.07]">
                <LogOut size={15} className="text-rose-300" />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-100">Log out?</p>
                <p className="mt-0.5 text-xs text-zinc-500">
                  You'll need to sign in again to access the console.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmLogout(false)}
                className="flex-1 rounded-lg border border-white/[0.08] py-2 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/[0.04]"
              >
                Cancel
              </button>
              <button
                onClick={logout}
                className="flex-1 rounded-lg bg-rose-500/90 py-2 text-xs font-semibold text-white transition-colors hover:bg-rose-500"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Scanner */}
      {showScanner && <QRScanner onClose={() => setShowScanner(false)} />}

      {/* toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-[130] flex -translate-x-1/2 items-center gap-2 rounded-lg border border-white/[0.1] bg-[#120E18] px-4 py-2.5 text-xs text-zinc-200 shadow-[0_12px_40px_rgba(0,0,0,0.6)]">
          <Check size={13} className="text-emerald-400" />
          {toast}
        </div>
      )}
    </div>
  );
}
