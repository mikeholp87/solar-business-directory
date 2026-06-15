export function applicationReceivedTemplate(application: {
  companyName: string;
  contactName: string;
  email: string;
  territoryCount?: number;
}) {
  const subject = `New installer application: ${application.companyName}`;
  const body = [
    `A new installer application has been received.`,
    `Company: ${application.companyName}`,
    `Contact: ${application.contactName}`,
    `Email: ${application.email}`,
    `Preferred territories: ${application.territoryCount ?? 0}`
  ].join("\n");

  return { subject, body };
}
