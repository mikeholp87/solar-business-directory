type EmailJsConfig = {
  serviceId: string;
  templateId: string;
  publicKey: string;
  privateKey?: string;
  fromName: string;
  fromEmail: string;
};

type TemplateValue = string | number | boolean | null | undefined | readonly unknown[] | Record<string, unknown>;

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
    fromName: readEnv("EMAILJS_FROM_NAME") ?? "Solar Business Directory",
    fromEmail: readEnv("EMAILJS_FROM_EMAIL") ?? "info@therenewabledirectory.co.uk"
  };
}

function formatTemplateValue(value: TemplateValue): string {
  if (value === null || value === undefined) return "";
  if (Array.isArray(value)) {
    return value.map((item) => formatTemplateValue(item as TemplateValue)).filter(Boolean).join(", ");
  }
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return String(value);
}

function toStringOrEmpty(value: unknown) {
  return formatTemplateValue(value as TemplateValue);
}

function buildBaseTemplateParams(input: EmailJsNotificationInput, fromName: string, fromEmail: string) {
  const payloadEntries = Object.fromEntries(
    Object.entries(input.payload ?? {}).map(([key, value]) => [key, formatTemplateValue(value as TemplateValue)])
  );

  return {
    to_email: input.recipientEmail,
    to_name: input.recipientEmail,
    from_name: fromName,
    from_email: fromEmail,
    subject: input.subject,
    message: input.body,
    body: input.body,
    event_type: input.eventType,
    recipient_role: input.recipientRole ?? "",
    payload_json: JSON.stringify(input.payload ?? {}),
    ...payloadEntries
  };
}

function buildApplicationTemplateParams(input: EmailJsNotificationInput, fromName: string, fromEmail: string) {
  const payload = input.payload ?? {};
  const services = Array.isArray(payload.services) ? payload.services : [];
  const territories = Array.isArray(payload.preferred_territories) ? payload.preferred_territories : [];
  const areasCovered = Array.isArray(payload.areas_covered) ? payload.areas_covered : [];

  return {
    ...buildBaseTemplateParams(input, fromName, fromEmail),
    application_company_name: toStringOrEmpty(payload.company_name),
    application_contact_name: toStringOrEmpty(payload.contact_name),
    application_email: toStringOrEmpty(payload.email),
    application_phone: toStringOrEmpty(payload.phone),
    application_website: toStringOrEmpty(payload.website),
    application_company_number: toStringOrEmpty(payload.company_number),
    application_vat_number: toStringOrEmpty(payload.vat_number),
    application_mcs_number: toStringOrEmpty(payload.mcs_number),
    application_recc_number: toStringOrEmpty(payload.recc_number),
    application_hies_number: toStringOrEmpty(payload.hies_number),
    application_trustmark_number: toStringOrEmpty(payload.trustmark_number),
    application_monthly_install_capacity: toStringOrEmpty(payload.monthly_install_capacity),
    application_survey_turnaround_days: toStringOrEmpty(payload.survey_turnaround_days),
    application_bus_registered: toStringOrEmpty(payload.bus_registered),
    application_services: formatTemplateValue(services),
    application_preferred_territories: formatTemplateValue(territories),
    application_areas_covered: formatTemplateValue(areasCovered),
    application_handles_bus_applications: toStringOrEmpty(payload.handles_bus_applications),
    application_completes_heat_loss_calculations: toStringOrEmpty(payload.completes_heat_loss_calculations),
    application_offers_solar: toStringOrEmpty(payload.offers_solar),
    application_offers_battery: toStringOrEmpty(payload.offers_battery),
    application_open_to_monthly_listing: toStringOrEmpty(payload.open_to_monthly_listing),
    application_open_to_pay_per_install: toStringOrEmpty(payload.open_to_pay_per_install),
    application_notes: toStringOrEmpty(payload.notes),
    application_summary: [
      `Company: ${toStringOrEmpty(payload.company_name)}`,
      `Contact: ${toStringOrEmpty(payload.contact_name)}`,
      `Email: ${toStringOrEmpty(payload.email)}`,
      `Phone: ${toStringOrEmpty(payload.phone)}`,
      `MCS: ${toStringOrEmpty(payload.mcs_number)}`,
      `Territories: ${formatTemplateValue(territories)}`
    ].join("\n")
  };
}

function buildTemplateParams(input: EmailJsNotificationInput, fromName: string, fromEmail: string) {
  if (input.eventType === "application.received") {
    return buildApplicationTemplateParams(input, fromName, fromEmail);
  }

  return buildBaseTemplateParams(input, fromName, fromEmail);
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
    template_params: buildTemplateParams(input, config.fromName, config.fromEmail)
    })
  });

  const text = await response.text();
  if (!response.ok) {
    return { ok: false as const, error: text || `EmailJS request failed with status ${response.status}` };
  }

  return { ok: true as const, responseText: text || "OK" };
}
