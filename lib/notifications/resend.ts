import { sendNotificationEmailViaEmailJs, type EmailJsNotificationInput } from "@/lib/notifications/emailjs";
import type { NotificationAttachment } from "@/lib/notifications/email";

function readEnv(name: string) {
  const value = process.env[name];
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export async function sendNotificationEmail(input: EmailJsNotificationInput & { attachments?: NotificationAttachment[] }, fetchImpl: typeof fetch = fetch) {
  const apiKey = readEnv("RESEND_API_KEY");
  if (!apiKey) return sendNotificationEmailViaEmailJs(input, fetchImpl);

  const fromEmail = readEnv("RESEND_FROM_EMAIL") ?? readEnv("EMAILJS_FROM_EMAIL") ?? "info@therenewabledirectory.co.uk";
  const fromName = readEnv("RESEND_FROM_NAME") ?? readEnv("EMAILJS_FROM_NAME") ?? "Solar Direct";
  const response = await fetchImpl("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: `${fromName} <${fromEmail}>`,
      to: [input.recipientEmail],
      subject: input.subject,
      text: input.body,
      html: input.body.split("\n").map((line) => `<p>${escapeHtml(line) || "&nbsp;"}</p>`).join(""),
      attachments: input.attachments?.map((attachment) => ({ filename: attachment.filename, content: Buffer.from(attachment.content).toString("base64") }))
    })
  });

  const text = await response.text();
  if (!response.ok) return { ok: false as const, error: text || `Resend request failed with status ${response.status}` };
  return { ok: true as const, responseText: text || "OK" };
}

function escapeHtml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}
