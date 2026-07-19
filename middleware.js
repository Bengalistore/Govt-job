import { NextResponse } from "next/server";
import { verifyAdminToken } from "./lib/auth";

export function middleware(req) {
  const token = req.cookies.get("admin_token")?.value;
  const isValid = token && verifyAdminToken(token);

  if (!isValid) {
    const loginUrl = new URL("/admin/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/dashboard/:path*"]
};
