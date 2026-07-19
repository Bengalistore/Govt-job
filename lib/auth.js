import { SignJWT, jwtVerify } from "jose";

// jose works in both the Node.js runtime (API routes) and the Edge runtime
// (middleware) — unlike the older "jsonwebtoken" package, which only works
// in Node.js and silently fails inside Next.js middleware.

function getSecretKey() {
  const secret = process.env.JWT_SECRET || "dev-secret-change-me";
  return new TextEncoder().encode(secret);
}

export async function signAdminToken() {
  return await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecretKey());
}

export async function verifyAdminToken(token) {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload?.role === "admin";
  } catch {
    return false;
  }
}
