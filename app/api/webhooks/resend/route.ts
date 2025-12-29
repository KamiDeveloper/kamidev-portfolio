import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getFirebaseAdmin } from "@/lib/firebase-admin";

const resend = new Resend(process.env.RESEND_API_KEY);

function hexToBuffer(hex: string): ArrayBuffer {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes.buffer;
}

// Save email to Firestore and send push notification
async function processAndNotifyEmail(emailData: any) {
  try {
    const { db, messaging } = getFirebaseAdmin();

    // Parse from field - can be "Name <email@example.com>" or just "email@example.com"
    let fromAddress = { email: '', name: '' };
    if (typeof emailData.from === 'string') {
      const match = emailData.from.match(/^(.+?)\s*<(.+)>$/);
      if (match) {
        fromAddress = { name: match[1].trim(), email: match[2].trim() };
      } else {
        fromAddress = { email: emailData.from, name: '' };
      }
    } else if (emailData.from && typeof emailData.from === 'object') {
      fromAddress = { 
        email: emailData.from.email || '', 
        name: emailData.from.name || '' 
      };
    }

    // Process attachments to a consistent format
    const attachments = (emailData.attachments || []).map((att: any) => ({
      id: att.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      filename: att.filename || 'attachment',
      contentType: att.content_type || 'application/octet-stream',
      size: att.size || 0,
    }));

    // 1. Save email to Firestore
    const emailDoc = {
      emailId: emailData.email_id,
      from: fromAddress,
      to: emailData.to || [],
      cc: emailData.cc || [],
      bcc: emailData.bcc || [],
      subject: emailData.subject || '(No subject)',
      messageId: emailData.message_id,
      textBody: emailData.text || emailData.text_body || '',
      htmlBody: emailData.html || emailData.html_body || '',
      attachments: attachments,
      receivedAt: new Date().toISOString(),
      status: 'unread',
      replies: [],
      source: 'resend_webhook',
    };

    const docRef = await db.collection('emails').add(emailDoc);
    console.log('Email saved to Firestore:', docRef.id);

    // 2. Get unread count for badge
    const unreadSnapshot = await db.collection('emails')
      .where('status', '==', 'unread')
      .count()
      .get();
    const unreadCount = unreadSnapshot.data().count;

    // 3. Send push notification via FCM
    try {
      // Get FCM token from owner user document
      const ownerDoc = await db.collection('users').doc('owner').get();
      const ownerData = ownerDoc.data();
      const token = ownerData?.fcmToken;
      
      if (token) {
        try {
          await messaging.send({
            token: token,
            notification: {
              title: `📧 ${fromAddress.name || fromAddress.email}`,
              body: emailData.subject || '(No subject)',
            },
            data: {
              type: 'new_email',
              emailId: docRef.id,
              from: fromAddress.email,
              subject: emailData.subject || '',
            },
            android: {
              priority: 'high',
              notification: {
                channelId: 'emails',
                priority: 'high',
                defaultSound: true,
                defaultVibrateTimings: true,
              },
            },
            apns: {
              payload: {
                aps: {
                  badge: unreadCount,
                  sound: 'default',
                  contentAvailable: true,
                },
              },
            },
          });
          console.log('Push notification sent successfully');
        } catch (fcmError: any) {
          console.error('FCM notification failed:', fcmError.message);
          // Remove invalid token
          if (fcmError.code === 'messaging/registration-token-not-registered') {
            await db.collection('users').doc('owner').update({
              fcmToken: null,
              updatedAt: new Date(),
            });
          }
        }
      } else {
        console.log('No FCM token registered for owner');
      }
    } catch (fcmError) {
      console.error('FCM notification process failed:', fcmError);
      // Don't fail the whole process if FCM fails
    }

    return { success: true, docId: docRef.id };
  } catch (error) {
    console.error('Error processing email:', error);
    return { success: false, error };
  }
}

