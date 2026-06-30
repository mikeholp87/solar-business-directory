type EmailJsConfig = {
  serviceId: string;
  templateId: string;
  publicKey: string;
  privateKey?: string;
  fromName: string;
};

function readEnv(name: string) {
  const value = process.env[name];
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export function getEmailJsConfig(): EmailJsConfig | null {
  const serviceId = readEnv("EMAILJS_SERVICE_ID");
  const templateId = readEnv("EMAILJS_TEMPLATE_ID");
  const publicKey = readEnv("EMAILJS_PUBLIC_KEY");
  if (!serviceId || !templateId || !publicKey) return null;

  return {
    serviceId,
    templateId,
    publicKey,
    privateKey: readEnv("EMAILJS_PRIVATE_KEY") ?? undefined,
    fromName: readEnv("EMAILJS_FROM_NAME") ?? "Solar Business Directory"
  };
}

export type EmailJsNotificationInput = {
  recipientEmail: string;
  subject: string;
  body: string;
  eventType: string;
  payload?: Record<string, unknown>;
  recipientRole?: "admin" | "installer";
};

export async function sendNotificationEmailViaEmailJs(
  input: EmailJsNotificationInput,
  fetchImpl: typeof fetch = fetch
) {
  const config = getEmailJsConfig();
  if (!config) {
    return { ok: false as const, skipped: true as const, error: "EmailJS is not configured" };
  }

  const response = await fetchImpl("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      service_id: config.serviceId,
      template_id: config.templateId,
      user_id: config.publicKey,
      ...(config.privateKey ? { accessToken: config.privateKey } : {}),
      template_params: {
        to_email: input.recipientEmail,
        to_name: input.recipientEmail,
        from_name: config.fromName,
        subject: input.subject,
        message: input.body,
        body: input.body,
        event_type: input.eventType,
        recipient_role: input.recipientRole ?? "",
        payload_json: JSON.stringify(input.payload ?? {})
      }
    })
  });

  const text = await response.text();
  if (!response.ok) {
    return { ok: false as const, error: text || `EmailJS request failed with status ${response.status}` };
  }

  return { ok: true as const, responseText: text || "OK" };
}
