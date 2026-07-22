import nodemailer from 'nodemailer';

export async function sendRealEmail({ to, subject, title, message, opportunityTitle, opportunityLink }) {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.EMAIL_FROM || '"DarkKnight AI" <no-reply@darknight.ai>';

  let transporter;

  if (host && user && pass) {
    transporter = nodemailer.createTransport({
      host,
      port: Number(port),
      secure: Number(port) === 465,
      auth: { user, pass },
    });
  } else {
    // Generate test account if no SMTP settings provided
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #050505; color: #F7F7F7; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background-color: #101010; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 32px; box-shadow: 0 0 30px rgba(59,130,246,0.1); }
        .header { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 16px; }
        .logo-badge { background: linear-gradient(135deg, #3B82F6, #00D9FF); color: #ffffff; font-weight: bold; width: 36px; height: 36px; border-radius: 10px; display: inline-flex; align-items: center; justify-content: center; font-size: 14px; }
        .brand { font-size: 20px; font-weight: 700; color: #F7F7F7; letter-spacing: 0.05em; }
        .content-title { font-size: 22px; color: #ffffff; margin-top: 0; margin-bottom: 12px; font-weight: 600; }
        .message-body { font-size: 15px; line-height: 1.6; color: #8B8B8B; margin-bottom: 24px; }
        .opp-card { background: #171717; border: 1px solid rgba(59,130,246,0.3); border-radius: 12px; padding: 16px; margin-bottom: 24px; }
        .opp-title { font-size: 16px; color: #3B82F6; font-weight: 600; margin-bottom: 6px; }
        .btn { display: inline-block; background-color: #3B82F6; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500; font-size: 14px; box-shadow: 0 0 15px rgba(59,130,246,0.4); }
        .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.05); font-size: 12px; color: #555555; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <span class="logo-badge">DK</span>
          <span class="brand">DARKNIGHT AI</span>
        </div>
        <h2 class="content-title">${title || 'Notification Alert'}</h2>
        <p class="message-body">${message}</p>
        ${opportunityTitle ? `
          <div class="opp-card">
            <div class="opp-title">${opportunityTitle}</div>
            <p style="margin:0; font-size:13px; color:#8B8B8B;">A new opportunity matching your profile has been identified.</p>
          </div>
        ` : ''}
        ${opportunityLink ? `
          <a href="${opportunityLink}" class="btn" target="_blank">View Opportunity</a>
        ` : ''}
        <div class="footer">
          Sent by DarkKnight AI — Agentic Career Platform<br>
          The DN Production
        </div>
      </div>
    </body>
    </html>
  `;

  const info = await transporter.sendMail({
    from,
    to: to || process.env.DEFAULT_RECIPIENT_EMAIL || 'user@example.com',
    subject: subject || title || 'DarkKnight AI Alert',
    text: `${title}\n\n${message}`,
    html: htmlContent,
  });

  const previewUrl = nodemailer.getTestMessageUrl(info);
  return { success: true, messageId: info.messageId, previewUrl };
}
