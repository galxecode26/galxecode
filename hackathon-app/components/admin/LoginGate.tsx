"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginGate({
  email,
  setEmail,
  password,
  setPassword,
  error,
  loading,
  onSubmit,
}: {
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  error: string;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}) {
  const [showPw, setShowPw] = useState(false);

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[#060309] px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 50% 42%, rgba(139,92,246,0.07), transparent 70%)",
        }}
      />
      <form onSubmit={onSubmit} className="relative w-full max-w-[320px]">
        <div className="mb-12 text-center">
          <div className="mx-auto mb-5 h-12 w-12 overflow-hidden rounded-xl border border-white/[0.08]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/header-logo.png"
              alt="GalxeCode"
              className="h-full w-full object-cover"
            />
          </div>
          <h1 className="text-lg font-semibold tracking-tight text-zinc-100">
            GalxeCode Console
          </h1>
          <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-600">
            admin sign in
          </p>
        </div>

        <label className="mb-6 block">
          <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
            Email
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@galxecode.in"
            autoComplete="email"
            autoFocus
            className="w-full border-b border-white/[0.12] bg-transparent px-1 py-2.5 text-center text-sm text-zinc-100 outline-none transition-colors placeholder:text-zinc-700 focus:border-violet-400/70"
          />
        </label>

        <label className="block">
          <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
            Password
          </span>
          <span className="relative block">
            <input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              className="w-full border-b border-white/[0.12] bg-transparent px-1 py-2.5 pr-8 text-center font-mono text-sm tracking-[0.2em] text-zinc-100 outline-none transition-colors placeholder:tracking-[0.3em] placeholder:text-zinc-700 focus:border-violet-400/70"
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              aria-label={showPw ? "Hide password" : "Show password"}
              className="absolute right-1 top-1/2 -translate-y-1/2 text-zinc-600 transition-colors hover:text-zinc-300"
            >
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </span>
        </label>

        {error && (
          <p className="mt-3 text-center font-mono text-[11px] text-rose-400">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading || !email.trim() || !password}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-100 py-2.5 text-sm font-semibold text-zinc-900 transition-colors hover:bg-white disabled:opacity-40"
        >
          {loading ? <Loader2 size={15} className="animate-spin" /> : "Sign in"}
        </button>

        <a
          href="/"
          className="mt-8 block text-center font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-700 transition-colors hover:text-zinc-500"
        >
          ← back to site
        </a>
      </form>
    </main>
  );
}
