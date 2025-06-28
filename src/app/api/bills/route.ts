import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import type { UserRole } from "@prisma/client";

async function getAuth(req: NextRequest) {
	const token = (await cookies()).get("token")?.value;
	if (!token) return null;
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
			role: UserRole;
		};
		return decoded;
	} catch (error) {
		return null;
	}
}

export async function GET(req: NextRequest) {
	const auth = await getAuth(req);
	if (!auth) {
		return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
	}

	try {
		const bills = await prisma.bill.findMany({
			orderBy: { uploadDate: "desc" },
		});
		return NextResponse.json(bills, { status: 200 });
	} catch (error) {
		console.error("Get bills error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

export async function POST(req: NextRequest) {
	const auth = await getAuth(req);
	if (!auth || !["ADMIN", "SUPERADMIN"].includes(auth.role)) {
		return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	}

	try {
		const { fileName, month } = await req.json();
		if (!fileName || !month) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 }
			);
		}
		const newBill = await prisma.bill.create({
			data: { fileName, month },
		});
		return NextResponse.json(newBill, { status: 201 });
	} catch (error) {
		console.error("Create bill error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
