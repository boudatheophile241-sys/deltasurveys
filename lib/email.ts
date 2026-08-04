/**
 * Envoi d'e-mails via Resend (https://resend.com).
 * Activé automatiquement dès que RESEND_API_KEY est défini (ex: sur Vercel).
 * Sans clé, la fonction ne fait rien (les candidatures restent enregistrées
 * et consultables dans le tableau de bord admin).
 */

export const CAREERS_NOTIFY_EMAIL =
  process.env.CAREERS_NOTIFY_EMAIL || "contact@deltasurveys.com";

const FROM = process.env.RESEND_FROM || "Delta Surveys <onboarding@resend.dev>";

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ ok: boolean; skipped?: boolean }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, skipped: true };
  if (!to) return { ok: false };

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: FROM, to, subject, html }),
    });
    return { ok: res.ok };
  } catch {
    return { ok: false };
  }
}

/** Gabarit e-mail simple et cohérent avec la marque. */
export function emailShell(title: string, body: string): string {
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;background:#f4f6fb;padding:24px">
    <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e5e9f5">
      <div style="background:#0b1140;padding:20px 28px">
        <span style="color:#fff;font-size:20px;font-weight:800;letter-spacing:-.5px">DELTA<span style="color:#ed1c24">.</span> <span style="color:#ed1c24;font-size:12px">SURVEYS</span></span>
      </div>
      <div style="padding:28px">
        <h1 style="margin:0 0 12px;font-size:20px;color:#151d5e">${title}</h1>
        <div style="font-size:14px;line-height:1.6;color:#334">${body}</div>
      </div>
      <div style="padding:16px 28px;border-top:1px solid #eef1fb;color:#94a3b8;font-size:12px">
        Delta Surveys — Topographie & Génie civil · Ouagadougou, Burkina Faso
      </div>
    </div>
  </div>`;
}
