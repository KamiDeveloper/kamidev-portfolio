import { NextRequest } from "next/server";

/**
 * Verify authentication token for API endpoints
 * 
 * Checks that the request has a valid Bearer token matching the PERSONAL_APP_API_KEY
 * environment variable.
 * 
 * @param request - Next.js request object
 * @returns true if authentication is valid, false otherwise
 * 
 * @example
 * ```typescript
 * export async function GET(request: NextRequest) {
 *   if (!verifyAuth(request)) {
 *     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
 *   }
 *   // ... rest of handler
 * }
 * ```
 */
export function verifyAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  const apiKey = process.env.PERSONAL_APP_API_KEY;
  
  // Debug logging (remove in production)
  console.log("[Auth] Header received:", authHeader ? `Bearer ${authHeader.substring(7, 15)}...` : 'none');
  console.log("[Auth] Expected key:", apiKey ? `${apiKey.substring(0, 8)}...` : 'NOT SET');
  
  if (!apiKey) {
    console.error("PERSONAL_APP_API_KEY not configured");
    return false;
  }
  
  const isValid = authHeader === `Bearer ${apiKey}`;
  console.log("[Auth] Valid:", isValid);
  
  return isValid;
}
