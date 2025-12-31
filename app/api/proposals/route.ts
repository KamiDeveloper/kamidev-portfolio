import { NextRequest, NextResponse } from "next/server";
import { getFirebaseAdmin } from "@/lib/firebase-admin";
import { verifyAuth } from "@/lib/auth-middleware";

// ============================================
// Proposals API - List, Update, Delete
// ============================================
// Secure endpoint for managing proposals from mobile app

/**
 * GET /api/proposals - List all proposals
 * Query params:
 * - limit: number (default 50)
 * - status: 'unread' | 'read' | 'replied' (optional)
 */
export async function GET(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { db } = getFirebaseAdmin();
    const { searchParams } = new URL(request.url);
    
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
    const status = searchParams.get("status");

    // Build query
    let query = db.collection('proposals').orderBy('createdAt', 'desc');
    
    if (status && ['unread', 'read', 'replied'].includes(status)) {
      query = query.where('status', '==', status);
    }

    query = query.limit(limit);

    const snapshot = await query.get();
    
    const proposals = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Array<{ id: string; status: string; [key: string]: any }>;

    // Get unread count in same query if not filtering by status
    let unreadCount = 0;
    if (!status) {
      unreadCount = proposals.filter(p => p.status === 'unread').length;
    } else {
      // Need separate count query
      const unreadSnapshot = await db.collection('proposals')
        .where('status', '==', 'unread')
        .count()
        .get();
      unreadCount = unreadSnapshot.data().count;
    }

    return NextResponse.json({ 
      proposals, 
      unreadCount,
      total: proposals.length,
    });

  } catch (error) {
    console.error("Error fetching proposals:", error);
    return NextResponse.json(
      { error: "Failed to fetch proposals" }, 
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/proposals - Update proposal status
 * Body: { proposalId, status }
 */
export async function PATCH(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { proposalId, status } = await request.json();
    
    if (!proposalId || typeof proposalId !== 'string') {
      return NextResponse.json(
        { error: "proposalId is required" }, 
        { status: 400 }
      );
    }

    if (!status || !['unread', 'read', 'replied'].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be: unread, read, or replied" }, 
        { status: 400 }
      );
    }

    const { db } = getFirebaseAdmin();
    
    await db.collection('proposals').doc(proposalId).update({
      status,
      updatedAt: new Date().toISOString(),
    });
    
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error updating proposal:", error);
    return NextResponse.json(
      { error: "Failed to update proposal" }, 
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/proposals - Delete a proposal
 * Query param: proposalId
 */
export async function DELETE(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const proposalId = searchParams.get("proposalId");
    
    if (!proposalId) {
      return NextResponse.json(
        { error: "proposalId is required" }, 
        { status: 400 }
      );
    }

    const { db } = getFirebaseAdmin();
    await db.collection('proposals').doc(proposalId).delete();
    
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error deleting proposal:", error);
    return NextResponse.json(
      { error: "Failed to delete proposal" }, 
      { status: 500 }
    );
  }
}
