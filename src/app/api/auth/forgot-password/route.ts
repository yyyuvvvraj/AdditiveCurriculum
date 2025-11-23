import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // adjust if your prisma client path differs
import { generateResetToken } from "@/lib/hash";
import { sendResetEmail } from "@/lib/email";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const email = (body?.email || "").toLowerCase().trim();

  // Always return 200 to avoid exposing which emails exist
  if (!email) {
    return NextResponse.json({ ok: true });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Silently return success
      return NextResponse.json({ ok: true });
    }

    // Create token
    const { token, tokenHash } = generateResetToken();

    const expiryMinutes = +(process.env.RESET_TOKEN_EXPIRY_MINUTES || 60);
    const expiresAt = new Date(Date.now() + expiryMinutes * 60_000);

    // Save token to DB
    await prisma.passwordResetToken.create({
      data: {
        tokenHash,
        user: { connect: { id: user.id } },
        expiresAt,
      },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password/${token}`;

    // Send email (don't await to save time? we'll await to catch errors)
    try {
      await sendResetEmail(user.email, resetUrl);
    } catch (err) {
      console.error("Failed to send reset email:", err);
      // Still return success to user
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("forgot-password error:", err);
    return NextResponse.json({ ok: true });
  }
}
