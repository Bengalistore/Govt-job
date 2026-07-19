import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

export function signAdminToken() {
  return jwt.sign({ role: "admin" }, SECRET, { expiresIn: "7d" });
}

export function verifyAdminToken(token) {
  try {
    const payload = jwt.verify(token, SECRET);
    return payload?.role === "admin";
  } catch {
    return false;
  }
}
