// import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import jwt from "jsonwebtoken";
// import { cookies } from "next/headers";
// import type { UserRole } from "@prisma/client";

// interface JwtPayload {
// 	userId: string;
// 	role: UserRole;
// 	hostel: string;
// }

// const isValidObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);

// async function getAuthUser(req: NextRequest): Promise<JwtPayload | null> {
// 	const cookieStore = await cookies();
// 	const token = cookieStore.get("token")?.value;
// 	if (!token) return null;
// 	try {
// 		const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
// 		if (!isValidObjectId(decoded.userId)) {
// 			console.error(
// 				"Invalid ObjectId in JWT for addon-consumptions API:",
// 				decoded.userId
// 			);
// 			return null; // Treat as unauthenticated
// 		}
// 		return decoded;
// 	} catch (error) {
// 		return null;
// 	}
// }

// // GET all relevant addon consumptions
// export async function GET(req: NextRequest) {
// 	const user = await getAuthUser(req);
// 	if (!user) {
// 		return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
// 	}

// 	try {
// 		let whereClause: any = {};
// 		if (user.role === "STUDENT") {
// 			whereClause = { userId: user.userId };
// 		} else if (["ADMIN", "MESSADMIN"].includes(user.role)) {
// 			const hostelUsers = await prisma.user.findMany({
// 				where: { hostel: user.hostel, role: "STUDENT" },
// 				select: { id: true },
// 			});
// 			const userIds = hostelUsers.map((u) => u.id);
// 			whereClause = { userId: { in: userIds } };
// 		}
// 		// Superadmin has an empty whereClause, fetching all.

// 		const consumptions = await prisma.addonConsumption.findMany({
// 			where: whereClause,
// 			orderBy: { createdAt: "desc" },
// 		});

// 		return NextResponse.json(consumptions, { status: 200 });
// 	} catch (error: any) {
// 		if (error.code === "P2023") {
// 			console.error(
// 				"Data inconsistency error in GET /api/addon-consumptions:",
// 				error.message
// 			);
// 			// Return empty array to prevent client-side crash
// 			return NextResponse.json([], { status: 200 });
// 		}
// 		console.error("Get addon consumptions error:", error);
// 		return NextResponse.json(
// 			{ error: "Internal server error" },
// 			{ status: 500 }
// 		);
// 	}
// }

// // POST to create a new addon consumption record
// export async function POST(req: NextRequest) {
// 	const user = await getAuthUser(req);
// 	if (!user || user.role !== "STUDENT") {
// 		return NextResponse.json({ error: "Forbidden" }, { status: 403 });
// 	}

// 	try {
// 		const { addonId, mealType, date } = await req.json();

// 		if (!addonId || !mealType || !date || !isValidObjectId(addonId)) {
// 			return NextResponse.json(
// 				{ error: "Missing or invalid required fields" },
// 				{ status: 400 }
// 			);
// 		}

// 		const addon = await prisma.addon.findUnique({ where: { id: addonId } });
// 		if (!addon || !addon.available) {
// 			return NextResponse.json(
// 				{ error: "Add-on not found or is unavailable" },
// 				{ status: 404 }
// 			);
// 		}

// 		const newConsumption = await prisma.addonConsumption.create({
// 			data: {
// 				userId: user.userId,
// 				addonId: addonId,
// 				mealType,
// 				date,
// 				quantity: 1, // For now, assume quantity is always 1
// 				priceAtConsumption: addon.price,
// 				consumed: false, // Add-ons are not consumed until token is verified
// 			},
// 		});

// 		return NextResponse.json(newConsumption, { status: 201 });
// 	} catch (error: any) {
// 		if (error.code === "P2023") {
// 			console.error(
// 				"Data inconsistency error in POST /api/addon-consumptions:",
// 				error.message
// 			);
// 			return NextResponse.json(
// 				{
// 					error: "A data inconsistency error occurred. Please contact support.",
// 				},
// 				{ status: 500 }
// 			);
// 		}
// 		console.error("Create addon consumption error:", error);
// 		return NextResponse.json(
// 			{ error: "Internal server error" },
// 			{ status: 500 }
// 		);
// 	}
// }

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import type { UserRole, MealType } from "@prisma/client";

