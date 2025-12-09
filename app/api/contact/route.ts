import { NextResponse } from "next/server";
import { Resend } from "resend";

// Rate limiting store (in-memory for simplicity, use Redis in production)
const rateLimitStore = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 3; // Max 3 requests per minute per IP

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Simple honeypot and spam detection
function isSpam(data: { name: string; email: string; message: string; honeypot?: string }): boolean {
  // Check honeypot field (should be empty)
  if (data.honeypot && data.honeypot.length > 0) {
    return true;
  }

  // Check for common spam patterns
  const spamPatterns = [
    /\b(viagra|casino|lottery|winner|prize|click here|buy now)\b/i,
    /(.)\1{10,}/, // Repeated characters
    /<script|<iframe|javascript:/i, // Script injection attempts
  ];

  const content = `${data.name} ${data.message}`;
  return spamPatterns.some((pattern) => pattern.test(content));
}

// Rate limiting check
function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record) {
    rateLimitStore.set(ip, { count: 1, timestamp: now });
    return { allowed: true };
  }

  // Reset if window has passed
  if (now - record.timestamp > RATE_LIMIT_WINDOW) {
    rateLimitStore.set(ip, { count: 1, timestamp: now });
    return { allowed: true };
  }

  // Increment count
  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    const retryAfter = Math.ceil((RATE_LIMIT_WINDOW - (now - record.timestamp)) / 1000);
    return { allowed: false, retryAfter };
  }

  record.count++;
  return { allowed: true };
}

// Cleanup old rate limit entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitStore.entries()) {
    if (now - record.timestamp > RATE_LIMIT_WINDOW * 2) {
      rateLimitStore.delete(ip);
    }
  }
}, RATE_LIMIT_WINDOW);

export async function POST(request: Request) {
  try {
    // Get client IP for rate limiting
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor?.split(",")[0].trim() || "unknown";

    // Check rate limit
    const rateLimitResult = checkRateLimit(ip);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "rate_limit",
          message: "Too many requests. Please try again later.",
          retryAfter: rateLimitResult.retryAfter,
        },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { name, email, message, honeypot } = body;

    // Validate required fields
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "validation", field: "name", message: "Name is required and must be at least 2 characters." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: "validation", field: "email", message: "A valid email address is required." },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || message.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: "validation", field: "message", message: "Message is required and must be at least 10 characters." },
        { status: 400 }
      );
    }

    // Check for spam
    if (isSpam({ name, email, message, honeypot })) {
      // Return success to not give hints to spammers, but don't send email
      console.log("Spam detected from:", email);
      return NextResponse.json({ success: true, message: "Message sent successfully." });
    }

    // Sanitize inputs
    const sanitizedName = name.trim().slice(0, 100);
    const sanitizedEmail = email.trim().toLowerCase().slice(0, 254);
    const sanitizedMessage = message.trim().slice(0, 5000);

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      return NextResponse.json(
        { success: false, error: "server", message: "Email service is not configured." },
        { status: 500 }
      );
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: "KamiDev Portfolio <contact@kamidev.app>",
      to: ["jorgemedrano@kamidev.app"],
      replyTo: sanitizedEmail,
      subject: `🚀 New Portfolio Message from ${sanitizedName}`,
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a0a0a; color: #ffffff;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; padding: 40px; border: 1px solid rgba(255,255,255,0.1);">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="margin: 0; font-size: 28px; font-weight: 700; background: linear-gradient(90deg, #00d4ff, #00ff88); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
          New Transmission Received
        </h1>
        <p style="margin: 8px 0 0; color: #888; font-size: 14px;">KamiDev Portfolio Contact Form</p>
      </div>
      
      <!-- Contact Info -->
      <div style="background: rgba(0,0,0,0.3); border-radius: 12px; padding: 24px; margin-bottom: 24px;">
        <div style="margin-bottom: 16px;">
          <label style="display: block; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #00d4ff; margin-bottom: 4px;">From</label>
          <p style="margin: 0; font-size: 18px; font-weight: 600;">${sanitizedName}</p>
        </div>
        <div>
          <label style="display: block; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #00d4ff; margin-bottom: 4px;">Email</label>
          <a href="mailto:${sanitizedEmail}" style="color: #00ff88; text-decoration: none; font-size: 16px;">${sanitizedEmail}</a>
        </div>
      </div>
      
      <!-- Message -->
      <div style="background: rgba(0,0,0,0.3); border-radius: 12px; padding: 24px;">
        <label style="display: block; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #00d4ff; margin-bottom: 12px;">Project Vision</label>
        <p style="margin: 0; font-size: 16px; line-height: 1.6; white-space: pre-wrap;">${sanitizedMessage}</p>
      </div>
      
      <!-- Footer -->
      <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.1);">
        <p style="margin: 0; color: #666; font-size: 12px;">
          Sent from kamidev.app • ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>
    </div>
  </div>
</body>
</html>
      `,
      text: `
New Portfolio Message

From: ${sanitizedName}
Email: ${sanitizedEmail}

Project Vision:
${sanitizedMessage}

---
Sent from kamidev.app
${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { success: false, error: "email", message: "Failed to send email. Please try again later." },
        { status: 500 }
      );
    }

    console.log("Email sent successfully:", data?.id);
    return NextResponse.json({
      success: true,
      message: "Message sent successfully.",
      id: data?.id,
    });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { success: false, error: "server", message: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}

// Handle other methods
export async function GET() {
  return NextResponse.json({ message: "Contact API - POST method required" }, { status: 405 });
}