// Forward received email to your actual inbox (backup method)
async function forwardEmail(emailData: any) {
  const { from, subject, to, cc, bcc } = emailData;
  
  try {
    // Send notification to your actual email
    const forwardEmail = process.env.FORWARD_EMAIL;
    
    if (!forwardEmail) {
      console.warn('FORWARD_EMAIL not configured, skipping email forwarding');
      return false;
    }
    
    const { data, error } = await resend.emails.send({
      from: "KamiDev Inbox <contact@kamidev.app>",
      to: [forwardEmail], 
      replyTo: from,
      subject: `📧 Forwarded: ${subject}`,
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
          Email Received
        </h1>
        <p style="margin: 8px 0 0; color: #888; font-size: 14px;">Forwarded from jorgemedrano@kamidev.app</p>
      </div>
      
      <!-- Email Info -->
      <div style="background: rgba(0,0,0,0.3); border-radius: 12px; padding: 24px; margin-bottom: 24px;">
        <div style="margin-bottom: 16px;">
          <label style="display: block; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #00d4ff; margin-bottom: 4px;">From</label>
          <p style="margin: 0; font-size: 16px; font-weight: 600;">${from}</p>
        </div>
        <div style="margin-bottom: 16px;">
          <label style="display: block; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #00d4ff; margin-bottom: 4px;">To</label>
          <p style="margin: 0; font-size: 16px;">${to.join(", ")}</p>
        </div>
        ${cc && cc.length > 0 ? `
        <div style="margin-bottom: 16px;">
          <label style="display: block; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #00d4ff; margin-bottom: 4px;">CC</label>
          <p style="margin: 0; font-size: 16px;">${cc.join(", ")}</p>
        </div>
        ` : ""}
        <div>
          <label style="display: block; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #00d4ff; margin-bottom: 4px;">Subject</label>
          <p style="margin: 0; font-size: 18px; font-weight: 600;">${subject}</p>
        </div>
      </div>
      
      <!-- Message -->
      <div style="background: rgba(0,0,0,0.3); border-radius: 12px; padding: 24px;">
        <label style="display: block; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #00d4ff; margin-bottom: 12px;">Message</label>
        <p style="margin: 0; font-size: 16px; line-height: 1.6;">
          This email was sent to jorgemedrano@kamidev.app. To view the full email with attachments, check your Resend dashboard.
        </p>
      </div>
      
      <!-- Footer -->
      <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.1);">
        <p style="margin: 0 0 8px; color: #00ff88; font-size: 14px;">
          <a href="https://resend.com/emails/${emailData.email_id}" style="color: #00ff88; text-decoration: none;">View in Resend Dashboard →</a>
        </p>
        <p style="margin: 0; color: #666; font-size: 12px;">
          Received at kamidev.app • ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>
    </div>
  </div>
</body>
</html>
      `,
      text: `
Email Received at jorgemedrano@kamidev.app

From: ${from}
To: ${to.join(", ")}
${cc && cc.length > 0 ? `CC: ${cc.join(", ")}\n` : ""}
Subject: ${subject}

This email was sent to jorgemedrano@kamidev.app. 
To view the full email with attachments, check your Resend dashboard:
https://resend.com/emails/${emailData.email_id}

---
Received at kamidev.app
${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
      `,
    });

    if (error) {
      console.error("Failed to forward email:", error);
      return false;
    }

    console.log("Email forwarded successfully:", data?.id);
    return true;
  } catch (error) {
    console.error("Error forwarding email:", error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get the raw body first for signature verification
    const body = await request.text();
    
    // Verify webhook signature
    const signature = request.headers.get("svix-signature");
    const timestamp = request.headers.get("svix-timestamp");
    const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;

    if (!signature || !timestamp || !webhookSecret) {
      console.error("Missing webhook verification headers or secret");
      return NextResponse.json(
        { error: "Missing verification headers" },
        { status: 401 }
      );
    }

    // Verify signature
    try {
      const signatureParts = signature.split(",");
      const expectedSignature = signatureParts.find((part) => part.startsWith("v1="))?.slice(3);

      if (!expectedSignature) {
        throw new Error("Invalid signature format");
      }

      const signedContent = `${timestamp}.${body}`;
      const encoder = new TextEncoder();
      
      const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(webhookSecret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["verify"]
      );

      const signatureBuffer = hexToBuffer(expectedSignature);
      const dataBuffer = encoder.encode(signedContent);

      const isValid = await crypto.subtle.verify(
        "HMAC",
        key,
        signatureBuffer,
        dataBuffer
      );

      if (!isValid) {
        console.error("Invalid webhook signature");
        return NextResponse.json(
          { error: "Invalid signature" },
          { status: 401 }
        );
      }
    } catch (error) {
      console.error("Signature verification failed:", error);
      return NextResponse.json(
        { error: "Signature verification failed" },
        { status: 401 }
      );
    }

    // Parse the webhook event
    const event = JSON.parse(body);

    console.log("Webhook event received:", event.type);

    // Handle email.received event
    if (event.type === "email.received") {
      const emailData = event.data;
      
      console.log("Email received:", {
        from: emailData.from,
        to: emailData.to,
        subject: emailData.subject,
        email_id: emailData.email_id,
      });

      // Save to Firestore and send push notification
      const processResult = await processAndNotifyEmail(emailData);

      // Also forward email as backup
      await forwardEmail(emailData);

      return NextResponse.json({
        success: true,
        message: "Email received, saved, and forwarded",
        firestoreDocId: processResult.docId,
      });
    }

    // Return success for other events
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

// Handle GET requests (for testing)
export async function GET() {
  return NextResponse.json({
    message: "Resend webhook endpoint",
    status: "active",
  });
}
