import { Resend } from "resend";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_FILES = 5;

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf"
]);

const DEFAULT_TO_EMAIL = "info@blueblockbuilds.com";
const DEFAULT_FROM_EMAIL = "onboarding@resend.dev";

function getCorsHeaders(request) {
  const origin = request.headers.get("Origin");

  const headers = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  if (origin) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers.Vary = "Origin";
  }

  return headers;
}

function jsonResponse(request, body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...getCorsHeaders(request)
    }
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

async function fileToBase64(file) {
  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);

  let binary = "";
  const chunkSize = 0x8000;

  for (let index = 0; index < bytes.length; index += chunkSize) {
    const chunk = bytes.subarray(index, index + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return btoa(binary);
}

function buildEmailHtml(values) {
  const fullName = `${values.firstName} ${values.lastName}`.trim();

  const rows = [
    ["Name", fullName],
    ["Email", values.email],
    ["Phone", values.phone || "Not provided"],
    ["Project location", values.projectLocation],
    ["Project type", values.projectType],
    ["Budget", values.budget || "Not provided"],
    ["Desired start date", values.startDate || "Not provided"],
    ["Description", values.description]
  ];

  const tableRows = rows
    .map(
      ([label, value]) => `
        <tr>
          <th
            align="left"
            valign="top"
            style="
              padding: 8px 16px 8px 0;
              color: #6b7280;
              font-size: 13px;
              font-weight: 600;
              white-space: nowrap;
            "
          >
            ${escapeHtml(label)}
          </th>

          <td
            valign="top"
            style="
              padding: 8px 0;
              color: #111827;
              font-size: 14px;
              white-space: pre-wrap;
            "
          >
            ${escapeHtml(value)}
          </td>
        </tr>
      `
    )
    .join("");

  return `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>New estimate request</title>
      </head>

      <body style="margin: 0; padding: 24px; background: #f3f4f6;">
        <div
          style="
            max-width: 680px;
            margin: 0 auto;
            padding: 24px;
            background: #ffffff;
            border-radius: 12px;
            font-family: Arial, Helvetica, sans-serif;
            line-height: 1.5;
          "
        >
          <h1
            style="
              margin: 0 0 20px;
              color: #111827;
              font-size: 22px;
            "
          >
            New estimate request
          </h1>

          <table
            role="presentation"
            style="
              width: 100%;
              border-collapse: collapse;
            "
          >
            ${tableRows}
          </table>
        </div>
      </body>
    </html>
  `;
}

function buildEmailText(values) {
  return [
    "New estimate request",
    "",
    `Name: ${values.firstName} ${values.lastName}`,
    `Email: ${values.email}`,
    `Phone: ${values.phone || "Not provided"}`,
    `Project location: ${values.projectLocation}`,
    `Project type: ${values.projectType}`,
    `Budget: ${values.budget || "Not provided"}`,
    `Desired start date: ${values.startDate || "Not provided"}`,
    "",
    "Description:",
    values.description
  ].join("\n");
}

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: getCorsHeaders(request)
    });
  }

  if (request.method !== "POST") {
    return jsonResponse(
      request,
      {
        success: false,
        error: "Method not allowed."
      },
      405
    );
  }

  if (!env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not configured.");

    return jsonResponse(
      request,
      {
        success: false,
        error: "Email service is not configured."
      },
      503
    );
  }

  let formData;

  try {
    formData = await request.formData();
  } catch (error) {
    console.error("Unable to read contact form data:", error);

    return jsonResponse(
      request,
      {
        success: false,
        error: "The submitted form could not be read."
      },
      400
    );
  }

  // Honeypot field. Bots that fill it receive a fake success response.
  if (String(formData.get("botcheck") || "").trim()) {
    return jsonResponse(request, {
      success: true
    });
  }

  const values = {
    firstName: String(formData.get("firstName") || "").trim(),
    lastName: String(formData.get("lastName") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    phone: String(formData.get("phone") || "").trim(),
    projectLocation: String(
      formData.get("projectLocation") || ""
    ).trim(),
    projectType: String(formData.get("projectType") || "").trim(),
    budget: String(formData.get("budget") || "").trim(),
    startDate: String(formData.get("startDate") || "").trim(),
    description: String(formData.get("description") || "").trim()
  };

  if (!values.firstName) {
    return jsonResponse(
      request,
      {
        success: false,
        error: "First name is required."
      },
      400
    );
  }

  if (!values.lastName) {
    return jsonResponse(
      request,
      {
        success: false,
        error: "Last name is required."
      },
      400
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    return jsonResponse(
      request,
      {
        success: false,
        error: "A valid email address is required."
      },
      400
    );
  }

  if (!values.projectLocation) {
    return jsonResponse(
      request,
      {
        success: false,
        error: "Project address or ZIP code is required."
      },
      400
    );
  }

  if (!values.projectType) {
    return jsonResponse(
      request,
      {
        success: false,
        error: "Project type is required."
      },
      400
    );
  }

  if (values.description.length < 20) {
    return jsonResponse(
      request,
      {
        success: false,
        error: "Project description must be at least 20 characters."
      },
      400
    );
  }

  const photos = formData
    .getAll("photos")
    .filter(
      (entry) =>
        entry instanceof File &&
        entry.size > 0
    );

  if (photos.length > MAX_FILES) {
    return jsonResponse(
      request,
      {
        success: false,
        error: `You may upload up to ${MAX_FILES} files.`
      },
      400
    );
  }

  const attachments = [];

  for (const file of photos) {
    if (!ALLOWED_TYPES.has(file.type)) {
      return jsonResponse(
        request,
        {
          success: false,
          error: `"${file.name}" is not a supported file type.`
        },
        400
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return jsonResponse(
        request,
        {
          success: false,
          error: `"${file.name}" must be 5 MB or smaller.`
        },
        400
      );
    }

    attachments.push({
      filename: file.name,
      content: await fileToBase64(file)
    });
  }

  const resend = new Resend(env.RESEND_API_KEY);

  const fullName =
    `${values.firstName} ${values.lastName}`.trim();

  try {
    const { data, error } = await resend.emails.send({
      from: env.CONTACT_FROM_EMAIL || DEFAULT_FROM_EMAIL,
      to: [env.CONTACT_TO_EMAIL || DEFAULT_TO_EMAIL],
      replyTo: values.email,
      subject: `Estimate request from ${fullName}`,
      html: buildEmailHtml(values),
      text: buildEmailText(values),
      attachments:
        attachments.length > 0
          ? attachments
          : undefined
    });

    if (error) {
      console.error("Resend API error:", error);

      return jsonResponse(
        request,
        {
          success: false,
          error: "The email could not be sent."
        },
        502
      );
    }

    return jsonResponse(request, {
      success: true,
      id: data?.id || null
    });
  } catch (error) {
    console.error("Unexpected contact form error:", error);

    return jsonResponse(
      request,
      {
        success: false,
        error: "The email could not be sent."
      },
      500
    );
  }
}