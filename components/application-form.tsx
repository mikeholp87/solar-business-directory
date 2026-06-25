"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { territories } from "@/lib/data";

export function ApplicationForm() {
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch("/api/applications", { method: "POST", body: new FormData(event.currentTarget) });
    if (response.ok) {
      setSubmitted(true);
      router.push("/apply/success");
    }
  }

  if (submitted) {
    return (
      <div className="surface-card surface-card-success p-6">
        <h2 className="text-2xl font-black">Application received</h2>
        <p className="mt-2 text-navy/70">The team can now review your accreditations, territory fit, and commercial terms.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="editorial-rail grid gap-5 p-6 sm:p-8">
      <div>
        <p className="eyebrow">Installer application</p>
        <h2 className="mt-3 text-3xl font-black">Apply to join</h2>
        <p className="mt-2 text-sm leading-6 text-navy/65">Share your accreditations, commercial model, and preferred territories.</p>
      </div>
      <div className="field-grid">
        <label>Company name<input name="company_name" required /></label>
        <label>Contact name<input name="contact_name" required /></label>
        <label>Email<input name="email" type="email" required /></label>
        <label>Phone<input name="phone" required /></label>
        <label>Website<input name="website" type="url" /></label>
        <label>Company registration number<input name="company_number" /></label>
        <label>VAT number<input name="vat_number" /></label>
        <label>MCS number<input name="mcs_number" required /></label>
        <label>RECC details<input name="recc_number" /></label>
        <label>HIES details<input name="hies_number" /></label>
        <label>TrustMark details<input name="trustmark_number" /></label>
        <label>Monthly install capacity<input name="monthly_install_capacity" type="number" min="0" defaultValue="10" /></label>
        <label>Survey turnaround days<input name="survey_turnaround_days" type="number" min="0" defaultValue="7" /></label>
      </div>
      <fieldset className="grid gap-2">
        <legend className="font-bold">Preferred territories</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {territories.map((territory) => (
            <label key={territory.id} className="flex grid-cols-none flex-row items-center gap-2 text-sm font-medium">
              <input className="size-4 w-auto" type="checkbox" name="preferred_territories" value={territory.id} /> {territory.name}
              {territory.activeInstallerCount >= territory.maxInstallerSlots ? <span className="chip chip-warning">full</span> : null}
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset className="grid gap-2">
        <legend className="font-bold">Services</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {["Air source heat pumps", "Ground source heat pumps", "Solar PV", "Battery storage", "Technical surveys", "Heat loss calculations"].map((service) => (
            <label key={service} className="flex grid-cols-none flex-row items-center gap-2 text-sm font-medium">
              <input className="size-4 w-auto" type="checkbox" name="services" value={service} /> {service}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="field-grid">
        <label>Areas covered<textarea name="areas_covered" rows={3} placeholder="Towns, counties or postcode areas" /></label>
        <label>Notes<textarea name="notes" rows={3} placeholder="Commercial preferences, availability or onboarding notes" /></label>
      </div>
      <div className="grid gap-2">
        {[
          ["bus_registered", "BUS registered"],
          ["handles_bus_applications", "Can handle BUS applications"],
          ["completes_heat_loss_calculations", "Can complete heat loss calculations"],
          ["offers_solar", "Offers solar"],
          ["offers_battery", "Offers battery storage"],
          ["open_to_monthly_listing", "Open to monthly listing fee"],
          ["open_to_pay_per_install", "Open to pay-per-install referral model"]
        ].map(([name, label]) => (
          <label key={name} className="flex grid-cols-none flex-row items-center gap-2 text-sm font-medium">
            <input className="size-4 w-auto" type="checkbox" name={name} value="true" /> {label}
          </label>
        ))}
      </div>
      <button className="button-primary" type="submit">
        Apply as Installer
      </button>
    </form>
  );
}
