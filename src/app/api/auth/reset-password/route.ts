import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // adjust if your prisma client path differs
import crypto from "crypto";
import { hashPassword } from "@/lib/hash";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const token = (body?.token || "").trim();
  const newPassword = body?.password;

  if (!token || !newPassword || newPassword.length < 8) {
    return NextResponse.json({ ok: false, message: "Invalid request" }, { status: 400 });
  }

  // Hash incoming token the same way we stored it
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  try {
    // Find token record that matches, is not used, and not expired
    const tokenRecord = await prisma.passwordResetToken.findFirst({
      where: {
        tokenHash,
        used: false,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });

    if (!tokenRecord || !tokenRecord.user) {
      return NextResponse.json({ ok: false, message: "Token invalid or expired" }, { status: 400 });
    }

    // Hash new password and update user
    const hashed = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: tokenRecord.userId },
      data: { password: hashed },
    });

    // Mark token used (single-use)
    await prisma.passwordResetToken.update({
      where: { id: tokenRecord.id },
      data: { used: true },
    });

    // Optional: delete other outstanding tokens for this user
    await prisma.passwordResetToken.updateMany({
      where: { userId: tokenRecord.userId, used: false },
      data: { used: true },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("reset-password error:", err);
    return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
  }
}
