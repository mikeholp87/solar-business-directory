"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const supabase = createClient();
    const redirectTo = new URLSearchParams(window.location.search).get("redirect") ?? "/installer-dashboard";
    await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}${redirectTo}` }
    });
    setSent(true);
  }

  return (
    <main className="section-band">
      <div className="container-page max-w-lg">
        <div className="rounded-lg border border-emerald-950/10 bg-white p-6 shadow-soft">
          <h1 className="text-3xl font-black">Sign in</h1>
          <p className="mt-2 text-ink/65">Use your admin or installer email address to receive a secure magic link.</p>
          {sent ? <p className="mt-5 rounded bg-emerald-50 p-3 font-bold text-fern">Check your email for the sign-in link.</p> : (
            <form onSubmit={submit} className="mt-5 grid gap-4">
              <label>Email<input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required /></label>
              <button className="button-primary" type="submit">Send magic link</button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
