import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getMessaging, Messaging } from 'firebase-admin/messaging';

let app: App | undefined;
let db: Firestore | undefined;
let messagingInstance: Messaging | undefined;

export function getFirebaseAdmin() {
  if (!app && !getApps().length) {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;
    
    if (!privateKey || !process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL) {
      console.error('Firebase Admin credentials not configured');
      throw new Error('Firebase Admin credentials missing');
    }

    app = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
    });
  }
  
  if (!db) {
    db = getFirestore();
  }
  
  if (!messagingInstance) {
    messagingInstance = getMessaging();
  }
  
  return { db, messaging: messagingInstance };
}
