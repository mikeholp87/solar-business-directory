"use client";

import { useRouter } from "next/navigation";
import { type FormEvent } from "react";
import { SERVICE_TYPES } from "@/lib/service-types";

export function HeroSearchForm() {
  const router = useRouter();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const postcode = String(form.get("postcode") ?? "").trim();
    const service = String(form.get("service") ?? "");

    const params = new URLSearchParams();
    if (postcode) params.set("postcode", postcode);
    if (service) params.set("type", service);

    const query = params.toString();
    router.push(query ? `/directory?${query}` : "/directory");
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 grid max-w-xl gap-2 rounded-xl border border-border bg-white p-2 shadow-soft sm:grid-cols-[minmax(0,1fr)_14rem_auto] sm:items-center sm:gap-0 sm:p-1">
      <input
        type="text"
        name="postcode"
        placeholder="Enter your postcode"
        className="w-full border-0 bg-transparent px-3 py-3 text-sm text-navy placeholder:text-muted focus:outline-none sm:py-2.5"
        aria-label="Enter your postcode"
      />
      <div className="hidden h-6 w-px bg-border sm:block" />
      <select
        name="service"
        className="w-full appearance-none border-0 bg-transparent px-3 py-3 text-sm text-muted focus:outline-none sm:py-2.5"
        aria-label="Select a service"
      >
        <option value="">Select a service</option>
        {SERVICE_TYPES.map((type) => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>
      <button type="submit" className="button-primary w-full shrink-0 !min-h-[44px] !px-5 !py-3 text-sm sm:w-auto sm:!py-2">
        Search Installers
      </button>
    </form>
  );
}
