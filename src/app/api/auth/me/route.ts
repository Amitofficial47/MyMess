// import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import jwt from "jsonwebtoken";
// import { cookies } from "next/headers";

// export async function GET(req: NextRequest) {
// 	const jwtSecret = process.env.JWT_SECRET;
// 	if (!jwtSecret) {
// 		console.error("JWT_SECRET is not defined.");
// 		return NextResponse.json(
// 			{ error: "Configuration error: JWT secret not set on server." },
// 			{ status: 500 }
// 		);
// 	}

// 	const cookieStore = cookies();
// 	const token = (await cookieStore).get("token")?.value;

// 	if (!token) {
// 		return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
// 	}

// 	try {
// 		const decoded = jwt.verify(token, jwtSecret) as unknown as {
// 			userId: string;
// 		};

// 		const user = await prisma.user.findUnique({
// 			where: { id: decoded.userId },
// 			select: {
// 				id: true,
// 				name: true,
// 				email: true,
// 				enrollmentNumber: true,
// 				course: true,
// 				role: true,
// 				status: true,
// 				hostel: true,
// 				avatar: true,
// 			},
// 		});

// 		if (!user) {
// 			const response = NextResponse.json(
// 				{ error: "User not found" },
// 				{ status: 404 }
// 			);
// 			response.cookies.set("token", "", { maxAge: -1 });
// 			return response;
// 		}

// 		const clientUser = {
// 			...user,
// 			role: user.role.toLowerCase() as
// 				| "student"
// 				| "admin"
// 				| "superadmin"
// 				| "messadmin",
// 			status: user.status,
// 		};

// 		return NextResponse.json(clientUser, { status: 200 });
// 	} catch (error) {
// 		if (error instanceof jwt.JsonWebTokenError) {
// 			const response = NextResponse.json(
// 				{ error: "Invalid token" },
// 				{ status: 401 }
// 			);
// 			response.cookies.set("token", "", { maxAge: -1 });
// 			return response;
// 		}
// 		console.error("Me error:", error);
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
import type { VerificationStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
	const jwtSecret = process.env.JWT_SECRET;
	if (!jwtSecret) {
		console.error("JWT_SECRET is not defined.");
		return NextResponse.json(
			{ error: "Configuration error: JWT secret not set on server." },
			{ status: 500 }
		);
	}

	const cookieStore = cookies();
	const token = (await cookieStore).get("token")?.value;

	if (!token) {
		return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
	}

	try {
		const decoded = jwt.verify(token, jwtSecret) as unknown as {
			userId: string;
		};

		const user = await prisma.user.findUnique({
			where: { id: decoded.userId },
			select: {
				id: true,
				displayId: true,
				name: true,
				email: true,
				enrollmentNumber: true,
				course: true,
				role: true,
				status: true,
				hostel: true,
				avatar: true,
			},
		});

		if (!user) {
			const response = NextResponse.json(
				{ error: "User not found" },
				{ status: 404 }
			);
			response.cookies.set("token", "", { maxAge: -1 });
			return response;
		}

		// Data Healing: Ensure status is never null for the client.
		const finalStatus: VerificationStatus =
			user.status || (user.role === "STUDENT" ? "PENDING" : "APPROVED");

		const clientUser = {
			...user,
			role: user.role.toLowerCase() as
				| "student"
				| "admin"
				| "superadmin"
				| "messadmin",
			status: finalStatus,
		};

		return NextResponse.json(clientUser, { status: 200 });
	} catch (error) {
		if (error instanceof jwt.JsonWebTokenError) {
			const response = NextResponse.json(
				{ error: "Invalid token" },
				{ status: 401 }
			);
			response.cookies.set("token", "", { maxAge: -1 });
			return response;
		}
		console.error("Me error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
