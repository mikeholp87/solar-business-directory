"use client";

export function InstallerStickyCta() {
  function scrollToForm() {
    const form = document.getElementById("claim-form");
    if (form) {
      form.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-white px-4 py-3 shadow-[0_-4px_12px_rgba(16,42,67,0.08)] md:hidden">
      <button
        onClick={scrollToForm}
        className="button-primary w-full text-sm"
        data-event="installer_claim_cta_click"
      >
        Claim Your Free Listing
      </button>
    </div>
  );
}
