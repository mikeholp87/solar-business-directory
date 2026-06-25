"use client";

import { useRouter } from "next/navigation";
import { type FormEvent } from "react";

const serviceOptions = [
  { label: "Select a service", value: "" },
  { label: "Solar PV Installation", value: "Solar PV" },
  { label: "Battery Storage", value: "Battery Storage" },
  { label: "Air Source Heat Pump", value: "Air Source Heat Pump" },
  { label: "EV Charger Installation", value: "EV Charger" },
  { label: "Commercial Renewable", value: "Commercial" },
];

export function HeroSearchForm() {
  const router = useRouter();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const postcode = String(form.get("postcode") ?? "").trim();
    const service = String(form.get("service") ?? "");

    const params = new URLSearchParams();
    if (postcode) params.set("q", postcode);
    if (service) params.set("type", service);

    const query = params.toString();
    router.push(query ? `/directory?${query}` : "/directory");
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex max-w-xl items-center gap-0 rounded-lg border border-border bg-white p-1 shadow-soft">
      <input
        type="text"
        name="postcode"
        placeholder="Enter your postcode"
        className="w-full border-0 bg-transparent px-3 py-2.5 text-sm text-navy placeholder:text-muted focus:outline-none"
        aria-label="Enter your postcode"
      />
      <div className="h-6 w-px bg-border" />
      <select
        name="service"
        className="w-[180px] appearance-none border-0 bg-transparent px-3 py-2.5 text-sm text-muted focus:outline-none"
        aria-label="Select a service"
      >
        {serviceOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <button type="submit" className="button-primary shrink-0 !min-h-[40px] !px-5 !py-2 text-sm">
        Search Installers
      </button>
    </form>
  );
}
