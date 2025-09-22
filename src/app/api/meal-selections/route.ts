import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import type { UserRole } from "@prisma/client";
import { generateToken } from "@/lib/utils";

interface JwtPayload {
	userId: string;
	role: UserRole;
	hostel: string;
}

const isValidObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);

async function getAuthUser(req: NextRequest): Promise<JwtPayload | null> {
	const jwtSecret = process.env.JWT_SECRET;
	if (!jwtSecret) {
		console.error("JWT_SECRET not defined");
		return null;
	}
	const token = (await cookies()).get("token")?.value;
	if (!token) return null;

	try {
		const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
		if (!isValidObjectId(decoded.userId)) {
			console.error(
				"Invalid ObjectId in JWT for meal-selections API:",
				decoded.userId
			);
			return null; // Treat as unauthenticated
		}
		return decoded;
	} catch (error) {
		return null;
	}
}

// GET all relevant meal selections
export async function GET(req: NextRequest) {
	const user = await getAuthUser(req);
	if (!user) {
		return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
	}

	try {
		let whereClause: any = {};
		if (user.role === "STUDENT") {
			whereClause = { userId: user.userId };
		} else if (user.role === "ADMIN" || user.role === "MESSADMIN") {
			// Find users in the admin's hostel
			const hostelUsers = await prisma.user.findMany({
				where: { hostel: user.hostel },
				select: { id: true },
			});
			const userIds = hostelUsers.map((u) => u.id);
			whereClause = { userId: { in: userIds } };
		} else if (user.role !== "SUPERADMIN") {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}
		// Superadmin has an empty whereClause, fetching all.

		const selections = await prisma.mealSelection.findMany({
			where: whereClause,
			orderBy: { createdAt: "desc" },
		});

		return NextResponse.json(selections, { status: 200 });
	} catch (error: any) {
		if (error.code === "P2023") {
			console.error(
				"Data inconsistency error in GET /api/meal-selections:",
				error.message
			);
			// Return empty array to prevent client-side crash
			return NextResponse.json([], { status: 200 });
		}
		console.error("Get meal selections error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

// POST to create a new meal selection
export async function POST(req: NextRequest) {
	const user = await getAuthUser(req);
	if (!user) {
		return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
	}
	if (user.role !== "STUDENT") {
		return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	}

	try {
		const { mealType, date, quantity } = await req.json();

		if (!mealType || !date || !quantity) {
			return NextResponse.json(
				{ error: "Missing meal type, date, or quantity" },
				{ status: 400 }
			);
		}

		if (typeof quantity !== "number" || quantity < 1 || quantity > 10) {
			return NextResponse.json({ error: "Invalid quantity." }, { status: 400 });
		}

		// Check if a meal has already been selected for this type and day
		const existingSelection = await prisma.mealSelection.findFirst({
			where: {
				userId: user.userId,
				mealType,
				date,
			},
		});

		if (existingSelection) {
			return NextResponse.json(
				{ error: `You have already selected ${mealType} for today.` },
				{ status: 409 }
			);
		}

		// Create new selection
		const newSelection = await prisma.mealSelection.create({
			data: {
				userId: user.userId,
				mealType,
				date,
				token: generateToken(),
				consumed: false,
				quantity: quantity,
			},
		});

		return NextResponse.json(newSelection, { status: 201 });
	} catch (error: any) {
		if (error.code === "P2023") {
			console.error(
				"Data inconsistency error in POST /api/meal-selections:",
				error.message
			);
			return NextResponse.json(
				{
					error: "A data inconsistency error occurred. Please contact support.",
				},
				{ status: 500 }
			);
		}
		console.error("Create meal selection error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
