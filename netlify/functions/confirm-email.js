const { Resend } = require("resend");

exports.handler = async (event) => {
  try {
    const email = event.queryStringParameters.email;

    if (!email) {
      return {
        statusCode: 302,
        headers: {
          Location: "/final.html"
        }
      };
    }

    const resend = new Resend(process.env.RESEND_API_KEY123);

    const { data, error } = await resend.contacts.update({
      email,
      unsubscribed: false
    });

    if (error) {
      console.error("Resend update error:", error);
      return {
        statusCode: 500,
        body: JSON.stringify(error)
      };
    }

    return {
      statusCode: 302,
      headers: {
        Location: "/confirmed.html"
      }
    };
  } catch (error) {
    console.error("Confirm email crash:", error);
    return {
      statusCode: 500,
      body: "There was an error confirming the email."
    };
  }
};