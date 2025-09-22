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

// GET all add-ons
export async function GET(req: NextRequest) {
	const auth = await getAuth(req);
	if (!auth) {
		return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
	}

	try {
		const addons = await prisma.addon.findMany({
			orderBy: { name: "asc" },
		});
		return NextResponse.json(addons, { status: 200 });
	} catch (error) {
		console.error("Get addons error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

// POST to create a new add-on
export async function POST(req: NextRequest) {
	const auth = await getAuth(req);
	if (!auth || !["MESSADMIN", "SUPERADMIN"].includes(auth.role)) {
		return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	}

	try {
		const { name, price } = await req.json();
		if (!name || typeof price !== "number") {
			return NextResponse.json(
				{ error: "Missing or invalid required fields" },
				{ status: 400 }
			);
		}

		const newAddon = await prisma.addon.create({
			data: { name, price },
		});

		return NextResponse.json(newAddon, { status: 201 });
	} catch (error) {
		console.error("Create addon error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
