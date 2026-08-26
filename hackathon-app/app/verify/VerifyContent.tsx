"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle, Clock, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface TeamData {
  team_name: string;
  leader_name: string;
  leader_email: string;
  leader_phone: string;
  college: string;
  team_size: number;
  payment_status: string;
  amount: number;
  members: { name: string; email: string }[];
}

export default function VerifyContent() {
  const searchParams = useSearchParams();
  const teamId = searchParams.get("team_id");
  const [team, setTeam] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!teamId) {
      setError("No team ID provided");
      setLoading(false);
      return;
    }

    const verify = async () => {
      try {
        const { data, error: rpcErr } = await supabase.rpc("verify_team", {
          p_team_id: teamId,
        });
        if (rpcErr) throw rpcErr;
        if (!data) {
          setError("Team not found");
        } else {
          setTeam(data as TeamData);
        }
      } catch {
        setError("Failed to verify team");
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [teamId]);

  const statusConfig = {
    verified: {
      icon: CheckCircle2,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
      border: "border-emerald-400/30",
      label: "VERIFIED",
      message: "This team is officially confirmed for GalxeCode '26!",
    },
    pending: {
      icon: Clock,
      color: "text-amber-400",
      bg: "bg-amber-400/10",
      border: "border-amber-400/30",
      label: "PENDING",
      message: "Payment is under verification. Please wait.",
    },
    rejected: {
      icon: XCircle,
      color: "text-rose-400",
      bg: "bg-rose-400/10",
      border: "border-rose-400/30",
      label: "REJECTED",
      message: "Payment was not approved. Contact organizers.",
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060309] flex items-center justify-center">
        <div className="text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-purple-400 border-t-transparent mx-auto mb-4" />
          <p className="text-zinc-400 text-sm">Verifying team...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#060309] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <XCircle size={56} className="mx-auto mb-5 text-rose-400" />
          <h1 className="text-2xl font-bold text-white mb-3">Verification Failed</h1>
          <p className="text-zinc-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!team) return null;

  const status = statusConfig[team.payment_status as keyof typeof statusConfig] || statusConfig.pending;
  const StatusIcon = status.icon;

  return (
    <div className="min-h-screen bg-[#060309] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="h-10 w-10 overflow-hidden rounded-lg border border-white/[0.08]">
              <img src="/header-logo.png" alt="GalxeCode" className="h-full w-full object-cover" />
            </div>
            <span className="text-sm font-semibold text-zinc-300 tracking-tight">GalxeCode &apos;26</span>
          </div>
        </div>

        <div className={`rounded-2xl border ${status.border} ${status.bg} p-6 mb-6`}>
          <div className="flex items-center gap-4 mb-4">
            <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${status.bg}`}>
              <StatusIcon size={28} className={status.color} />
            </div>
            <div>
              <p className={`font-mono text-xs tracking-[0.2em] ${status.color}`}>{status.label}</p>
              <p className="text-white font-bold text-lg mt-0.5">{team.team_name}</p>
            </div>
          </div>
          <p className="text-zinc-400 text-sm">{status.message}</p>
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck size={16} className="text-purple-400" />
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">Team Details</p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-zinc-500 text-sm">Leader</span>
              <span className="text-white text-sm font-medium">{team.leader_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500 text-sm">Email</span>
              <span className="text-zinc-300 text-sm">{team.leader_email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500 text-sm">Phone</span>
              <span className="text-zinc-300 text-sm">{team.leader_phone}</span>
            </div>
            {team.college && (
              <div className="flex justify-between">
                <span className="text-zinc-500 text-sm">College</span>
                <span className="text-zinc-300 text-sm">{team.college}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-zinc-500 text-sm">Team Size</span>
              <span className="text-zinc-300 text-sm">{team.team_size} members</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500 text-sm">Amount Paid</span>
              <span className="text-white text-sm font-semibold">₹{team.amount}</span>
            </div>
          </div>

          {team.members.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/[0.06]">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-3">Members</p>
              <div className="space-y-2">
                {team.members.map((m, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-purple-400">[{String(i + 1).padStart(2, "0")}]</span>
                    <span className="text-zinc-300 text-sm">{m.name}</span>
                    <span className="text-zinc-600 text-xs">· {m.email}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-zinc-600 text-xs mt-6">
          GalxeCode &apos;26 — AI Vibe Coding Hackathon · Pune
        </p>
      </div>
    </div>
  );
}
