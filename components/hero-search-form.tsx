"use client";

import { useRouter } from "next/navigation";
import { type FormEvent } from "react";
import { SERVICE_TYPES, getServiceDisplayLabel } from "@/lib/service-types";
import { CheckCircle, Search } from "lucide-react";

const trustBullets = [
  "MCS certified installers",
  "Free homeowner enquiry",
  "Compare local quotes",
  "No obligation",
];

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
    <form onSubmit={handleSubmit} className="mt-6 space-y-3 sm:mt-8">
      <div className="grid gap-2 rounded-card border border-border bg-white p-2 shadow-hero sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-0 sm:p-1.5 sm:pr-1.5">
        <input
          type="text"
          name="postcode"
          placeholder="Enter your postcode"
          className="w-full border-0 bg-transparent px-4 py-3.5 text-base text-navy placeholder:text-muted focus:outline-none sm:py-3"
          aria-label="Enter your postcode"
        />
        <button type="submit" className="button-primary flex w-full items-center justify-center gap-2 sm:w-auto sm:px-6">
          <Search size={18} />
          Find Local Installers
        </button>
      </div>

      <select
        name="service"
        className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-navy shadow-sm focus:outline-none sm:max-w-[320px]"
        aria-label="What do you need?"
      >
        <option value="">What do you need?</option>
        {SERVICE_TYPES.map((type) => (
          <option key={type} value={type}>{getServiceDisplayLabel(type)}</option>
        ))}
      </select>

      <div className="flex flex-wrap gap-x-5 gap-y-2 pt-1">
        {trustBullets.map((bullet) => (
          <span key={bullet} className="inline-flex items-center gap-1.5 text-xs font-medium text-navy/60">
            <CheckCircle size={14} className="shrink-0 text-accent" />
            {bullet}
          </span>
        ))}
      </div>
    </form>
  );
}
