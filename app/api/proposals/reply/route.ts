import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getFirebaseAdmin } from "@/lib/firebase-admin";
import { verifyAuth } from "@/lib/auth-middleware";
import { FieldValue } from "firebase-admin/firestore";

// ============================================
// Reply to Proposal API
// ============================================
// Sends reply via Resend and updates Firestore

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * POST /api/proposals/reply - Send reply to a proposal
 * Body: { proposalId, message }
 */
export async function POST(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { proposalId, message } = await request.json();

    // Validate inputs
    if (!proposalId || typeof proposalId !== 'string') {
      return NextResponse.json(
        { error: "proposalId is required" },
        { status: 400 }
      );
    }

    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      return NextResponse.json(
        { error: "Message must be at least 10 characters" },
        { status: 400 }
      );
    }

    // Get proposal from Firestore
    const { db } = getFirebaseAdmin();
    const proposalDoc = await db.collection('proposals').doc(proposalId).get();

    if (!proposalDoc.exists) {
      return NextResponse.json(
        { error: "Proposal not found" },
        { status: 404 }
      );
    }

    const proposal = proposalDoc.data();
    if (!proposal) {
      return NextResponse.json(
        { error: "Proposal data is empty" },
        { status: 404 }
      );
    }

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: "Jorge Medrano <jorgemedrano@kamidev.app>",
      to: [proposal.email],
      subject: `Re: Your proposal on KamiDev`,
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #ffffff; color: #1a1a1a;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <p style="font-size: 16px; margin-bottom: 16px;">Hi ${proposal.name},</p>
    
    <div style="white-space: pre-wrap; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
${message.trim()}
    </div>
    
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e5e5;">
      <p style="margin: 0 0 4px; font-weight: 600; font-size: 16px; color: #1a1a1a;">Jorge Medrano</p>
      <p style="margin: 0 0 4px; font-size: 14px; color: #666;">Full Stack Developer</p>
      <p style="margin: 0; font-size: 14px;">
        <a href="https://kamidev.app" style="color: #00d4ff; text-decoration: none;">kamidev.app</a>
      </p>
    </div>
  </div>
</body>
</html>
      `,
      text: `Hi ${proposal.name},\n\n${message.trim()}\n\n—\nJorge Medrano\nFull Stack Developer\nkamidev.app`,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send email" }, 
        { status: 500 }
      );
    }

    // Update proposal in Firestore
    const reply = {
      message: message.trim(),
      sentAt: new Date().toISOString(),
      resendId: data?.id,
    };

    await db.collection('proposals').doc(proposalId).update({
      status: 'replied',
      replies: FieldValue.arrayUnion(reply),
      updatedAt: new Date().toISOString(),
    });

    console.log("✅ Reply sent:", data?.id);

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
