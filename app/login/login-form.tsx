"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase-client";

const roleDashboardPath = (role: "installer" | "admin") => (role === "admin" ? "/admin" : "/installer-dashboard");

function resolveRedirectPath(candidate: string | null, fallback: string) {
  if (!candidate || !candidate.startsWith("/")) return fallback;
  return candidate;
}

export default function LoginForm() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMethod, setAuthMethod] = useState<"password" | "magiclink">("password");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const redirectPath = searchParams?.get("redirect") ?? null;

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (authMethod === "magiclink") {
      setLoading(true);
      try {
        const destination = resolveRedirectPath(redirectPath, roleDashboardPath("installer"));
        const callbackUrl = new URL("/auth/callback", window.location.origin);
        callbackUrl.searchParams.set("redirect", destination);
        const { error } = await supabase.auth.signInWithOtp({
          email: email.toLowerCase().trim(),
          options: { emailRedirectTo: callbackUrl.toString() }
        });
        if (error) throw new Error(error.message);
        setSent(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
      });
      if (error) throw new Error(error.message);
      if (!data.user) throw new Error("Authentication failed");

      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("role")
        .eq("id", data.user.id)
        .maybeSingle();
      if (profileError) throw new Error(profileError.message);

      const role = profile?.role === "admin" ? "admin" : "installer";
      const destination = resolveRedirectPath(redirectPath, roleDashboardPath(role));
      window.location.assign(destination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="surface-card p-6">
      <p className="eyebrow">Secure access</p>
      <h1 className="text-3xl font-black">Sign in</h1>
      <p className="mt-2 text-navy/65">Sign in with your email and password, or use a magic link.</p>

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
                  onClick={() => {
                    setAuthMethod("magiclink");
                    setError(null);
                  }}
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
                  onClick={() => {
                    setAuthMethod("password");
                    setError(null);
                  }}
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
  );
}
