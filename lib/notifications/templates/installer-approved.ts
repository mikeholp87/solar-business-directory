export function installerApprovedTemplate(installer: { companyName: string; email?: string }) {
  const subject = `Your UKSD installer account is approved`;
  const body = [
    `Your installer profile for ${installer.companyName} has been approved.`,
    `You can now continue with onboarding and billing setup.`
  ].join("\n");

  return { subject, body, recipientEmail: installer.email };
}
