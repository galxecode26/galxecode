export interface Member {
  id?: string;
  name: string;
  email: string;
  phone: string;
  college: string | null;
  position: number;
}

export interface Team {
  id: string;
  team_name: string;
  leader_name: string;
  leader_email: string;
  leader_phone: string;
  college: string | null;
  team_size: number;
  amount: number;
  utr: string | null;
  payment_status: "pending" | "verified" | "rejected";
  screenshot_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  members: Member[];
}

export type StatusFilter = "all" | "pending" | "verified" | "rejected";

export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

export const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export const hueOf = (name: string) => {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) % 360;
  return h;
};

export const emptyMember = (pos: number): Member => ({
  name: "",
  email: "",
  phone: "",
  college: "",
  position: pos,
});

export const STATUS_DOT: Record<string, string> = {
  pending: "bg-amber-300",
  verified: "bg-emerald-400",
  rejected: "bg-rose-400",
};

export const STATUS_TEXT: Record<string, string> = {
  pending: "text-amber-200/90",
  verified: "text-emerald-300",
  rejected: "text-rose-300",
};

export const inputCls =
  "w-full rounded-md border border-white/[0.07] bg-white/[0.03] px-3 py-2 text-sm text-zinc-100 outline-none transition-colors placeholder:text-zinc-600 focus:border-violet-400/50";
