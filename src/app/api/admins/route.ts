import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

async function verifySuperAdmin(req: NextRequest) {
	const jwtSecret = process.env.JWT_SECRET;
	if (!jwtSecret) {
		console.error("JWT_SECRET is not defined.");
		return {
			authorized: false,
			error: NextResponse.json(
				{ error: "Configuration error: JWT secret not set on server." },
				{ status: 500 }
			),
		};
	}

	const cookieStore = cookies();
	const token = (await cookieStore).get("token")?.value;

	if (!token) {
		return {
			authorized: false,
			error: NextResponse.json({ error: "Not authenticated" }, { status: 401 }),
		};
	}

	try {
		const decoded = jwt.verify(token, jwtSecret) as unknown as {
			userId: string;
			role: string;
		};
		if (decoded.role !== "SUPERADMIN") {
			return {
				authorized: false,
				error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
			};
		}
		return { authorized: true, error: null };
	} catch (error) {
		return {
			authorized: false,
			error: NextResponse.json({ error: "Invalid token" }, { status: 401 }),
		};
	}
}

export async function POST(req: NextRequest) {
	const verification = await verifySuperAdmin(req);
	if (!verification.authorized) return verification.error!;

	try {
		const { name, email, password, hostel } = await req.json();

		if (!name || !email || !password || !hostel) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 }
			);
		}

		const existingUser = await prisma.user.findUnique({
			where: { email: email.toLowerCase() },
		});
		if (existingUser) {
			return NextResponse.json(
				{ error: "Admin with this email already exists" },
				{ status: 409 }
			);
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const admin = await prisma.user.create({
			data: {
				name,
				email: email.toLowerCase(),
				password: hashedPassword,
				hostel,
				role: "ADMIN",
				status: "APPROVED", // Admins are auto-approved
			},
		});

		const { password: _, ...adminWithoutPassword } = admin;
		return NextResponse.json(adminWithoutPassword, { status: 201 });
	} catch (error) {
		console.error("Create admin error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

export async function GET(req: NextRequest) {
	const verification = await verifySuperAdmin(req);
	if (!verification.authorized) return verification.error!;

	try {
		const admins = await prisma.user.findMany({
			where: { role: "ADMIN" },
			select: {
				id: true,
				name: true,
				email: true,
				hostel: true,
				createdAt: true,
			},
			orderBy: {
				createdAt: "desc",
			},
		});
		return NextResponse.json(admins, { status: 200 });
	} catch (error) {
		console.error("Get admins error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
