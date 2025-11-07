/**
 * Next.js Proxy - Route Protection
 * Protège les routes selon l'authentification et l'état de l'onboarding
 */

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(req: NextRequest) {
  const res = NextResponse.next();

  // Create Supabase client for proxy
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
  });

  // Get the access token from cookies
  const accessToken = req.cookies.get('sb-access-token')?.value;
  const refreshToken = req.cookies.get('sb-refresh-token')?.value;

  let session = null;
  let isAuthenticated = false;

  // If we have tokens, try to get the session
  if (accessToken && refreshToken) {
    const { data } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    session = data.session;
    isAuthenticated = !!session;
  }

  const pathname = req.nextUrl.pathname;

  // Define public routes
  const publicRoutes = [
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/reset-password',
  ];
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // Define API routes (always accessible)
  const isApiRoute = pathname.startsWith('/api');
  const isNextInternalRoute = pathname.startsWith('/_next');
  const isStaticFile = pathname.startsWith('/favicon.ico') || pathname.match(/\.(svg|png|jpg|jpeg|gif|webp)$/);

  // Skip proxy for API, internal routes, and static files
  if (isApiRoute || isNextInternalRoute || isStaticFile) {
    return res;
  }

  // Redirect unauthenticated users from protected routes to login
  if (!isAuthenticated && !isPublicRoute && pathname !== '/') {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  // Redirect authenticated users from auth pages to home
  if (isAuthenticated && isPublicRoute) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Check onboarding status for authenticated users
  if (isAuthenticated && !pathname.startsWith('/onboarding') && pathname !== '/') {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', session.user.id)
        .single();

      // If profile exists and onboarding is not completed, redirect to onboarding
      if (profile && !profile.onboarding_completed && !error) {
        return NextResponse.redirect(new URL('/onboarding', req.url));
      }
    } catch (error) {
      // If there's an error fetching profile, log it but don't block
      console.error('Error checking onboarding status:', error);
    }
  }

  // Allow access to onboarding pages for authenticated users
  if (isAuthenticated && pathname.startsWith('/onboarding')) {
    return res;
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
