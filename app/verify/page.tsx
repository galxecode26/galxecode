import { Suspense } from "react";
import VerifyContent from "./VerifyContent";

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#060309] flex items-center justify-center">
          <div className="text-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-purple-400 border-t-transparent mx-auto mb-4" />
            <p className="text-zinc-400 text-sm">Loading...</p>
          </div>
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
