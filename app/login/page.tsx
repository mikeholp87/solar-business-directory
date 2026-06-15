"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";

const roleDashboardPath = (role: "installer" | "admin") => (role === "admin" ? "/admin" : "/installer-dashboard");

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"installer" | "admin">("installer");
  const [sent, setSent] = useState(false);
  const router = useRouter();

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      document.cookie = `demo-role=${role}; path=/`;
      document.cookie = `demo-email=${encodeURIComponent(email)}; path=/`;
      router.push(roleDashboardPath(role));
      return;
    }

    const supabase = createClient();
    const redirectTo = new URLSearchParams(window.location.search).get("redirect") ?? roleDashboardPath(role);
    await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}${redirectTo}` }
    });
    setSent(true);
  }

  return (
    <main className="section-band">
      <div className="container-page max-w-lg">
        <div className="surface-card p-6">
          <p className="eyebrow">Secure access</p>
          <h1 className="text-3xl font-black">Sign in</h1>
          <p className="mt-2 text-ink/65">Use your admin or installer email address to receive a secure magic link, or use demo login locally.</p>
          {sent ? <p className="surface-card-success mt-5 p-3 font-bold text-fern">Check your email for the sign-in link.</p> : (
            <form onSubmit={submit} className="mt-5 grid gap-4">
              <label>Email<input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required /></label>
              <label>Role<select value={role} onChange={(event) => setRole(event.target.value as "installer" | "admin")}><option value="installer">Installer</option><option value="admin">Admin</option></select></label>
              <button className="button-primary" type="submit">Continue</button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
