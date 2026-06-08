const { Resend } = require("resend");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed"
    };
  }

  const params = new URLSearchParams(event.body);
  const firstName = params.get("first_name");
  const lastName = params.get("last_name");
  const email = params.get("email");
  const cellPhone = params.get("cell_phone");

  const resend = new Resend(process.env.RESEND_API_KEY123);

  await resend.contacts.create({
    audienceId: process.env.RESEND_AUDIENCE_ID,
    email,
    firstName,
    lastName,
    unsubscribed: true,
    properties: {
      cell_phone: cellPhone
    }
  });

  const confirmUrl = `${process.env.SITE_URL}/confirmed?email=${encodeURIComponent(email)}`;

  await resend.emails.send({
    from: process.env.SEND_EMAIL_FROM,
    to: email,
    subject: "Confirm your email to get instant access",
    html: `
      <div style="font-family: Arial, sans-serif; background: #000; color: #fff; padding: 40px;">
        <h1>Confirm your email</h1>
        <p>Click below to confirm your email and get instant access.</p>
        <a href="${confirmUrl}" style="display:inline-block;padding:16px 24px;background:#b33434;color:#fff;text-decoration:none;font-weight:bold;">
          Confirm My Email
        </a>
      </div>
    `
  });

  return {
    statusCode: 303,
    headers: {
      Location: "/final.html"
    }
  };
};