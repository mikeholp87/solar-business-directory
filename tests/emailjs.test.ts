import { afterEach, describe, expect, it, vi } from "vitest";
import { queueEmailNotification } from "@/lib/notifications/email";
import { sendNotificationEmailViaEmailJs } from "@/lib/notifications/emailjs";

afterEach(() => {
  delete process.env.EMAILJS_SERVICE_ID;
  delete process.env.EMAILJS_TEMPLATE_ID;
  delete process.env.EMAILJS_PUBLIC_KEY;
  delete process.env.EMAILJS_PRIVATE_KEY;
  delete process.env.EMAILJS_FROM_NAME;
});

describe("EmailJS notifications", () => {
  it("posts the expected payload to the EmailJS send endpoint", async () => {
    process.env.EMAILJS_SERVICE_ID = "service_123";
    process.env.EMAILJS_TEMPLATE_ID = "template_456";
    process.env.EMAILJS_PUBLIC_KEY = "public_789";
    process.env.EMAILJS_PRIVATE_KEY = "private_abc";
    process.env.EMAILJS_FROM_NAME = "Solar Directory";

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
        subject: "New lead assigned",
        message: "Lead body",
        body: "Lead body",
        event_type: "lead.received",
        recipient_role: "admin",
        payload_json: "{\"leadId\":\"lead-1\"}"
      }
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
