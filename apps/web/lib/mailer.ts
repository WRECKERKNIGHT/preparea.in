export interface MailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

/**
 * Sends the login OTP by email. Uses Resend when RESEND_API_KEY is configured.
 * Falls back to logging the code so local development keeps working.
 */
export async function sendOtpEmail(
  to: string,
  code: string
): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const from =
    process.env.RESEND_FROM ?? "PrepArea <onboarding@preparea.in>";
  const subject = "Your PrepArea verification code";

  const text = `Your PrepArea verification code is ${code}.\n\nIt expires in 10 minutes. If you didn't request this, you can ignore this email.`;
  const html = `<div style="font-family: Arial, sans-serif; color:#0f172a; line-height:1.6">
    <p>Here's your PrepArea verification code:</p>
    <p style="font-size:28px; font-weight:700; letter-spacing:6px; margin:16px 0">${code}</p>
    <p>It expires in 10 minutes. If you didn't request this, you can ignore this email.</p>
  </div>`;

  if (key) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to: [to], subject, text, html }),
    });
    if (!res.ok) throw new Error(`Email send failed: ${res.status}`);
    return;
  }

  console.log(`[preparea-mailer:dev] OTP for ${to}: ${code}`);
}