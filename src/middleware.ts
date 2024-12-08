// middleware.ts
import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Set the session timeout (in milliseconds)
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secureCookie: process.env.NEXTAUTH_URL?.startsWith('https://'),
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const now = Date.now();
  const lastActivity = token.lastActivity as number || 0;

  // Redirect if session has timed out
  if (now - lastActivity > SESSION_TIMEOUT) {
    const response = NextResponse.redirect(new URL('/login', req.url));
    
    // Set more detailed session expiration cookies
    response.cookies.set('session-expired', 'true', {
      httpOnly: false, // Make accessible to client-side JS
      path: '/',
      maxAge: 10 // Short-lived cookie
    });
    response.cookies.set('session-expiration-reason', 'timeout', {
      httpOnly: false,
      path: '/',
      maxAge: 10
    });

    return response;
  }

  // Update last activity timestamp periodically
  if (now - lastActivity > 60000) { // Update every minute
    token.lastActivity = now;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard', 
    '/update_account', 
    '/add_account', 
    '/login_history'
  ],
};