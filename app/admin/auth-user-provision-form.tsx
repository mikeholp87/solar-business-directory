"use client";

import { useState } from "react";

export default function AuthUserProvisionForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/provision-auth-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });
      const data = (await response.json().catch(() => null)) as
        | { action?: "created" | "updated"; authUserId?: string; error?: string }
        | null;

      if (!response.ok) {
        throw new Error(data?.error ?? "Unable to provision auth user.");
      }

      setMessage(`Auth user ${data?.action === "updated" ? "updated" : "created"} successfully.`);
      setPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="surface-card grid gap-4 p-5">
      <div>
        <h2 className="text-2xl font-black">Provision Auth User</h2>
        <p className="mt-2 text-sm leading-6 text-navy/65">
          Create or reset the Supabase Auth password for an existing profile row in <code>public.users</code>.
        </p>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {message && <p className="surface-card-success p-3 text-sm font-semibold text-accent">{message}</p>}

      <label>
        Email
        <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required />
      </label>

      <label>
        Password
        <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" minLength={6} required />
      </label>

      <button className="button-primary" type="submit" disabled={loading}>
        {loading ? "Provisioning..." : "Create / reset auth user"}
      </button>
    </form>
  );
}

