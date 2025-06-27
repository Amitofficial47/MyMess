import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
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

export async function DELETE(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	const verification = await verifyAdminOrSuperAdmin(req);
	if (!verification.authorized || !verification.decoded) {
		return verification.error;
	}

	const { id } = params;

	if (!id) {
		return NextResponse.json(
			{ error: "Mess Admin ID is required" },
			{ status: 400 }
		);
	}

	try {
		const messAdminToDelete = await prisma.user.findUnique({
			where: { id, role: "MESSADMIN" },
		});

		if (!messAdminToDelete) {
			return NextResponse.json(
				{ error: "Mess Admin not found" },
				{ status: 404 }
			);
		}

		// If the deleter is an Admin, they can only delete mess admins from their own hostel.
		if (
			verification.decoded.role === "ADMIN" &&
			messAdminToDelete.hostel !== verification.decoded.hostel
		) {
			return NextResponse.json(
				{ error: "Admins can only delete mess admins from their own hostel" },
				{ status: 403 }
			);
		}

		await prisma.user.delete({
			where: { id },
		});

		return NextResponse.json(
			{ message: "Mess admin deleted successfully" },
			{ status: 200 }
		);
	} catch (error: any) {
		console.error("Delete mess admin error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
