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

// POST: Register FCM token for push notifications
export async function POST(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { fcmToken, deviceInfo } = await request.json();
    
    if (!fcmToken) {
      return NextResponse.json(
        { error: "fcmToken is required" }, 
        { status: 400 }
      );
    }

    const { db } = getFirebaseAdmin();
    
    // Update or create the owner user document with FCM token
    await db.collection('users').doc('owner').set({
      fcmToken,
      deviceInfo: deviceInfo || {},
      updatedAt: new Date(),
    }, { merge: true });
    
    console.log('FCM token registered successfully');
    
    return NextResponse.json({ 
      success: true,
      message: "FCM token registered successfully",
    });
  } catch (error) {
    console.error("Error registering FCM token:", error);
    return NextResponse.json(
      { error: "Failed to register FCM token" }, 
      { status: 500 }
    );
  }
}

// DELETE: Remove FCM token (for logout)
export async function DELETE(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { db } = getFirebaseAdmin();
    
    await db.collection('users').doc('owner').update({
      fcmToken: null,
      updatedAt: new Date(),
    });
    
    console.log('FCM token removed successfully');
    
    return NextResponse.json({ 
      success: true,
      message: "FCM token removed successfully",
    });
  } catch (error) {
    console.error("Error removing FCM token:", error);
    return NextResponse.json(
      { error: "Failed to remove FCM token" }, 
      { status: 500 }
    );
  }
}
