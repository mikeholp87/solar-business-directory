"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/runtime";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState<"installer" | "admin">("installer");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!isSupabaseConfigured()) {
      setError("Sign up is only available when Supabase is configured.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, companyName, role })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Signup failed");
      }

      setSuccess(true);
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
          <p className="eyebrow">Create account</p>
          <h1 className="text-3xl font-black">Sign up</h1>
          <p className="mt-2 text-navy/65">Create an account to access the installer portal.</p>

          {success ? (
            <div className="mt-5">
              <p className="surface-card-success p-3 font-bold text-accent">Account created! Check your email to confirm your address, then sign in.</p>
              <button className="button-primary mt-4" onClick={() => router.push("/login")}>Go to sign in</button>
            </div>
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

              <label>
                Company name
                <input
                  value={companyName}
                  onChange={(event) => setCompanyName(event.target.value)}
                  type="text"
                  required
                />
              </label>

              <label>
                Account type
                <select
                  value={role}
                  onChange={(event) => setRole(event.target.value as "installer" | "admin")}
                >
                  <option value="installer">Installer</option>
                </select>
              </label>

              <button className="button-primary" type="submit" disabled={loading}>
                {loading ? "Creating account..." : "Create account"}
              </button>

              <p className="text-center text-sm text-navy/60">
                Already have an account?{" "}
                <a href="/login" className="underline hover:text-accent">Sign in</a>
              </p>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
