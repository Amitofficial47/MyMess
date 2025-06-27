import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

async function verifyAdmin(req: NextRequest) {
	const jwtSecret = process.env.JWT_SECRET;
	if (!jwtSecret) {
		return {
			authorized: false,
			error: NextResponse.json(
				{ error: "Configuration error" },
				{ status: 500 }
			),
			decoded: null,
		};
	}
	const cookieStore = cookies();
	const token = (await cookieStore).get("token")?.value;
	if (!token) {
		return {
			authorized: false,
			error: NextResponse.json({ error: "Not authenticated" }, { status: 401 }),
			decoded: null,
		};
	}
	try {
		const decoded = jwt.verify(token, jwtSecret) as unknown as {
			userId: string;
			role: string;
			hostel: string;
		};
		if (decoded.role !== "ADMIN" && decoded.role !== "SUPERADMIN") {
			return {
				authorized: false,
				error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
				decoded: null,
			};
		}
		return { authorized: true, error: null, decoded };
	} catch (error) {
		return {
			authorized: false,
			error: NextResponse.json({ error: "Invalid token" }, { status: 401 }),
			decoded: null,
		};
	}
}

export async function GET(req: NextRequest) {
	const verification = await verifyAdmin(req);
	if (!verification.authorized || !verification.decoded) {
		return verification.error;
	}

	const { role, hostel } = verification.decoded;

	try {
		const whereClause: any = {
			role: "STUDENT",
			status: "APPROVED",
		};

		if (role === "ADMIN") {
			whereClause.hostel = hostel;
		}

		const students = await prisma.user.findMany({
			where: whereClause,
			select: {
				id: true,
				name: true,
				email: true,
				hostel: true,
				enrollmentNumber: true,
				course: true,
				createdAt: true,
				avatar: true,
			},
			orderBy: {
				name: "asc",
			},
		});

		return NextResponse.json(students, { status: 200 });
	} catch (error) {
		console.error("Get approved students error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
