import { afterEach, describe, expect, it, vi } from "vitest";
import { queueEmailNotification } from "@/lib/notifications/email";
import { sendNotificationEmailViaEmailJs } from "@/lib/notifications/emailjs";

afterEach(() => {
  delete process.env.EMAILJS_SERVICE_ID;
  delete process.env.EMAILJS_TEMPLATE_ID;
  delete process.env.EMAILJS_PUBLIC_KEY;
  delete process.env.EMAILJS_PRIVATE_KEY;
  delete process.env.EMAILJS_FROM_NAME;
  delete process.env.EMAILJS_FROM_EMAIL;
});

describe("EmailJS notifications", () => {
  it("posts the expected payload to the EmailJS send endpoint", async () => {
    process.env.EMAILJS_SERVICE_ID = "service_123";
    process.env.EMAILJS_TEMPLATE_ID = "template_456";
    process.env.EMAILJS_PUBLIC_KEY = "public_789";
    process.env.EMAILJS_PRIVATE_KEY = "private_abc";
    process.env.EMAILJS_FROM_NAME = "Solar Directory";
    process.env.EMAILJS_FROM_EMAIL = "info@therenewabledirectory.co.uk";

    const fetchMock = vi.fn(async () => new Response("OK", { status: 200 }));
    const result = await sendNotificationEmailViaEmailJs(
      {
        recipientEmail: "automojic@proton.me",
        subject: "New lead assigned",
        body: "Lead body",
        eventType: "lead.received",
        recipientRole: "admin",
        payload: { leadId: "lead-1" }
      },
      fetchMock as typeof fetch
    );

    expect(result.ok).toBe(true);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.emailjs.com/api/v1.0/email/send",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ "Content-Type": "application/json" })
      })
    );

    const options = fetchMock.mock.calls[0]?.[1] as RequestInit;
    const body = JSON.parse(String(options.body));
    expect(body).toMatchObject({
      service_id: "service_123",
      template_id: "template_456",
      user_id: "public_789",
      accessToken: "private_abc",
      template_params: {
        to_email: "automojic@proton.me",
        from_name: "Solar Directory",
        from_email: "info@therenewabledirectory.co.uk",
        subject: "New lead assigned",
        message: "Lead body",
        body: "Lead body",
        event_type: "lead.received",
        recipient_role: "admin",
        payload_json: "{\"leadId\":\"lead-1\"}",
        leadId: "lead-1"
      }
    });
  });

  it("flattens apply form payload fields into template params", async () => {
    process.env.EMAILJS_SERVICE_ID = "service_123";
    process.env.EMAILJS_TEMPLATE_ID = "template_456";
    process.env.EMAILJS_PUBLIC_KEY = "public_789";
    process.env.EMAILJS_FROM_EMAIL = "info@therenewabledirectory.co.uk";

    const fetchMock = vi.fn(async () => new Response("OK", { status: 200 }));
    await sendNotificationEmailViaEmailJs(
      {
        recipientEmail: "dan@uksolardirect.co.uk",
        subject: "New installer application: Peak Renewables",
        body: "A new installer application has been received.",
        eventType: "application.received",
        recipientRole: "admin",
        payload: {
          company_name: "Peak Renewables",
          contact_name: "Morgan Hill",
          email: "morgan@example.com",
          phone: "07000 000102",
          website: "https://peak.example",
          company_number: "12345678",
          vat_number: "GB123456789",
          mcs_number: "MCS-APP-102",
          recc_number: "RECC-123",
          hies_number: "HIES-456",
          trustmark_number: "TM-789",
          monthly_install_capacity: 11,
          survey_turnaround_days: 7,
          bus_registered: true,
          services: ["Air source heat pumps", "Battery storage"],
          areas_covered: ["Derby", "Sheffield"],
          preferred_territories: ["midlands", "yorkshire"],
          handles_bus_applications: true,
          completes_heat_loss_calculations: true,
          offers_solar: false,
          offers_battery: true,
          open_to_monthly_listing: true,
          open_to_pay_per_install: false,
          notes: "Can take overflow leads."
        }
      },
      fetchMock as typeof fetch
    );

    const options = fetchMock.mock.calls[0]?.[1] as RequestInit;
    const body = JSON.parse(String(options.body));
    expect(body.template_params).toMatchObject({
      from_email: "info@therenewabledirectory.co.uk",
      company_name: "Peak Renewables",
      contact_name: "Morgan Hill",
      email: "morgan@example.com",
      phone: "07000 000102",
      website: "https://peak.example",
      company_number: "12345678",
      vat_number: "GB123456789",
      mcs_number: "MCS-APP-102",
      recc_number: "RECC-123",
      hies_number: "HIES-456",
      trustmark_number: "TM-789",
      monthly_install_capacity: "11",
      survey_turnaround_days: "7",
      bus_registered: "true",
      services: "Air source heat pumps, Battery storage",
      areas_covered: "Derby, Sheffield",
      preferred_territories: "midlands, yorkshire",
      handles_bus_applications: "true",
      completes_heat_loss_calculations: "true",
      offers_solar: "false",
      offers_battery: "true",
      open_to_monthly_listing: "true",
      open_to_pay_per_install: "false",
      notes: "Can take overflow leads.",
      application_company_name: "Peak Renewables",
      application_contact_name: "Morgan Hill",
      application_email: "morgan@example.com",
      application_phone: "07000 000102",
      application_website: "https://peak.example",
      application_company_number: "12345678",
      application_vat_number: "GB123456789",
      application_mcs_number: "MCS-APP-102",
      application_recc_number: "RECC-123",
      application_hies_number: "HIES-456",
      application_trustmark_number: "TM-789",
      application_monthly_install_capacity: "11",
      application_survey_turnaround_days: "7",
      application_bus_registered: "true",
      application_services: "Air source heat pumps, Battery storage",
      application_preferred_territories: "midlands, yorkshire",
      application_areas_covered: "Derby, Sheffield",
      application_handles_bus_applications: "true",
      application_completes_heat_loss_calculations: "true",
      application_offers_solar: "false",
      application_offers_battery: "true",
      application_open_to_monthly_listing: "true",
      application_open_to_pay_per_install: "false",
      application_notes: "Can take overflow leads.",
      application_summary: expect.stringContaining("Company: Peak Renewables")
    });
  });

  it("only sends queued emails when a recipient email is present", async () => {
    const insertCalls: unknown[] = [];
    const updates: unknown[] = [];
    const fakeSupabase = {
      from() {
        return {
          insert(value: unknown) {
            insertCalls.push(value);
            return {
              select() {
                return {
                  async single() {
                    return { data: { id: "notification-1" }, error: null };
                  }
                };
              }
            };
          },
          update(value: unknown) {
            updates.push(value);
            return {
              async eq() {
                return { data: null, error: null };
              }
            };
          }
        };
      }
    };

    const sendEmail = vi.fn(async () => ({ ok: true as const, responseText: "OK" }));
    const sentResult = await queueEmailNotification(
      {
        eventType: "lead.received",
        recipientEmail: "automojic@proton.me",
        recipientRole: "admin",
        subject: "Subject",
        body: "Body",
        payload: { leadId: "lead-1" }
      },
      { supabase: fakeSupabase as never, sendEmail }
    );

    expect(sentResult).toEqual({ ok: true, status: "sent" });
    expect(sendEmail).toHaveBeenCalledTimes(1);
    expect(updates).toContainEqual(expect.objectContaining({ status: "sent" }));

    insertCalls.length = 0;
    updates.length = 0;
    sendEmail.mockClear();

    const queuedResult = await queueEmailNotification(
      {
        eventType: "lead.received",
        recipientRole: "admin",
        subject: "Subject",
        body: "Body",
        payload: { leadId: "lead-1" }
      },
      { supabase: fakeSupabase as never, sendEmail }
    );

    expect(queuedResult).toEqual({ ok: true });
    expect(sendEmail).not.toHaveBeenCalled();
    expect(updates).toHaveLength(0);
  });
});
