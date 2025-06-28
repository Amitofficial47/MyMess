import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendPasswordResetSuccessEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
	try {
		const { token, password } = await req.json();
		const jwtResetSecret = process.env.JWT_RESET_SECRET;

		if (!token || !password) {
			return NextResponse.json(
				{ error: "Token and new password are required" },
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
		if (password.length < 6) {
			return NextResponse.json(
				{ error: "Password must be at least 6 characters long" },
				{ status: 400 }
			);
		}

		let decoded;
		try {
			// This token is the short-lived one issued after OTP verification
			decoded = jwt.verify(token, jwtResetSecret) as { userId: string };
		} catch (error) {
			return NextResponse.json(
				{ error: "Token is invalid or has expired" },
				{ status: 400 }
			);
		}

		const { userId } = decoded;

		const user = await prisma.user.findUnique({ where: { id: userId } });

		if (!user) {
			// This case should be rare if the token is valid, but it's a good safeguard.
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		// Hash the new password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Update user's password
		await prisma.user.update({
			where: { id: user.id },
			data: {
				password: hashedPassword,
			},
		});

		try {
			await sendPasswordResetSuccessEmail(user.email);
		} catch (error) {
			console.error(
				`Failed to send password reset success email to ${user.email}:`,
				error
			);
		}

		return NextResponse.json(
			{ message: "Password has been successfully reset" },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Reset password error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
