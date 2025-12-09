import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getFirebaseAdmin } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

const resend = new Resend(process.env.RESEND_API_KEY);

// Verify authentication token
function verifyAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  const apiKey = process.env.PERSONAL_APP_API_KEY;
  
  if (!apiKey) {
    console.error("PERSONAL_APP_API_KEY not configured");
    return false;
  }
  
  return authHeader === `Bearer ${apiKey}`;
}

export async function POST(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { emailId, to, subject, message, inReplyTo } = await request.json();

    // Validate required fields
    if (!to || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields: to, subject, and message are required" },
        { status: 400 }
      );
    }

    // Validate message length
    if (message.trim().length < 10) {
      return NextResponse.json(
        { error: "Message must be at least 10 characters" },
        { status: 400 }
      );
    }

    // Format subject
    const formattedSubject = subject.startsWith("Re:") ? subject : `Re: ${subject}`;

    // Send reply via Resend
    const { data, error } = await resend.emails.send({
      from: "Jorge Medrano <jorgemedrano@kamidev.app>",
      to: Array.isArray(to) ? to : [to],
      subject: formattedSubject,
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #ffffff; color: #1a1a1a;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="white-space: pre-wrap; font-size: 16px; line-height: 1.6;">
${message}
    </div>
    
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e5e5;">
      <table cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="vertical-align: top; padding-right: 15px;">
            <img src="https://kamidev.app/images/avatar.png" alt="Jorge Medrano" style="width: 60px; height: 60px; border-radius: 50%;" />
          </td>
          <td style="vertical-align: top;">
            <p style="margin: 0 0 4px; font-weight: 600; font-size: 16px; color: #1a1a1a;">Jorge Medrano</p>
            <p style="margin: 0 0 4px; font-size: 14px; color: #666;">Full Stack Developer</p>
            <p style="margin: 0; font-size: 14px;">
              <a href="https://kamidev.app" style="color: #00d4ff; text-decoration: none;">kamidev.app</a>
            </p>
          </td>
        </tr>
      </table>
    </div>
  </div>
</body>
</html>
      `,
      text: `${message}\n\n—\nJorge Medrano\nFull Stack Developer\nkamidev.app`,
      headers: inReplyTo ? { "In-Reply-To": inReplyTo } : undefined,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send email" }, 
        { status: 500 }
      );
    }

    // Update email document in Firestore with the reply
    if (emailId) {
      try {
        const { db } = getFirebaseAdmin();
        
        await db.collection('emails').doc(emailId).update({
          replies: FieldValue.arrayUnion({
            sentAt: new Date(),
            to: Array.isArray(to) ? to : [to],
            subject: formattedSubject,
            message: message,
            resendId: data?.id,
          }),
          status: 'replied',
          updatedAt: new Date(),
        });
        
        console.log('Reply saved to Firestore');
      } catch (firestoreError) {
        console.error('Failed to save reply to Firestore:', firestoreError);
        // Don't fail the request if Firestore update fails
      }
    }

    console.log('Reply sent successfully:', data?.id);
    
    return NextResponse.json({ 
      success: true, 
      id: data?.id,
      message: "Reply sent successfully",
    });
  } catch (error) {
    console.error("Reply error:", error);
    return NextResponse.json(
      { error: "Failed to send reply" }, 
      { status: 500 }
    );
  }
}
