import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

async function verifyAdminOrSuperAdmin(req: NextRequest) {
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

	const cookieStore = await cookies();
	const token = cookieStore.get("token")?.value;

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
		const userRole = decoded.role?.toUpperCase();

		if (userRole !== "ADMIN" && userRole !== "SUPERADMIN") {
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

export async function POST(req: NextRequest) {
	const verification = await verifyAdminOrSuperAdmin(req);
	if (!verification.authorized || !verification.decoded)
		return verification.error!;

	try {
		const { name, email, password, hostel } = await req.json();

		if (!name || !email || !password || !hostel) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 }
			);
		}

		// If the creator is an Admin, they can only create a mess admin for their own hostel.
		if (
			verification.decoded.role === "ADMIN" &&
			verification.decoded.hostel !== hostel
		) {
			return NextResponse.json(
				{ error: "Admins can only create mess admins for their own hostel" },
				{ status: 403 }
			);
		}

		const existingUser = await prisma.user.findUnique({
			where: { email: email.toLowerCase() },
		});
		if (existingUser) {
			return NextResponse.json(
				{ error: "User with this email already exists" },
				{ status: 409 }
			);
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const messAdmin = await prisma.user.create({
			data: {
				name,
				email: email.toLowerCase(),
				password: hashedPassword,
				hostel,
				role: "MESSADMIN",
				status: "APPROVED",
			},
		});

		const { password: _, ...adminWithoutPassword } = messAdmin;
		return NextResponse.json(adminWithoutPassword, { status: 201 });
	} catch (error) {
		console.error("Create mess admin error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

export async function GET(req: NextRequest) {
	const verification = await verifyAdminOrSuperAdmin(req);
	if (!verification.authorized || !verification.decoded)
		return verification.error!;

	const whereClause: any = { role: "MESSADMIN" };

	// If user is a regular admin, only show mess admins from their hostel
	if (verification.decoded.role === "ADMIN") {
		whereClause.hostel = verification.decoded.hostel;
	}

	try {
		const messAdmins = await prisma.user.findMany({
			where: whereClause,
			select: {
				id: true,
				name: true,
				email: true,
				hostel: true,
			},
			orderBy: {
				createdAt: "desc",
			},
		});
		return NextResponse.json(messAdmins, { status: 200 });
	} catch (error) {
		console.error("Get mess admins error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
