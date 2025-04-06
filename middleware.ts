import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const token = await getToken({ req })
  const isAuthenticated = !!token

  // List of public paths that don't require authentication
  const publicPaths = ["/login", "/register"]
  const isPublicPath = publicPaths.includes(req.nextUrl.pathname)

  if (isPublicPath) {
    if (isAuthenticated) {
      // If user is authenticated and tries to access login/register, redirect to home
      return NextResponse.redirect(new URL("/", req.url))
    }
    return NextResponse.next()
  }

  // Protected routes
  if (!isAuthenticated) {
    // If user is not authenticated, redirect to login
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}