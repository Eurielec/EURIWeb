import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendVerificationEmail(email: string, code: string) {
  const html = `
    <div style="font-family: Helvetica, Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #eee;">
      <div style="background: #dc2626; padding: 24px 32px;">
        <h1 style="color: white; font-size: 20px; font-weight: 900; margin: 0; text-transform: uppercase; letter-spacing: 2px;">
          Eurielec
        </h1>
      </div>
      <div style="padding: 32px;">
        <h2 style="color: #1a1a1a; font-size: 22px; font-weight: 700; margin: 0 0 8px 0;">
          Verifica tu cuenta
        </h2>
        <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 0 0 24px 0;">
          Introduce el siguiente código en la web para activar tu cuenta de Eurielec:
        </p>
        <div style="background: #f8f8f8; border: 2px solid #dc2626; border-radius: 12px; padding: 20px; text-align: center; margin: 0 0 24px 0;">
          <span style="font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #dc2626; font-family: Helvetica, monospace;">
            ${code}
          </span>
        </div>
        <p style="color: #999; font-size: 12px; margin: 0;">
          Este código expira en <strong>15 minutos</strong>. Si no has solicitado este registro, ignora este email.
        </p>
      </div>
      <div style="background: #f8f8f8; padding: 16px 32px; border-top: 1px solid #eee;">
        <p style="color: #bbb; font-size: 11px; margin: 0; text-align: center;">
          Eurielec &amp; EESTEC LC Madrid
        </p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"Eurielec" <${process.env.SMTP_EMAIL}>`,
    to: email,
    subject: `${code} — Código de verificación Eurielec`,
    html,
  });
}
