export default async (request) => {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const contentType = request.headers.get("content-type") || "";
    let email = "";

    if (contentType.includes("application/json")) {
      const body = await request.json();
      email = String(body?.email || "").trim();
    } else if (
      contentType.includes("application/x-www-form-urlencoded") ||
      contentType.includes("multipart/form-data")
    ) {
      const form = await request.formData();
      email = String(form.get("email") || "").trim();
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

    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: TO_EMAIL,
        subject: "New shop notify signup",
        text: `New signup: ${email}\n\nSource: /shop.html`
      })
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

