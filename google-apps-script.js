function doPost(e) {

  var RECIPIENT_EMAIL = "TUMHARI_GMAIL@gmail.com"; // ← Yahan apni email likho

  // ── Parse form data ──────────────────────────────────────────
  var data = JSON.parse(e.postData.contents);
  var name    = data.name    || "N/A";
  var email   = data.email   || "N/A";
  var phone   = data.phone   || "Not provided";
  var message = data.message || "N/A";
  var time    = new Date().toLocaleString("en-PK", { timeZone: "Asia/Karachi" });

  // ── Professional HTML Email Template ────────────────────────
  var htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Form Submission</title>
</head>
<body style="margin:0;padding:0;background-color:#0A0F1E;font-family:'Segoe UI',Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0A0F1E;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- ══ HEADER ══ -->
          <tr>
            <td style="background:linear-gradient(135deg,#0d1a0d 0%,#0a1a10 100%);border-radius:16px 16px 0 0;padding:36px 40px;text-align:center;border:1px solid rgba(65,235,170,0.25);border-bottom:none;">
              
              <!-- Logo Circle -->
              <table cellpadding="0" cellspacing="0" style="margin:0 auto 16px;">
                <tr>
                  <td style="width:56px;height:56px;background:linear-gradient(135deg,#41ebaa,#10a84f);border-radius:50%;text-align:center;vertical-align:middle;">
                    <span style="font-size:28px;font-weight:900;color:#ffffff;line-height:56px;">Q</span>
                  </td>
                </tr>
              </table>

              <h1 style="margin:0 0 4px;font-size:22px;font-weight:800;color:#ffffff;letter-spacing:0.5px;">
                Qwetrum Technologies
              </h1>
              <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.45);letter-spacing:1.5px;text-transform:uppercase;">
                New Contact Form Submission
              </p>
            </td>
          </tr>

          <!-- ══ ALERT BADGE ══ -->
          <tr>
            <td style="background:#0F1425;padding:0 40px;border-left:1px solid rgba(65,235,170,0.25);border-right:1px solid rgba(65,235,170,0.25);">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:20px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
                    <table cellpadding="0" cellspacing="0" style="background:rgba(65,235,170,0.08);border:1px solid rgba(65,235,170,0.25);border-radius:10px;padding:12px 20px;">
                      <tr>
                        <td>
                          <span style="font-size:18px;vertical-align:middle;">🔔</span>
                          <span style="font-size:14px;font-weight:600;color:#41ebaa;vertical-align:middle;margin-left:8px;">
                            You have received a new inquiry!
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ══ BODY ══ -->
          <tr>
            <td style="background:#0F1425;padding:30px 40px;border-left:1px solid rgba(65,235,170,0.25);border-right:1px solid rgba(65,235,170,0.25);">

              <!-- Section heading -->
              <p style="margin:0 0 20px;font-size:13px;font-weight:700;color:rgba(255,255,255,0.4);letter-spacing:1.5px;text-transform:uppercase;">
                Contact Details
              </p>

              <!-- Name -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px;">
                <tr>
                  <td style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:16px 20px;">
                    <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#41ebaa;letter-spacing:1px;text-transform:uppercase;">👤 Full Name</p>
                    <p style="margin:0;font-size:16px;font-weight:600;color:#ffffff;">${name}</p>
                  </td>
                </tr>
              </table>

              <!-- Email -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px;">
                <tr>
                  <td style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:16px 20px;">
                    <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#41ebaa;letter-spacing:1px;text-transform:uppercase;">✉️ Email Address</p>
                    <p style="margin:0;font-size:16px;font-weight:600;color:#ffffff;">
                      <a href="mailto:${email}" style="color:#5BA5FF;text-decoration:none;">${email}</a>
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Phone -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px;">
                <tr>
                  <td style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:16px 20px;">
                    <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#41ebaa;letter-spacing:1px;text-transform:uppercase;">📞 Phone Number</p>
                    <p style="margin:0;font-size:16px;font-weight:600;color:#ffffff;">${phone}</p>
                  </td>
                </tr>
              </table>

              <!-- Message -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:6px;">
                <tr>
                  <td style="background:rgba(65,235,170,0.04);border:1px solid rgba(65,235,170,0.15);border-radius:12px;padding:20px;">
                    <p style="margin:0 0 10px;font-size:11px;font-weight:600;color:#41ebaa;letter-spacing:1px;text-transform:uppercase;">💬 Message</p>
                    <p style="margin:0;font-size:15px;color:rgba(255,255,255,0.82);line-height:1.75;">${message}</p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- ══ TIMESTAMP ══ -->
          <tr>
            <td style="background:#0F1425;padding:0 40px 24px;border-left:1px solid rgba(65,235,170,0.25);border-right:1px solid rgba(65,235,170,0.25);">
              <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.3);text-align:right;">
                🕐 Received: ${time} (PKT)
              </p>
            </td>
          </tr>

          <!-- ══ REPLY BUTTON ══ -->
          <tr>
            <td style="background:#0F1425;padding:0 40px 32px;border-left:1px solid rgba(65,235,170,0.25);border-right:1px solid rgba(65,235,170,0.25);text-align:center;">
              <a href="mailto:${email}?subject=Re: Your Inquiry — Qwetrum Technologies"
                 style="display:inline-block;background:linear-gradient(135deg,#41ebaa,#10a84f);color:#000000;font-size:15px;font-weight:700;text-decoration:none;padding:14px 36px;border-radius:50px;letter-spacing:0.3px;">
                ↩ Reply to ${name}
              </a>
            </td>
          </tr>

          <!-- ══ FOOTER ══ -->
          <tr>
            <td style="background:#080d1a;border-radius:0 0 16px 16px;padding:24px 40px;border:1px solid rgba(65,235,170,0.25);border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
              
              <!-- Social links -->
              <table cellpadding="0" cellspacing="0" style="margin:0 auto 16px;">
                <tr>
                  <td style="padding:0 8px;">
                    <a href="https://www.linkedin.com/company/qwetrum-technologies/" style="color:#41ebaa;font-size:12px;font-weight:600;text-decoration:none;">LinkedIn</a>
                  </td>
                  <td style="color:rgba(255,255,255,0.2);font-size:12px;">|</td>
                  <td style="padding:0 8px;">
                    <a href="https://www.facebook.com/share/18fjqTEg9R/" style="color:#41ebaa;font-size:12px;font-weight:600;text-decoration:none;">Facebook</a>
                  </td>
                  <td style="color:rgba(255,255,255,0.2);font-size:12px;">|</td>
                  <td style="padding:0 8px;">
                    <a href="https://www.instagram.com/qwetrumtechnologies" style="color:#41ebaa;font-size:12px;font-weight:600;text-decoration:none;">Instagram</a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 6px;font-size:13px;color:rgba(255,255,255,0.5);">
                © 2026 <strong style="color:rgba(255,255,255,0.75);">Qwetrum Technologies</strong>. All rights reserved.
              </p>
              <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.25);">
                This email was automatically generated from your website contact form.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;

  // ── Plain text fallback ──────────────────────────────────────
  var plainBody =
    "NEW CONTACT FORM SUBMISSION — Qwetrum Technologies\n" +
    "====================================================\n\n" +
    "Name    : " + name    + "\n" +
    "Email   : " + email   + "\n" +
    "Phone   : " + phone   + "\n\n" +
    "Message :\n" + message + "\n\n" +
    "Received: " + time;

  // ── Send email ───────────────────────────────────────────────
  MailApp.sendEmail({
    to      : RECIPIENT_EMAIL,
    subject : "🔔 New Inquiry from " + name + " — Qwetrum Technologies",
    body    : plainBody,
    htmlBody: htmlBody,
    replyTo : email
  });

  // ── CORS-friendly response ───────────────────────────────────
  return ContentService
    .createTextOutput(JSON.stringify({ status: "success" }))
    .setMimeType(ContentService.MimeType.JSON);
}
