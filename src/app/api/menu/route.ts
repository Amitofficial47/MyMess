// import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import jwt from "jsonwebtoken";
// import { cookies } from "next/headers";
// import type { UserRole, DayOfWeek, MealType } from "@prisma/client";

// async function getAuth(req: NextRequest) {
// 	const token = (await cookies()).get("token")?.value;
// 	if (!token) return null;
// 	try {
// 		return jwt.verify(token, process.env.JWT_SECRET!) as { role: UserRole };
// 	} catch (error) {
// 		return null;
// 	}
// }

// export async function GET(req: NextRequest) {
// 	const auth = await getAuth(req);
// 	if (!auth) {
// 		return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
// 	}

// 	try {
// 		const menu = await prisma.menuItem.findMany({
// 			orderBy: { id: "asc" }, // Not ideal, but need a consistent order.
// 		});
// 		return NextResponse.json(menu, { status: 200 });
// 	} catch (error) {
// 		console.error("Get menu error:", error);
// 		return NextResponse.json(
// 			{ error: "Internal server error" },
// 			{ status: 500 }
// 		);
// 	}
// }

// export async function PATCH(req: NextRequest) {
// 	const auth = await getAuth(req);
// 	if (!auth || !["ADMIN", "SUPERADMIN"].includes(auth.role)) {
// 		return NextResponse.json({ error: "Forbidden" }, { status: 403 });
// 	}

// 	try {
// 		const { day, mealType, item, notes, available } = await req.json();

// 		if (!day || !mealType) {
// 			return NextResponse.json(
// 				{ error: "Missing day or meal type" },
// 				{ status: 400 }
// 			);
// 		}

// 		const updatedMenuItem = await prisma.menuItem.update({
// 			where: {
// 				dayOfWeek_mealType: {
// 					dayOfWeek: day as DayOfWeek,
// 					mealType: mealType as MealType,
// 				},
// 			},
// 			data: {
// 				item,
// 				notes,
// 				available,
// 			},
// 		});

// 		return NextResponse.json(updatedMenuItem, { status: 200 });
// 	} catch (error) {
// 		console.error("Update menu error:", error);
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
import type { UserRole, DayOfWeek, MealType } from "@prisma/client";

async function getAuth(req: NextRequest) {
	const token = (await cookies()).get("token")?.value;
	if (!token) return null;
	try {
		return jwt.verify(token, process.env.JWT_SECRET!) as { role: UserRole };
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
		const menu = await prisma.menuItem.findMany({
			orderBy: { id: "asc" }, // Not ideal, but need a consistent order.
		});
		return NextResponse.json(menu, { status: 200 });
	} catch (error) {
		console.error("Get menu error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

export async function PATCH(req: NextRequest) {
	const auth = await getAuth(req);
	if (!auth || !["MESSADMIN", "SUPERADMIN"].includes(auth.role)) {
		return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	}

	try {
		const { day, mealType, item, notes, available } = await req.json();

		if (!day || !mealType) {
			return NextResponse.json(
				{ error: "Missing day or meal type" },
				{ status: 400 }
			);
		}

		const updatedMenuItem = await prisma.menuItem.update({
			where: {
				dayOfWeek_mealType: {
					dayOfWeek: day as DayOfWeek,
					mealType: mealType as MealType,
				},
			},
			data: {
				item,
				notes,
				available,
			},
		});

		return NextResponse.json(updatedMenuItem, { status: 200 });
	} catch (error) {
		console.error("Update menu error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
