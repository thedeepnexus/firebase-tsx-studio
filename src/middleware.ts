import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decodeJwt } from "jose";

export async function middleware(request: NextRequest) {
  if (request.method === "POST") {
    return NextResponse.next();
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("firebaseAuthToken")?.value;

  // lab 3: return next and continue to login if the token is missing and the path is /login
  if (!token && request.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.next();
  }

  // lab 2: redirect to login if the token is missing
  if (token && request.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!token) {
    console.log("token failed");
    return NextResponse.redirect(new URL("/", request.url));
  }

  console.log("token success");

  const decodedToken = decodeJwt(token);
  if (!decodedToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  console.log("decodedToken success");

  // Check if the user has the admin claim
  if (!decodedToken.admin) {
    console.log("admin claim missing");
    return NextResponse.redirect(new URL("/", request.url));
  }

  console.log("admin claim success");

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin-dashboard",
    // labs 1: filter out the paths that should be protected
    "/admin-dashboard/:path*",
    "/login",
  ],
};
