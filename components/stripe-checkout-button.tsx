"use client";

import { useState } from "react";

export function StripeCheckoutButton({ tier, label }: { tier: "starter" | "territory" | "regional"; label: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startCheckout() {
    setLoading(true);
    setError(null);
    const response = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ tier })
    });
    const result = await response.json().catch(() => ({}));
    if (response.ok && result.url) {
      window.location.assign(result.url);
      return;
    }
    setError(result.error ?? "Unable to start checkout");
    setLoading(false);
  }

  return (
    <div>
      <button className="button-primary" type="button" onClick={startCheckout} disabled={loading}>
        {loading ? "Opening Stripe…" : label}
      </button>
      {error ? <p className="mt-2 text-sm text-red-700" role="alert">{error}</p> : null}
    </div>
  );
}
