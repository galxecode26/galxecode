"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { CheckCircle2, XCircle, Loader2, ScanLine, X, Camera } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface VerifyResult {
  team_name: string;
  leader_name: string;
  payment_status: string;
  team_size: number;
  amount: number;
  college: string;
  members: { name: string; email: string }[];
}

export default function QRScanner({ onClose }: { onClose: () => void }) {
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const lockRef = useRef(false);

  const verifyTeam = useCallback(async (teamId: string) => {
    if (lockRef.current) return;
    lockRef.current = true;
    setVerifying(true);
    setError("");

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(teamId)) {
      setError("Not a valid GalxeCode QR. Please scan the correct QR from the team's email.");
      setVerifying(false);
      lockRef.current = false;
      return;
    }

    try {
      const { data, error: rpcErr } = await supabase.rpc("verify_team", {
        p_team_id: teamId,
      });
      if (rpcErr) throw rpcErr;
      if (!data) {
        setError("Team not found with this ID.");
      } else {
        setResult(data as VerifyResult);
      }
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setVerifying(false);
      lockRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (!showCamera) return;

    let cancelled = false;

    const init = async () => {
      await new Promise((r) => setTimeout(r, 300));

      if (cancelled) return;

      try {
        const scanner = new Html5Qrcode("qr-reader");
        scannerRef.current = scanner;

        try {
          await scanner.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 },
            async (decodedText) => {
              let teamId = decodedText;
              const urlMatch = decodedText.match(/team_id=([a-f0-9-]+)/i);
              if (urlMatch) teamId = urlMatch[1];
              verifyTeam(teamId);
            },
            () => {}
          );
        } catch {
          const cameras = await Html5Qrcode.getCameras();
          if (cancelled) return;
          if (cameras && cameras.length > 0) {
            await scanner.start(
              cameras[0].id,
              { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 },
              async (decodedText) => {
                let teamId = decodedText;
                const urlMatch = decodedText.match(/team_id=([a-f0-9-]+)/i);
                if (urlMatch) teamId = urlMatch[1];
                verifyTeam(teamId);
              },
              () => {}
            );
          } else {
            throw new Error("No cameras found");
          }
        }

        if (!cancelled) setCameraReady(true);
      } catch (err) {
        if (cancelled) return;
        console.error("Camera error:", err);
        const msg = err instanceof Error ? err.message : String(err);
        if (msg.includes("NotAllowedError") || msg.includes("Permission")) {
          setError("Camera permission denied. Allow camera access in browser settings.");
        } else if (msg.includes("NotFoundError") || msg.includes("No cameras")) {
          setError("No camera found on this device.");
        } else {
          setError("Camera failed to start. Please try again.");
        }
        setShowCamera(false);
      }
    };

    init();

    return () => {
      cancelled = true;
      try { scannerRef.current?.stop(); } catch {}
      try { scannerRef.current?.clear(); } catch {}
      scannerRef.current = null;
      setCameraReady(false);
    };
  }, [showCamera, verifyTeam]);

  const openCamera = () => {
    setError("");
    setResult(null);
    setShowCamera(true);
  };

  const closeScanner = async () => {
    try { await scannerRef.current?.stop(); } catch {}
    try { await scannerRef.current?.clear(); } catch {}
    scannerRef.current = null;
    setCameraReady(false);
    setShowCamera(false);
  };

  const reset = () => {
    setResult(null);
    setError("");
  };

  const statusColor = result?.payment_status === "verified"
    ? "text-emerald-400"
    : result?.payment_status === "rejected"
      ? "text-rose-400"
      : "text-amber-400";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#0d0912] shadow-[0_24px_80px_rgba(0,0,0,0.7)] max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4 shrink-0">
          <div className="flex items-center gap-2">
            <ScanLine size={18} className="text-purple-400" />
            <span className="text-sm font-semibold text-zinc-100">Scan Team QR</span>
          </div>
          <button
            onClick={() => { closeScanner(); onClose(); }}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-white/[0.04] hover:text-zinc-200"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1 min-h-0">
          {/* Start screen */}
          {!showCamera && !error && (
            <div className="py-10 text-center">
              <Camera size={40} className="mx-auto mb-4 text-zinc-600" />
              <p className="text-sm text-zinc-400 mb-5">Scan a team&apos;s QR code to verify</p>
              <button
                onClick={openCamera}
                className="rounded-lg bg-purple-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-purple-500"
              >
                Open Camera
              </button>
            </div>
          )}

          {/* Camera - always rendered once showCamera is true */}
          {showCamera && (
            <div>
              <div id="qr-reader" className="overflow-hidden rounded-xl" />
              <p className="mt-3 text-center text-xs text-zinc-500">
                {!cameraReady ? "Starting camera..." : verifying ? "Verifying..." : "Point camera at the team's QR code"}
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="py-6 text-center">
              <XCircle size={40} className="mx-auto mb-3 text-rose-400" />
              <p className="text-sm text-rose-300">{error}</p>
              <button
                onClick={openCamera}
                className="mt-4 rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-purple-500"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Verifying */}
          {verifying && (
            <div className="flex items-center justify-center gap-2 py-4">
              <Loader2 size={18} className="animate-spin text-purple-400" />
              <p className="text-sm text-zinc-400">Verifying team...</p>
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="mt-4">
              <div className={`mb-3 flex items-center gap-3 rounded-xl border ${
                result.payment_status === "verified"
                  ? "border-emerald-400/30 bg-emerald-400/10"
                  : result.payment_status === "rejected"
                    ? "border-rose-400/30 bg-rose-400/10"
                    : "border-amber-400/30 bg-amber-400/10"
              } p-4`}>
                <CheckCircle2 size={24} className={statusColor} />
                <div>
                  <p className={`font-mono text-xs tracking-widest ${statusColor}`}>
                    {result.payment_status.toUpperCase()}
                  </p>
                  <p className="text-white font-bold">{result.team_name}</p>
                </div>
              </div>

              <div className="space-y-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Leader</span>
                  <span className="text-white">{result.leader_name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Team Size</span>
                  <span className="text-zinc-300">{result.team_size} members</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Amount</span>
                  <span className="text-white font-semibold">₹{result.amount}</span>
                </div>
                {result.college && (
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">College</span>
                    <span className="text-zinc-300">{result.college}</span>
                  </div>
                )}
                {result.members.length > 0 && (
                  <div className="mt-3 border-t border-white/[0.06] pt-3">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-2">Members</p>
                    {result.members.map((m, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm py-1">
                        <span className="font-mono text-[10px] text-purple-400">[{String(i + 1).padStart(2, "0")}]</span>
                        <span className="text-zinc-300">{m.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={reset}
                className="mt-3 w-full rounded-lg border border-white/[0.08] py-2.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/[0.04]"
              >
                Scan Next Team
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
