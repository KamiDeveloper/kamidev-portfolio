import { NextRequest, NextResponse } from "next/server";
import { getFirebaseAdmin } from "@/lib/firebase-admin";

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

// GET: List emails
export async function GET(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { db } = getFirebaseAdmin();
    const { searchParams } = new URL(request.url);
    
    const limit = parseInt(searchParams.get("limit") || "50");
    const status = searchParams.get("status"); // unread, read, replied
    const cursor = searchParams.get("cursor"); // for pagination

    let query = db.collection('emails').orderBy('receivedAt', 'desc');
    
    if (status) {
      query = query.where('status', '==', status);
    }

    if (cursor) {
      const cursorDoc = await db.collection('emails').doc(cursor).get();
      if (cursorDoc.exists) {
        query = query.startAfter(cursorDoc);
      }
    }

    query = query.limit(limit);

    const snapshot = await query.get();
    const emails = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      receivedAt: doc.data().receivedAt?.toDate?.()?.toISOString() || null,
    }));

    // Get unread count
    const unreadSnapshot = await db.collection('emails')
      .where('status', '==', 'unread')
      .count()
      .get();
    const unreadCount = unreadSnapshot.data().count;

    return NextResponse.json({ 
      emails, 
      unreadCount,
      hasMore: emails.length === limit,
      nextCursor: emails.length > 0 ? emails[emails.length - 1].id : null,
    });
  } catch (error) {
    console.error("Error fetching emails:", error);
    return NextResponse.json(
      { error: "Failed to fetch emails" }, 
      { status: 500 }
    );
  }
}

// PATCH: Update email status
export async function PATCH(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { emailId, status } = await request.json();
    
    if (!emailId) {
      return NextResponse.json(
        { error: "emailId is required" }, 
        { status: 400 }
      );
    }

    if (status && !['unread', 'read', 'replied'].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be: unread, read, or replied" }, 
        { status: 400 }
      );
    }

    const { db } = getFirebaseAdmin();
    
    const updateData: Record<string, any> = {};
    if (status) updateData.status = status;
    updateData.updatedAt = new Date();

    await db.collection('emails').doc(emailId).update(updateData);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating email:", error);
    return NextResponse.json(
      { error: "Failed to update email" }, 
      { status: 500 }
    );
  }
}

// DELETE: Delete an email
export async function DELETE(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const emailId = searchParams.get("emailId");
    
    if (!emailId) {
      return NextResponse.json(
        { error: "emailId is required" }, 
        { status: 400 }
      );
    }

    const { db } = getFirebaseAdmin();
    await db.collection('emails').doc(emailId).delete();
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting email:", error);
    return NextResponse.json(
      { error: "Failed to delete email" }, 
      { status: 500 }
    );
  }
}
