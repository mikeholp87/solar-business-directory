"use client";

import { useState } from "react";
import { Phone, MessageCircle, ChevronDown } from "lucide-react";

/* ── Enquiry Form ───────────────────────────────────────────────── */

const SERVICE_OPTIONS = [
  "Solar PV",
  "Battery Storage",
  "Air Source Heat Pump",
  "EV Charger",
  "Solar Maintenance",
  "Commercial Solar",
  "Not Sure Yet",
] as const;

export function ExampleProfileForm({ companyName = "GreenVolt Renewables" }: { companyName?: string }) {
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
      <div
        id="enquiry-form"
        className="surface-card surface-card-success p-6 text-center sm:p-8"
      >
        <h3 className="text-xl font-bold text-navy">
          Thanks. Your quote request has been received.
        </h3>
        <p className="mt-2 text-sm leading-6 text-navy/60">
          The installer or The Renewable Directory team will contact you
          shortly.
        </p>
      </div>
    );
  }

  return (
    <form
      id="enquiry-form"
      onSubmit={onSubmit}
      className="surface-card grid gap-5 p-6 sm:p-8"
    >
      <div>
        <h2 className="text-2xl font-bold">Request a Free Quote</h2>
        <p className="mt-1 text-sm leading-6 text-navy/60">
          Fill in your details and {companyName} or The Renewable
          Directory team will be in touch.
        </p>
      </div>

      <input
        type="hidden"
        name="preferred_installer_id"
        value="greenvolt-renewables-ltd"
      />

      <div className="field-grid">
        <label>
          Full name <span className="text-accent">*</span>
          <input name="first_name" required placeholder="Your full name" />
        </label>
        <label>
          Phone <span className="text-accent">*</span>
          <input name="phone" type="tel" required placeholder="07123 456789" />
        </label>
        <label>
          Email <span className="text-accent">*</span>
          <input
            name="email"
            type="email"
            required
            placeholder="you@example.com"
          />
        </label>
        <label>
          Postcode <span className="text-accent">*</span>
          <input name="postcode" required placeholder="e.g. CH1 1AA" />
        </label>
      </div>

      <label>
        Service required <span className="text-accent">*</span>
        <select name="service_required" required defaultValue="">
          <option value="" disabled>
            Select a service
          </option>
          {SERVICE_OPTIONS.map((service) => (
            <option key={service} value={service}>
              {service}
            </option>
          ))}
        </select>
      </label>

      <div className="field-grid">
        <label>
          Are you a homeowner?
          <select name="property_type" defaultValue="">
            <option value="" disabled>
              Select
            </option>
            <option>Yes, I am a homeowner</option>
            <option>Landlord</option>
            <option>Business owner</option>
          </select>
        </label>
        <label>
          Monthly energy bill (optional)
          <input name="monthly_bill" placeholder="e.g. £180" />
        </label>
      </div>

      <label>
        Message (optional)
        <textarea
          name="message"
          rows={3}
          placeholder="Tell us about your project or any questions you have..."
        />
      </label>

      <label className="flex grid-cols-none flex-row items-start gap-2 text-sm font-medium">
        <input
          className="mt-0.5 size-4 w-auto"
          type="checkbox"
          name="consent_contact"
          value="true"
          required
        />
        I agree to be contacted about my enquiry.{" "}
        <span className="text-accent">*</span>
      </label>

      <button className="button-primary" type="submit" disabled={sending}>
        {sending ? "Sending..." : "Request My Free Quote"}
      </button>

      <p className="text-xs leading-5 text-navy/45">
        Free quote request. No obligation. Your details are only shared for the
        purpose of handling your enquiry. See our{" "}
        <a href="/privacy" className="underline">
          privacy policy
        </a>
        .
      </p>
    </form>
  );
}

/* ── Sticky Mobile CTA ──────────────────────────────────────────── */

export function ExampleProfileStickyCta() {
  function scrollToForm() {
    const form = document.getElementById("enquiry-form");
    if (form) {
      form.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-white px-3 py-3 shadow-[0_-4px_12px_rgba(16,42,67,0.08)] md:hidden">
      <div className="grid grid-cols-3 gap-2">
        <a
          href="tel:01244567890"
          className="flex items-center justify-center gap-1.5 rounded-[10px] border border-border bg-white px-2 py-2.5 text-sm font-bold text-navy"
        >
          <Phone size={16} />
          Call
        </a>
        <button
          onClick={scrollToForm}
          className="button-primary flex items-center justify-center gap-1.5 rounded-[10px] px-2 py-2.5 text-sm"
        >
          Enquire
        </button>
        <a
          href="https://wa.me/4401244567890"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-1.5 rounded-[10px] border border-border bg-white px-2 py-2.5 text-sm font-bold text-navy"
        >
          <MessageCircle size={16} />
          Message
        </a>
      </div>
    </div>
  );
}

/* ── Postcode Checker ───────────────────────────────────────────── */

export function PostcodeChecker() {
  const [checked, setChecked] = useState(false);
  const [postcode, setPostcode] = useState("");

  function handleCheck(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (postcode.trim()) {
      setChecked(true);
    }
  }

  return (
    <div>
      <form onSubmit={handleCheck} className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={postcode}
          onChange={(e) => {
            setPostcode(e.target.value);
            setChecked(false);
          }}
          placeholder="Enter your postcode"
          className="min-w-0 flex-1"
        />
        <button type="submit" className="button-primary shrink-0">
          Check Coverage
        </button>
      </form>
      <p className="mt-3 text-xs leading-5 text-navy/50">
        We will confirm availability before passing your enquiry to the
        installer.
      </p>
      {checked && (
        <div className="mt-3 rounded-[10px] border border-accent/30 bg-accent-light px-4 py-3 text-sm font-semibold text-accent-active">
          {postcode.toUpperCase()} is within the coverage area. GreenVolt
          Renewables serves this postcode.
        </div>
      )}
    </div>
  );
}
