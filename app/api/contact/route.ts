import { NextResponse } from "next/server";
import { getFirebaseAdmin } from "@/lib/firebase-admin";

// ============================================
// Contact/Proposal API - Simplified & Secure
// ============================================
// Saves proposals directly to Firestore instead of sending emails
// This reduces complexity and allows direct access from mobile app

// Rate limiting store
const rateLimitStore = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 3; // Max 3 requests per minute per IP

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Spam patterns to detect
const SPAM_PATTERNS = [
  /\b(viagra|casino|lottery|winner|prize|click here|buy now|free money)\b/i,
  /(.)\1{10,}/, // Repeated characters (aaaaaaaaaa)
  /<script|<iframe|javascript:|onclick|onerror/i, // XSS attempts
  /\[url=|https?:\/\/\S+\s+https?:\/\/\S+/i, // Multiple URLs (spam pattern)
];

/**
 * Check if content is spam
 */
function isSpam(data: { name: string; email: string; message: string; honeypot?: string }): boolean {
  // Honeypot check (should be empty)
  if (data.honeypot && data.honeypot.length > 0) {
    return true;
  }

  const content = `${data.name} ${data.email} ${data.message}`;
  return SPAM_PATTERNS.some((pattern) => pattern.test(content));
}

/**
 * Rate limiting check
 */
function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record) {
    rateLimitStore.set(ip, { count: 1, timestamp: now });
    return { allowed: true };
  }

  if (now - record.timestamp > RATE_LIMIT_WINDOW) {
    rateLimitStore.set(ip, { count: 1, timestamp: now });
    return { allowed: true };
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    const retryAfter = Math.ceil((RATE_LIMIT_WINDOW - (now - record.timestamp)) / 1000);
    return { allowed: false, retryAfter };
  }

  record.count++;
  return { allowed: true };
}

/**
 * Sanitize string input
 */
function sanitize(input: string, maxLength: number): string {
  return input
    .trim()
    .slice(0, maxLength)
    .replace(/[<>]/g, '') // Remove < and > to prevent HTML injection
    .replace(/\\/g, ''); // Remove backslashes
}

// Cleanup old rate limit entries every 2 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitStore.entries()) {
    if (now - record.timestamp > RATE_LIMIT_WINDOW * 2) {
      rateLimitStore.delete(ip);
    }
  }
}, RATE_LIMIT_WINDOW * 2);

/**
 * POST /api/contact - Save proposal to Firestore
 */
export async function POST(request: Request) {
  try {
    // Get client IP
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor?.split(",")[0].trim() || "unknown";

    // Rate limit check
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

    // Parse body
    const body = await request.json();
    const { name, email, message, honeypot } = body;

    // Validate name
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "validation", field: "name", message: "Name must be at least 2 characters." },
        { status: 400 }
      );
    }

    // Validate email
    if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: "validation", field: "email", message: "A valid email is required." },
        { status: 400 }
      );
    }

    // Validate message
    if (!message || typeof message !== "string" || message.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: "validation", field: "message", message: "Message must be at least 10 characters." },
        { status: 400 }
      );
    }

    // Spam check - return success to not give hints to spammers
    if (isSpam({ name, email, message, honeypot })) {
      console.log("🚫 Spam detected from:", email);
      return NextResponse.json({ success: true, message: "Message sent successfully." });
    }

    // Sanitize inputs
    const proposal = {
      name: sanitize(name, 100),
      email: sanitize(email.toLowerCase(), 254),
      message: sanitize(message, 5000),
      status: 'unread' as const,
      createdAt: new Date().toISOString(),
      replies: [], // Array for storing replies
    };

    // Save to Firestore
    const { db } = getFirebaseAdmin();
    const docRef = await db.collection('proposals').add(proposal);

    console.log("✅ Proposal saved:", docRef.id);

    return NextResponse.json({
      success: true,
      message: "Message sent successfully!",
      id: docRef.id,
    });

  } catch (error) {
    console.error("❌ Contact API error:", error);
    return NextResponse.json(
      { success: false, error: "server", message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: "Contact API - POST method required" }, { status: 405 });
}
