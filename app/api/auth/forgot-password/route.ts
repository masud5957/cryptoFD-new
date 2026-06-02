import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { generateOTP, hashPassword } from "@/lib/auth"
import { sendPasswordResetEmail } from "@/lib/email"

// POST /api/auth/forgot-password - Send password reset OTP
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    // Find user
    const user = await db.profile.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (!user) {
      // Don't reveal if email exists
      return NextResponse.json({
        message: "If the email exists, a reset code will be sent"
      })
    }

    // Send OTP for password reset
    const resetOtp = generateOTP()
    await db.profile.update({
      where: { id: user.id },
      data: {
        otpCode: resetOtp,
        otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
      }
    })
    
    await sendPasswordResetEmail(email, resetOtp)

    return NextResponse.json({
      message: "Password reset code sent to your email",
      email: user.email,
    })
  } catch (error) {
    console.error("[Forgot Password] Error:", error)
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    )
  }
}
