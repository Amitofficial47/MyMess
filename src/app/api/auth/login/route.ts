import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
	try {
		const jwtSecret = process.env.JWT_SECRET;
		if (!jwtSecret) {
			console.error("JWT_SECRET is not defined.");
			return NextResponse.json(
				{ error: "Configuration error: JWT secret not set on server." },
				{ status: 500 }
			);
		}

		const { email, password } = await req.json();

		if (!email || !password) {
			return NextResponse.json(
				{ error: "Missing email or password" },
				{ status: 400 }
			);
		}

		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) {
			return NextResponse.json(
				{ error: "Invalid credentials" },
				{ status: 401 }
			);
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return NextResponse.json(
				{ error: "Invalid credentials" },
				{ status: 401 }
			);
		}

		const token = jwt.sign(
			{ userId: user.id, role: user.role, hostel: user.hostel },
			jwtSecret,
			{ expiresIn: "1d" }
		);

		(await cookies()).set("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 60 * 60 * 24, // 1 day
			path: "/",
		});

		const { password: _, ...userWithoutPassword } = user;

		const clientUser = {
			...userWithoutPassword,
			role: user.role.toLowerCase() as "student" | "admin" | "superadmin",
			status: user.status,
		};

		return NextResponse.json(
			{ message: "Login successful", user: clientUser },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Login error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
