export async function sendWelcomeEmail(email: string, slug: string, clinicName: string) {
  const clinicUrl = `https://${slug}.dentaflow.uz`;
  console.log(`[welcome-email] To: ${email}`);
  console.log(`[welcome-email] Clinic: ${clinicName} → ${clinicUrl}`);
  console.log(`[welcome-email] Message: Your clinic ${clinicUrl} is ready! Log in with your email.`);
  // TODO: integrate with email provider (Resend / Sendgrid / Eskiz)
}
