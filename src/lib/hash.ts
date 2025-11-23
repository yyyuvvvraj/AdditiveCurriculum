import crypto from "crypto";
import bcrypt from "bcryptjs";

/** Generate a raw token (URL-safe hex) and its sha256 hash */
export function generateResetToken() {
  // 32 bytes -> 64 hex chars
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  return { token, tokenHash };
}

/** Hash password for storage */
export async function hashPassword(password: string) {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

/** Compare raw password to hash */
export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}
