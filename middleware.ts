import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production"
)

const protectedRoutes = ["/dashboard", "/admin"]
const authRoutes = ["/auth/login", "/auth/sign-up", "/auth/forgot-password"]
const publicRoutes = ["/admin-login"] // Admin login page is public (has its own auth)

async function verifyToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, JWT_SECRET)
    return true
  } catch {
    return false
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("auth_token")?.value

  // Skip middleware for public routes (like admin-login)
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Check if accessing protected route
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

  if (isProtectedRoute) {
    if (!token) {
      // Redirect to login if no token
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }

    const isValid = await verifyToken(token)
    if (!isValid) {
      // Clear invalid token and redirect to login
      const response = NextResponse.redirect(new URL("/auth/login", request.url))
      response.cookies.delete("auth_token")
      return response
    }
  }

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && token) {
    const isValid = await verifyToken(token)
    if (isValid) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
