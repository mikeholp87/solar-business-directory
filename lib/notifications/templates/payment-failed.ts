export function paymentFailedTemplate(installer: { companyName: string; email?: string }) {
  const subject = `Payment issue detected for ${installer.companyName}`;
  const body = [
    `We detected a billing issue for ${installer.companyName}.`,
    `Please review your subscription status in the installer portal.`
  ].join("\n");

  return { subject, body, recipientEmail: installer.email };
}
