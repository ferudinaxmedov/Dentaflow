import { Resend } from 'resend'

export async function sendWelcomeEmail(params: {
  to: string
  clinicName: string
  slug: string
  adminName: string
  plan: string
}) {
  const { to, clinicName, slug, adminName, plan } = params
  console.log('[welcome-email] RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY)
  console.log('[welcome-email] Sending to:', to)

  const resend = new Resend(process.env.RESEND_API_KEY)
  const trialDays = plan === 'pro' ? 7 : 14

  try {
    const result = await resend.emails.send({
      from: 'DentaFlow <noreply@dentaflow.uz>',
      to,
      subject: 'Xush kelibsiz! ' + clinicName + ' klinikangiz tayyor',
      html: '<h1>Xush kelibsiz, ' + adminName + '!</h1><p>' + clinicName + ' klinikangiz yaratildi.</p><p>Bepul sinov: ' + trialDays + ' kun</p><a href="https://' + slug + '.dentaflow.uz/login">Kirish</a>'
    })
    console.log('[welcome-email] Result:', JSON.stringify(result))
  } catch(err) {
    console.error('[welcome-email] Error:', err)
  }
}
