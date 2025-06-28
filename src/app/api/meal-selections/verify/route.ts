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

// async function getAuthUser(req: NextRequest): Promise<JwtPayload | null> {
// 	const jwtSecret = process.env.JWT_SECRET;
// 	if (!jwtSecret) {
// 		console.error("JWT_SECRET not defined");
// 		return null;
// 	}
// 	const token = (await cookies()).get("token")?.value;
// 	if (!token) return null;

// 	try {
// 		return jwt.verify(token, jwtSecret) as JwtPayload;
// 	} catch (error) {
// 		return null;
// 	}
// }

// // PATCH to verify a token
// export async function PATCH(req: NextRequest) {
// 	const adminUser = await getAuthUser(req);
// 	if (
// 		!adminUser ||
// 		!["ADMIN", "MESSADMIN", "SUPERADMIN"].includes(adminUser.role)
// 	) {
// 		return NextResponse.json({ error: "Forbidden" }, { status: 403 });
// 	}

// 	try {
// 		const { token } = await req.json();

// 		if (!token) {
// 			return NextResponse.json({ error: "Token is required" }, { status: 400 });
// 		}

// 		const today = new Date().toISOString().split("T")[0];

// 		const selection = await prisma.mealSelection.findUnique({
// 			where: { token: token.toUpperCase(), date: today },
// 			include: { user: true },
// 		});

// 		if (!selection) {
// 			return NextResponse.json(
// 				{ error: "Token not found for today or is invalid." },
// 				{ status: 404 }
// 			);
// 		}

// 		if (selection.consumed) {
// 			return NextResponse.json(
// 				{ error: "This token has already been used." },
// 				{ status: 409 }
// 			);
// 		}

// 		// Admins can only verify tokens for students in their own hostel
// 		if (
// 			adminUser.role !== "SUPERADMIN" &&
// 			selection.user.hostel !== adminUser.hostel
// 		) {
// 			return NextResponse.json(
// 				{ error: "You are not authorized to verify tokens for this hostel." },
// 				{ status: 403 }
// 			);
// 		}

// 		const updatedSelection = await prisma.mealSelection.update({
// 			where: { id: selection.id },
// 			data: { consumed: true },
// 		});

// 		return NextResponse.json(updatedSelection, { status: 200 });
// 	} catch (error: any) {
// 		if (error.code === "P2025") {
// 			// Prisma code for record not found
// 			return NextResponse.json(
// 				{ error: "Token not found for today or is invalid." },
// 				{ status: 404 }
// 			);
// 		}
// 		console.error("Verify token error:", error);
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
import type { UserRole } from "@prisma/client";

interface JwtPayload {
	userId: string;
	role: UserRole;
	hostel: string;
}

async function getAuthUser(req: NextRequest): Promise<JwtPayload | null> {
	const jwtSecret = process.env.JWT_SECRET;
	if (!jwtSecret) {
		console.error("JWT_SECRET not defined");
		return null;
	}
	const token = (await cookies()).get("token")?.value;
	if (!token) return null;

	try {
		return jwt.verify(token, jwtSecret) as JwtPayload;
	} catch (error) {
		return null;
	}
}

// PATCH to verify a token
export async function PATCH(req: NextRequest) {
	const adminUser = await getAuthUser(req);
	if (!adminUser || !["MESSADMIN", "SUPERADMIN"].includes(adminUser.role)) {
		return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	}

	try {
		const { token } = await req.json();

		if (!token) {
			return NextResponse.json({ error: "Token is required" }, { status: 400 });
		}

		const today = new Date().toISOString().split("T")[0];

		const selection = await prisma.mealSelection.findUnique({
			where: { token: token.toUpperCase(), date: today },
			include: { user: true },
		});

		if (!selection) {
			return NextResponse.json(
				{ error: "Token not found for today or is invalid." },
				{ status: 404 }
			);
		}

		if (selection.consumed) {
			return NextResponse.json(
				{ error: "This token has already been used." },
				{ status: 409 }
			);
		}

		// Admins can only verify tokens for students in their own hostel
		if (
			adminUser.role !== "SUPERADMIN" &&
			selection.user.hostel !== adminUser.hostel
		) {
			return NextResponse.json(
				{ error: "You are not authorized to verify tokens for this hostel." },
				{ status: 403 }
			);
		}

		const updatedSelection = await prisma.mealSelection.update({
			where: { id: selection.id },
			data: { consumed: true },
		});

		return NextResponse.json(updatedSelection, { status: 200 });
	} catch (error: any) {
		if (error.code === "P2025") {
			// Prisma code for record not found
			return NextResponse.json(
				{ error: "Token not found for today or is invalid." },
				{ status: 404 }
			);
		}
		console.error("Verify token error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
