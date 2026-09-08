export default async (request) => {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const contentType = request.headers.get("content-type") || "";
    let email = "";
    let name = "";
    let message = "";
    let source = "";

    if (contentType.includes("application/json")) {
      const body = await request.json();
      email = String(body?.email || "").trim();
      name = String(body?.name || "").trim();
      message = String(body?.message || "").trim();
      source = String(body?.source || "").trim();
    } else if (
      contentType.includes("application/x-www-form-urlencoded") ||
      contentType.includes("multipart/form-data")
    ) {
      const form = await request.formData();
      email = String(form.get("email") || "").trim();
      name = String(form.get("name") || "").trim();
      message = String(form.get("message") || "").trim();
      source = String(form.get("source") || "").trim();
    }

    if (!email || !email.includes("@")) {
      return Response.json(
        { ok: false, error: "Please enter a valid email." },
        { status: 400 }
      );
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const TO_EMAIL = process.env.NOTIFY_TO_EMAIL;
    const FROM_EMAIL = process.env.NOTIFY_FROM_EMAIL || "onboarding@resend.dev";

    if (!RESEND_API_KEY || !TO_EMAIL) {
      return Response.json(
        {
          ok: false,
          error:
            "Server not configured. Missing RESEND_API_KEY or NOTIFY_TO_EMAIL."
        },
        { status: 500 }
      );
    }

    // This one endpoint handles two shapes of submission: a quick "notify
    // me" signup from the Ventures page (just an email), and a full contact
    // form from the homepage (email + message). We branch on whether a
    // message was sent rather than duplicating the Resend-calling logic.
    const isContactForm = message.length > 0;
    const subject = isContactForm
      ? `New message from ${name || email} via nicole-wu.com`
      : "New ventures notify signup";
    const text = isContactForm
      ? `From: ${name || "(no name given)"} <${email}>\nSource: ${source || "/index.html"}\n\n${message}`
      : `New signup: ${email}\n\nSource: ${source || "/ventures.html"}`;

    const resendPayload = {
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject,
      text
    };
    // Let Nicole hit "reply" and land straight in the visitor's inbox.
    if (isContactForm) {
      resendPayload.reply_to = email;
    }

    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(resendPayload)
    });

    if (!resp.ok) {
      const detail = await resp.text().catch(() => "");
      return Response.json(
        { ok: false, error: "Email send failed.", detail },
        { status: 502 }
      );
    }

    return Response.json({ ok: true });
  } catch (e) {
    return Response.json(
      { ok: false, error: "Unexpected server error." },
      { status: 500 }
    );
  }
};
