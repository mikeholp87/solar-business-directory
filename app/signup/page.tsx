"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";

function slugifyCompanyName(value: string) {
  const base = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || "installer";
}

export default function SignupPage() {
  const supabase = createClient();
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

    setLoading(true);
    try {
      const normalizedEmail = email.toLowerCase().trim();
      const userRole = role === "admin" ? "admin" : "installer";
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          data: {
            role: userRole,
            company_name: companyName,
            installer_slug: `${slugifyCompanyName(companyName)}-${crypto.randomUUID().slice(0, 8)}`
          }
        }
      });
      if (signUpError) {
        throw new Error(signUpError.message);
      }

      if (data.session) {
        window.location.assign(userRole === "admin" ? "/admin" : "/installer-dashboard");
        return;
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
