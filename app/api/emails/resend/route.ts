import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { verifyAuth } from "@/lib/auth-middleware";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * GET /api/emails/resend - List emails from Resend Receiving API
 * 
 * Query params:
 * - limit: number of emails to fetch (default 50)
 * - emailId: specific email ID to fetch (optional)
 * 
 * This endpoint provides a fallback to fetch emails directly from Resend
 * when Firestore data is unavailable or inconsistent.
 */
export async function GET(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const emailId = searchParams.get("emailId");
    const limit = parseInt(searchParams.get("limit") || "50");

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "Resend API key not configured" },
        { status: 500 }
      );
    }

    // If specific email ID requested, fetch single email
    if (emailId) {
      const { data, error } = await resend.emails.receiving.get(emailId);
      
      if (error) {
        console.error("Resend API error:", error);
        return NextResponse.json(
          { error: "Failed to fetch email from Resend", details: error },
          { status: 500 }
        );
      }

      // Transform Resend email format to our app format
      const transformedEmail = transformResendEmail(data);
      
      return NextResponse.json({ 
        email: transformedEmail,
        source: 'resend_api',
      });
    }

    // List emails from Resend
    const { data, error } = await resend.emails.receiving.list();
    
    if (error) {
      console.error("Resend API error:", error);
      return NextResponse.json(
        { error: "Failed to fetch emails from Resend", details: error },
        { status: 500 }
      );
    }

    // Transform emails to our app format
    const emails = (data?.data || [])
      .slice(0, limit)
      .map(transformResendEmail);

    return NextResponse.json({ 
      emails,
      total: data?.data?.length || 0,
      source: 'resend_api',
    });
  } catch (error) {
    console.error("Error fetching emails from Resend:", error);
    return NextResponse.json(
      { error: "Failed to fetch emails from Resend" },
      { status: 500 }
    );
  }
}

/**
 * Transform Resend email format to our application format
 */
function transformResendEmail(resendEmail: any): any {
  // Parse from field
  let fromAddress = { email: '', name: '' };
  if (typeof resendEmail.from === 'string') {
    const match = resendEmail.from.match(/^(.+?)\s*<(.+)>$/);
    if (match) {
      fromAddress = { name: match[1].trim(), email: match[2].trim() };
    } else {
      fromAddress = { email: resendEmail.from, name: '' };
    }
  } else if (resendEmail.from && typeof resendEmail.from === 'object') {
    fromAddress = {
      email: resendEmail.from.email || '',
      name: resendEmail.from.name || '',
    };
  }

  // Process attachments
  const attachments = (resendEmail.attachments || []).map((att: any) => ({
    id: att.id || '',
    filename: att.filename || 'attachment',
    contentType: att.content_type || att.contentType || 'application/octet-stream',
    size: att.size || 0,
  }));

  return {
    id: resendEmail.id,
    emailId: resendEmail.id,
    from: fromAddress,
    to: Array.isArray(resendEmail.to) ? resendEmail.to : [resendEmail.to].filter(Boolean),
    cc: resendEmail.cc || [],
    bcc: resendEmail.bcc || [],
    subject: resendEmail.subject || '(No subject)',
    messageId: resendEmail.message_id || resendEmail.id,
    textBody: resendEmail.text || '',
    htmlBody: resendEmail.html || '',
    attachments: attachments,
    receivedAt: resendEmail.created_at || new Date().toISOString(),
    status: 'unread', // Resend doesn't track read/unread
    replies: [],
    source: 'resend_api',
  };
}
