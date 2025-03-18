import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Call the session API route to refresh the session
  const sessionResponse = await fetch(`${req.nextUrl.origin}/api/auth/session`);
  const sessionData = await sessionResponse.json();

  if (!sessionResponse.ok) {
    console.error('Failed to refresh session:', sessionData.error);
  }

  return res;
}

// Ensure the middleware is only called for relevant paths
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public|api).*)",
  ],
};
