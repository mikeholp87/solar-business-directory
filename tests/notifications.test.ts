import { describe, expect, it } from "vitest";
import { applicationReceivedTemplate } from "@/lib/notifications/templates/application-received";
import { leadReceivedTemplate } from "@/lib/notifications/templates/lead-received";
import { installerApprovedTemplate } from "@/lib/notifications/templates/installer-approved";
import { paymentFailedTemplate } from "@/lib/notifications/templates/payment-failed";

describe("notification templates", () => {
  it("builds a lead received notification", () => {
    const template = leadReceivedTemplate({
      firstName: "Asha",
      lastName: "Khan",
      postcode: "SW1A 1AA",
      stage: "new_enquiry",
      source: "directory"
    });

    expect(template.subject).toContain("SW1A 1AA");
    expect(template.body).toContain("Asha Khan");
  });

  it("builds an application received notification", () => {
    const template = applicationReceivedTemplate({
      companyName: "Peak Renewables",
      contactName: "Morgan Hill",
      email: "morgan@example.com",
      territoryCount: 2
    });

    expect(template.subject).toContain("Peak Renewables");
    expect(template.body).toContain("Morgan Hill");
  });

  it("builds approval and payment issue messages", () => {
    expect(installerApprovedTemplate({ companyName: "Peak Renewables", email: "ops@example.com" }).subject).toContain("approved");
    expect(paymentFailedTemplate({ companyName: "Peak Renewables", email: "ops@example.com" }).body).toContain("billing issue");
  });
});
