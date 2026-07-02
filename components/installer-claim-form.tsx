"use client";

import { useState } from "react";

export function InstallerClaimForm() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSending(true);
    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        body: new FormData(event.currentTarget),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Failed to submit application");
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSending(false);
    }
  }

  if (submitted) {
    return (
      <div className="surface-card p-6 sm:p-8" id="claim-form">
        <div className="surface-card surface-card-success p-5 sm:p-6">
          <h3 className="text-xl font-bold text-navy">
            Thanks. We&rsquo;ll review your listing request and contact you shortly.
          </h3>
          <p className="mt-2 text-sm leading-6 text-navy/70">
            The team will verify your details and confirm availability in your region.
          </p>
        </div>

        <div className="mt-5 rounded-2xl border-2 border-accent bg-white p-5 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-accent">
            Early launch opportunity
          </p>
          <h3 className="mt-2 text-xl font-bold text-navy">
            Want more visibility before launch?
          </h3>
          <p className="mt-2 text-sm leading-6 text-navy/65">
            Ask us about Featured Installer and Priority Lead Partner availability in your region.
          </p>
          <div className="mt-4 flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
            <a href="/pricing" className="button-primary text-sm">
              View Installer Packages
            </a>
            <a href="#pricing-ladder" className="button-secondary text-sm">
              Compare Plans
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="surface-card grid gap-5 p-6 sm:p-8"
      id="claim-form"
    >
      <div>
        <p className="eyebrow">Claim your free listing</p>
        <h2 className="mt-3 text-2xl font-bold text-navy">
          Claim Your Free Installer Listing
        </h2>
        <p className="mt-1 text-sm leading-6 text-navy/60">
          Confirm your details below and we&rsquo;ll get your listing ready before the homeowner launch.
        </p>
      </div>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="field-grid">
        <label>
          Company name
          <input name="company_name" required placeholder="Your company name" />
        </label>
        <label>
          Contact name
          <input name="contact_name" required placeholder="Your full name" />
        </label>
      </div>

      <div className="field-grid">
        <label>
          Mobile number
          <input name="phone" type="tel" required placeholder="07..." />
        </label>
        <label>
          Email
          <input name="email" type="email" required placeholder="you@company.co.uk" />
        </label>
      </div>

      <div className="field-grid">
        <label>
          Website
          <input name="website" type="url" placeholder="https://" />
        </label>
        <label>
          Postcode or region covered
          <input
            name="areas_covered"
            placeholder="e.g. South East, London, Midlands"
          />
        </label>
      </div>

      <div className="field-grid">
        <label>
          Main service
          <select name="main_service" defaultValue="">
            <option value="" disabled>
              Select main service
            </option>
            <option value="solar">Solar</option>
            <option value="battery">Battery</option>
            <option value="heat_pump">Heat Pump</option>
            <option value="ev">EV</option>
            <option value="commercial">Commercial</option>
            <option value="multiple">Multiple services</option>
          </select>
        </label>
        <label>
          Are you MCS certified?
          <select name="mcs_certified" defaultValue="">
            <option value="" disabled>
              Select an option
            </option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
            <option value="in_progress">In progress</option>
          </select>
        </label>
      </div>

      <label>
        Are you currently taking on more work?
        <select name="taking_on_work" defaultValue="">
          <option value="" disabled>
            Select an option
          </option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
          <option value="depends">Depends on area</option>
        </select>
      </label>

      <button
        className="button-primary"
        type="submit"
        disabled={sending}
        data-event="installer_claim_form_submit"
      >
        {sending ? "Submitting..." : "Claim My Free Listing"}
      </button>

      <p className="text-xs leading-5 text-navy/45">
        By submitting, you agree to be contacted about your listing. See our{" "}
        <a href="/privacy" className="underline">
          privacy policy
        </a>
        . Claiming is free. Upgrades are optional.
      </p>
    </form>
  );
}