interface JwtPayload {
	userId: string;
	role: UserRole;
	hostel: string;
}

const isValidObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);

async function getAuthUser(req: NextRequest): Promise<JwtPayload | null> {
	const cookieStore = await cookies();
	const token = cookieStore.get("token")?.value;
	if (!token) return null;
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
		if (!isValidObjectId(decoded.userId)) {
			console.error(
				"Invalid ObjectId in JWT for addon-consumptions API:",
				decoded.userId
			);
			return null; // Treat as unauthenticated
		}
		return decoded;
	} catch (error) {
		return null;
	}
}

// GET all relevant addon consumptions
export async function GET(req: NextRequest) {
	const user = await getAuthUser(req);
	if (!user) {
		return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
	}

	try {
		let whereClause: any = {};
		if (user.role === "STUDENT") {
			whereClause = { userId: user.userId };
		} else if (["ADMIN", "MESSADMIN"].includes(user.role)) {
			const hostelUsers = await prisma.user.findMany({
				where: { hostel: user.hostel, role: "STUDENT" },
				select: { id: true },
			});
			const userIds = hostelUsers.map((u) => u.id);
			whereClause = { userId: { in: userIds } };
		}
		// Superadmin has an empty whereClause, fetching all.

		const consumptions = await prisma.addonConsumption.findMany({
			where: whereClause,
			include: {
				addon: {
					select: { name: true },
				},
			},
			orderBy: { createdAt: "desc" },
		});

		return NextResponse.json(consumptions, { status: 200 });
	} catch (error: any) {
		if (error.code === "P2023" || error.code === "P2032") {
			console.error(
				`Data inconsistency error in GET /api/addon-consumptions (Code: ${error.code}):`,
				error.message
			);
			// Return empty array to prevent client-side crash from malformed ObjectIDs or null required fields in the DB
			return NextResponse.json([], { status: 200 });
		}
		console.error("Get addon consumptions error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

// POST to create a new addon consumption record
export async function POST(req: NextRequest) {
	const user = await getAuthUser(req);
	if (!user || user.role !== "STUDENT") {
		return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	}

	try {
		const { addonId, mealSelectionId } = await req.json();

		if (
			!addonId ||
			!mealSelectionId ||
			!isValidObjectId(addonId) ||
			!isValidObjectId(mealSelectionId)
		) {
			return NextResponse.json(
				{ error: "Missing or invalid required fields" },
				{ status: 400 }
			);
		}

		const mealSelection = await prisma.mealSelection.findUnique({
			where: { id: mealSelectionId },
		});

		if (!mealSelection || mealSelection.userId !== user.userId) {
			return NextResponse.json(
				{ error: "Invalid meal selection" },
				{ status: 404 }
			);
		}

		const addon = await prisma.addon.findUnique({ where: { id: addonId } });
		if (!addon || !addon.available) {
			return NextResponse.json(
				{ error: "Add-on not found or is unavailable" },
				{ status: 404 }
			);
		}

		const newConsumption = await prisma.addonConsumption.create({
			data: {
				userId: user.userId,
				addonId: addonId,
				mealSelectionId: mealSelectionId,
				quantity: 1, // For now, assume quantity is always 1
				priceAtConsumption: addon.price,
				consumed: false, // Add-ons are not consumed until token is verified
			},
			include: {
				addon: {
					select: { name: true },
				},
			},
		});

		return NextResponse.json(newConsumption, { status: 201 });
	} catch (error: any) {
		if (error.code === "P2023") {
			console.error(
				"Data inconsistency error in POST /api/addon-consumptions:",
				error.message
			);
			return NextResponse.json(
				{
					error: "A data inconsistency error occurred. Please contact support.",
				},
				{ status: 500 }
			);
		}
		console.error("Create addon consumption error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
