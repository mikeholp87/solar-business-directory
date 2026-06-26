"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";
import { isSupabaseConfigured } from "@/lib/runtime";

const roleDashboardPath = (role: "installer" | "admin") => (role === "admin" ? "/admin" : "/installer-dashboard");

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"installer" | "admin">("installer");
  const [authMethod, setAuthMethod] = useState<"password" | "magiclink">("password");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!isSupabaseConfigured()) {
      document.cookie = `demo-role=${role}; path=/`;
      document.cookie = `demo-email=${encodeURIComponent(email)}; path=/`;
      router.push(roleDashboardPath(role));
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const redirectTo = new URLSearchParams(window.location.search).get("redirect") ?? roleDashboardPath(role);

    try {
      if (authMethod === "password") {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (signInError) throw signInError;

        const { data: profile } = await supabase.from("users").select("role").eq("id", signInData.user.id).maybeSingle();
        const actualRole = (profile?.role === "admin" ? "admin" : "installer") as "admin" | "installer";
        router.push(roleDashboardPath(actualRole));
      } else {
        const { error: otpError } = await supabase.auth.signInWithOtp({
          email,
          options: { emailRedirectTo: `${window.location.origin}${redirectTo}` }
        });
        if (otpError) throw otpError;
        setSent(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="section-band">
      <div className="container-page max-w-lg">
        <div className="surface-card p-6">
          <p className="eyebrow">Secure access</p>
          <h1 className="text-3xl font-black">Sign in</h1>
          <p className="mt-2 text-navy/65">Sign in with your email and password, or use a magic link. Demo login works locally.</p>

          {sent ? (
            <p className="surface-card-success mt-5 p-3 font-bold text-accent">Check your email for the sign-in link.</p>
          ) : (
            <form onSubmit={submit} className="mt-5 grid gap-4">
              {error && <p className="text-red-600 text-sm">{error}</p>}

              <label>
                Email
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  type="email"
                  required
                />
              </label>

              {authMethod === "password" && (
                <label>
                  Password
                  <input
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    type="password"
                    required
                    minLength={6}
                  />
                </label>
              )}

              <label>
                Role
                <select
                  value={role}
                  onChange={(event) => setRole(event.target.value as "installer" | "admin")}
                >
                  <option value="installer">Installer</option>
                  <option value="admin">Admin</option>
                </select>
              </label>

              <button className="button-primary" type="submit" disabled={loading}>
                {loading ? "Signing in..." : authMethod === "password" ? "Sign in" : "Send magic link"}
              </button>

              <p className="text-center text-sm text-navy/60">
                {authMethod === "password" ? (
                  <>
                    Prefer a magic link?{" "}
                    <button
                      type="button"
                      className="underline hover:text-accent"
                      onClick={() => { setAuthMethod("magiclink"); setError(null); }}
                    >
                      Use magic link
                    </button>
                  </>
                ) : (
                  <>
                    Prefer a password?{" "}
                    <button
                      type="button"
                      className="underline hover:text-accent"
                      onClick={() => { setAuthMethod("password"); setError(null); }}
                    >
                      Use password
                    </button>
                  </>
                )}
              </p>

              <p className="text-center text-sm text-navy/60">
                Don&apos;t have an account?{" "}
                <a href="/signup" className="underline hover:text-accent">Sign up</a>
              </p>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
