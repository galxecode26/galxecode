import type { Metadata } from "next";
import RegisterForm from "@/components/RegisterForm";

export const metadata: Metadata = {
  title: "Register — GalxeCode '26",
  description: "Register your team for GalxeCode '26 Vibe Coding Hackathon",
};

export default function RegisterPage() {
  return (
    <main className="min-h-screen w-full bg-black text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center px-5 py-12">
        <RegisterForm />
      </div>
    </main>
  );
}
