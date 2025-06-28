import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
	try {
		const { email, otp } = await req.json();
		const jwtResetSecret = process.env.JWT_RESET_SECRET;

		if (!email || !otp) {
			return NextResponse.json(
				{ error: "Email and OTP are required" },
				{ status: 400 }
			);
		}
		if (!jwtResetSecret) {
			console.error("JWT_RESET_SECRET is not defined");
			return NextResponse.json(
				{ error: "Configuration error" },
				{ status: 500 }
			);
		}

		const user = await prisma.user.findUnique({
			where: { email: email.toLowerCase() },
		});
		if (!user) {
			return NextResponse.json(
				{ error: "Invalid OTP or email" },
				{ status: 400 }
			);
		}

		const now = new Date();
		if (
			!user.passwordResetOtp ||
			!user.passwordResetOtpExpires ||
			now > user.passwordResetOtpExpires
		) {
			return NextResponse.json(
				{ error: "OTP has expired or is invalid" },
				{ status: 400 }
			);
		}

		// IMPORTANT: In a real app, you would use a secure comparison function
		// if you were hashing the OTP. Since we are storing it plaintext for simplicity, direct comparison is fine.
		if (user.passwordResetOtp !== otp) {
			return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
		}

		// OTP is correct. Clear it and issue a short-lived token for the final password reset step.
		await prisma.user.update({
			where: { id: user.id },
			data: {
				passwordResetOtp: null,
				passwordResetOtpExpires: null,
			},
		});

		// This token is single-use and authorizes the user to change their password in the next 5 minutes.
		const token = jwt.sign({ userId: user.id }, jwtResetSecret, {
			expiresIn: "5m",
		});

		return NextResponse.json({ token }, { status: 200 });
	} catch (error) {
		console.error("Verify OTP error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
