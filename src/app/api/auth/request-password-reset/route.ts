import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendPasswordResetOtpEmail } from "@/lib/email";
import { generateOtp } from "@/lib/utils";

export async function POST(req: NextRequest) {
	try {
		const { email } = await req.json();

		if (!email) {
			return NextResponse.json({ error: "Email is required" }, { status: 400 });
		}

		const user = await prisma.user.findUnique({
			where: { email: email.toLowerCase() },
		});

		// IMPORTANT: Always return a generic success message to prevent email enumeration attacks.
		if (user) {
			const otp = generateOtp();
			const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

			await prisma.user.update({
				where: { id: user.id },
				data: {
					passwordResetOtp: otp, // In a real app, you should HASH the OTP.
					passwordResetOtpExpires: otpExpires,
				},
			});

			try {
				await sendPasswordResetOtpEmail(user.email, otp);
			} catch (error) {
				console.error("Failed to send password reset OTP email:", error);
				// Even if email fails, don't expose the error to the client.
			}
		}

		return NextResponse.json(
			{
				message: "If an account with that email exists, an OTP has been sent.",
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Request password reset error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
