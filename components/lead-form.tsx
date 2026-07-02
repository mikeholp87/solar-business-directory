"use client";

import { useState } from "react";
import { SERVICE_TYPES, getServiceDisplayLabel } from "@/lib/service-types";

type LeadFormProps = {
  preferredInstallerId?: string;
  compact?: boolean;
};

export function LeadForm({ preferredInstallerId, compact }: LeadFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/leads", { method: "POST", body: formData });
    setSending(false);
    if (response.ok) {
      setSubmitted(true);
    }
  }

  if (submitted) {
    return (
      <div className="surface-card surface-card-success p-5 text-center sm:p-6">
        <h3 className="text-xl font-bold text-navy">Thanks. We&rsquo;ll match you with suitable local installers.</h3>
        <p className="mt-2 text-sm text-navy/60">Your enquiry has been received and we&rsquo;ll be in touch shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="surface-card grid gap-4 p-5 sm:p-6">
      <input type="hidden" name="preferred_installer_id" value={preferredInstallerId ?? ""} />

      <div>
        <h2 className={compact ? "text-xl font-bold" : "text-2xl font-bold"}>
          {preferredInstallerId ? "Request A Quote From This Installer" : "Get Free Quotes From Local Installers"}
        </h2>
        <p className="mt-1 text-sm leading-6 text-navy/60">
          Fill in your details and we&rsquo;ll connect you with MCS certified installers in your area.
        </p>
      </div>

      <div className="field-grid">
        <label>
          Full name <span className="text-accent">*</span>
          <input name="first_name" required placeholder="Your name" />
        </label>
        <label>
          Postcode <span className="text-accent">*</span>
          <input name="postcode" required placeholder="e.g. SW1A 1AA" />
        </label>
        <label>
          Email <span className="text-accent">*</span>
          <input name="email" type="email" required placeholder="you@example.com" />
        </label>
        <label>
          Phone
          <input name="phone" type="tel" placeholder="07123 456789" />
        </label>
      </div>

      <label>
        Service required <span className="text-accent">*</span>
        <select name="service_required" required defaultValue="">
          <option value="" disabled>Select a service</option>
          {SERVICE_TYPES.map((type) => (
            <option key={type} value={type}>{getServiceDisplayLabel(type)}</option>
          ))}
        </select>
      </label>

      <div className="field-grid">
        <label>
          Property type
          <select name="property_type">
            <option value="">Select property type</option>
            <option>Detached</option>
            <option>Semi-detached</option>
            <option>Terraced</option>
            <option>Bungalow</option>
            <option>Flat</option>
          </select>
        </label>
        <label>
          Monthly energy bill
          <input name="monthly_bill" placeholder="e.g. £180" />
        </label>
      </div>

      <label className="flex grid-cols-none flex-row items-start gap-2 text-sm font-medium">
        <input className="mt-0.5 size-4 w-auto" type="checkbox" name="consent_contact" value="true" required />
        I agree to be contacted about my enquiry. <span className="text-accent">*</span>
      </label>

      <button className="button-primary" type="submit" disabled={sending}>
        {sending ? "Sending..." : "Get Free Quotes"}
      </button>

      <p className="text-xs leading-5 text-navy/45">
        Your details will only be shared with relevant installers. No obligation. See our{" "}
        <a href="/privacy" className="underline">privacy policy</a>.
      </p>
    </form>
  );
}
