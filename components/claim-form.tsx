"use client";

import { useState } from "react";
import { SERVICE_TYPES, getServiceDisplayLabel } from "@/lib/service-types";

type ClaimFormProps = {
  companyName?: string;
};

export function ClaimForm({ companyName }: ClaimFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/applications", { method: "POST", body: formData });
    setSending(false);
    if (response.ok) {
      setSubmitted(true);
    }
  }

  if (submitted) {
    return (
      <div className="surface-card p-5 sm:p-6">
        <div className="surface-card surface-card-success p-4 sm:p-5">
          <h3 className="text-lg font-bold text-navy">Thanks. We&rsquo;ll review your claim and contact you shortly.</h3>
        </div>

        <div className="mt-5 rounded-2xl border-2 border-accent bg-white p-5 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-accent">Upgrade your listing</p>
          <h3 className="mt-2 text-xl font-bold text-navy">Get priority placement and more enquiries</h3>
          <p className="mt-2 text-sm leading-6 text-navy/65">
            Get priority placement, quote requests and featured visibility in your service areas.
          </p>
          <div className="mt-4 flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
            <a href="/pricing" className="button-primary text-sm">
              Upgrade Your Listing
            </a>
            <a href="/apply" className="button-secondary text-sm">
              Learn more
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="surface-card grid gap-4 p-5 sm:p-6">
      <div>
        <p className="eyebrow">Is this your company?</p>
        <h2 className="mt-3 text-xl font-bold">Claim this free listing</h2>
        <p className="mt-1 text-sm leading-6 text-navy/60">
          Update your details, add your logo and website, and start receiving homeowner enquiries.
        </p>
      </div>

      <div className="field-grid">
        <label>
          Company name
          <input name="company_name" defaultValue={companyName ?? ""} required />
        </label>
        <label>
          Contact name
          <input name="contact_name" required placeholder="Your full name" />
        </label>
      </div>

      <div className="field-grid">
        <label>
          Email
          <input name="email" type="email" required />
        </label>
        <label>
          Phone
          <input name="phone" type="tel" required />
        </label>
      </div>

      <label>
        Website
        <input name="website" type="url" placeholder="https://" />
      </label>

      <label>
        Regions covered
        <input name="areas_covered" placeholder="e.g. South East, London, Midlands" />
      </label>

      <fieldset className="grid gap-2">
        <legend className="text-sm font-bold">Services offered</legend>
        <div className="grid gap-1.5 sm:grid-cols-2">
          {SERVICE_TYPES.map((type) => (
            <label key={type} className="flex grid-cols-none flex-row items-center gap-2 text-sm font-medium">
              <input className="size-4 w-auto" type="checkbox" name="services" value={type} /> {getServiceDisplayLabel(type)}
            </label>
          ))}
        </div>
      </fieldset>

      <button className="button-primary" type="submit" disabled={sending}>
        {sending ? "Submitting..." : "Claim This Listing"}
      </button>

      <p className="text-xs leading-5 text-navy/45">
        By submitting, you agree to be contacted about your listing claim. See our{" "}
        <a href="/privacy" className="underline">privacy policy</a>.
      </p>
    </form>
  );
}
