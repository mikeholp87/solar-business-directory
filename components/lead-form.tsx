"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type LeadFormProps = {
  preferredInstallerId?: string;
  compact?: boolean;
};

export function LeadForm({ preferredInstallerId, compact }: LeadFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/leads", { method: "POST", body: formData });
    if (response.ok) {
      setSubmitted(true);
      router.push("/enquiry/success");
    }
  }

  if (submitted) {
    return (
      <div className="surface-card surface-card-success p-5">
        <h3 className="text-xl font-black">Thanks, your enquiry has been received.</h3>
        <p className="mt-2 text-sm text-ink/70">Renewable Directory will review your details and match the enquiry to the relevant territory or installer.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="surface-card grid gap-4 p-5 sm:p-6">
      <input type="hidden" name="preferred_installer_id" value={preferredInstallerId ?? ""} />
      <div>
        <p className="eyebrow">Homeowner enquiry</p>
        <h2 className={compact ? "mt-3 text-2xl font-black" : "mt-3 text-3xl font-black"}>Request a survey</h2>
        <p className="mt-2 text-sm leading-6 text-ink/65">Check installer availability and whether the Boiler Upgrade Scheme may be relevant for your home.</p>
      </div>
      <div className="field-grid">
        <label>First name<input name="first_name" required /></label>
        <label>Last name<input name="last_name" required /></label>
        <label>Email<input name="email" type="email" required /></label>
        <label>Phone<input name="phone" required /></label>
        <label>Postcode<input name="postcode" required /></label>
        <label>Address<input name="address" /></label>
        <label>Current heating source<select name="current_heating_source"><option>Gas</option><option>Oil</option><option>LPG</option><option>Electric</option><option>Coal</option><option>Biomass</option><option>Other</option></select></label>
        <label>Property type<select name="property_type"><option>Detached</option><option>Semi-detached</option><option>Terraced</option><option>Bungalow</option><option>Flat</option></select></label>
        <label>Bedrooms<input name="bedrooms" type="number" min="0" defaultValue="3" /></label>
        <label>Monthly energy bill<input name="monthly_bill" placeholder="e.g. £180" /></label>
        <label>Best time to contact<input name="best_time_to_contact" placeholder="Weekday mornings" /></label>
      </div>
      <fieldset className="grid gap-2">
        <legend className="text-sm font-bold">Interested in</legend>
        {["Air source heat pump", "Solar", "Battery storage", "Boiler Upgrade Scheme", "Unsure"].map((interest) => (
          <label key={interest} className="flex grid-cols-none flex-row items-center gap-2 text-sm font-medium">
            <input className="size-4 w-auto" type="checkbox" name="interests" value={interest} /> {interest}
          </label>
        ))}
      </fieldset>
      <label className="flex grid-cols-none flex-row items-start gap-2 text-sm font-medium"><input className="mt-1 size-4 w-auto" type="checkbox" name="homeowner_status" value="yes" required /> I am the homeowner or authorised to enquire.</label>
      <label className="flex grid-cols-none flex-row items-start gap-2 text-sm font-medium"><input className="mt-1 size-4 w-auto" type="checkbox" name="consent_contact" value="true" required /> I consent to being contacted about my enquiry.</label>
      <label className="flex grid-cols-none flex-row items-start gap-2 text-sm font-medium"><input className="mt-1 size-4 w-auto" type="checkbox" name="consent_marketing" value="true" /> I agree to receive relevant renewable energy updates.</label>
      <label className="flex grid-cols-none flex-row items-start gap-2 text-sm font-medium"><input className="mt-1 size-4 w-auto" type="checkbox" name="gdpr_acceptance" value="true" required /> I accept the privacy notice and understand installers are independent businesses.</label>
      <button className="button-primary" type="submit">Check BUS eligibility</button>
      <p className="text-xs leading-5 text-ink/55">Funding eligibility is subject to survey, property suitability, and current scheme criteria. Renewable Directory may receive a referral or marketing fee.</p>
    </form>
  );
}
