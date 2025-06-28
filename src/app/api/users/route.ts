import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
	const jwtSecret = process.env.JWT_SECRET;
	if (!jwtSecret) {
		console.error("JWT_SECRET is not defined.");
		return NextResponse.json(
			{ error: "Configuration error: JWT secret not set on server." },
			{ status: 500 }
		);
	}

	const cookieStore = await cookies();
	const token = cookieStore.get("token")?.value;

	if (!token) {
		return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
	}

	try {
		const decoded = jwt.verify(token, jwtSecret) as unknown as {
			userId: string;
			role: string;
		};
		const userRole = decoded.role?.toUpperCase();

		if (
			userRole !== "ADMIN" &&
			userRole !== "SUPERADMIN" &&
			userRole !== "MESSADMIN"
		) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		const users = await prisma.user.findMany({
			select: {
				id: true,
				displayId: true,
				name: true,
				hostel: true,
				role: true,
				avatar: true,
			},
		});
		return NextResponse.json(users, { status: 200 });
	} catch (error) {
		if (error instanceof jwt.JsonWebTokenError) {
			return NextResponse.json({ error: "Invalid token" }, { status: 401 });
		}
		console.error("Get users error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
