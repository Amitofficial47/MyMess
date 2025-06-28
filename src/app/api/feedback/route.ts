// import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import jwt from "jsonwebtoken";
// import { cookies } from "next/headers";
// import type { UserRole } from "@prisma/client";

// interface JwtPayload {
// 	userId: string;
// 	role: UserRole;
// }

// async function getAuthUser(req: NextRequest): Promise<JwtPayload | null> {
// 	const token = (await cookies()).get("token")?.value;
// 	if (!token) return null;
// 	try {
// 		return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
// 	} catch (error) {
// 		return null;
// 	}
// }

// export async function GET(req: NextRequest) {
// 	const authUser = await getAuthUser(req);
// 	if (!authUser) {
// 		return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
// 	}

// 	try {
// 		let feedback;
// 		if (["ADMIN", "SUPERADMIN", "MESSADMIN"].includes(authUser.role)) {
// 			// Admins get all feedback
// 			feedback = await prisma.feedback.findMany({
// 				include: {
// 					user: {
// 						select: { name: true },
// 					},
// 				},
// 				orderBy: { createdAt: "desc" },
// 			});
// 		} else {
// 			// Students only get their own feedback
// 			feedback = await prisma.feedback.findMany({
// 				where: { userId: authUser.userId },
// 				include: {
// 					user: {
// 						select: { name: true },
// 					},
// 				},
// 				orderBy: { createdAt: "desc" },
// 			});
// 		}

// 		const formattedFeedback = feedback.map((f) => ({
// 			...f,
// 			userName: f.user.name,
// 		}));

// 		return NextResponse.json(formattedFeedback, { status: 200 });
// 	} catch (error) {
// 		console.error("Get feedback error:", error);
// 		return NextResponse.json(
// 			{ error: "Internal server error" },
// 			{ status: 500 }
// 		);
// 	}
// }

// export async function POST(req: NextRequest) {
// 	const authUser = await getAuthUser(req);
// 	if (!authUser || authUser.role !== "STUDENT") {
// 		return NextResponse.json({ error: "Forbidden" }, { status: 403 });
// 	}

// 	try {
// 		const { subject, message } = await req.json();
// 		if (!subject || !message) {
// 			return NextResponse.json(
// 				{ error: "Missing required fields" },
// 				{ status: 400 }
// 			);
// 		}

// 		const newFeedback = await prisma.feedback.create({
// 			data: {
// 				subject,
// 				message,
// 				userId: authUser.userId,
// 			},
// 			include: {
// 				user: {
// 					select: { name: true },
// 				},
// 			},
// 		});

// 		const formattedFeedback = {
// 			...newFeedback,
// 			userName: newFeedback.user.name,
// 		};

// 		return NextResponse.json(formattedFeedback, { status: 201 });
// 	} catch (error) {
// 		console.error("Create feedback error:", error);
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
}

async function getAuthUser(req: NextRequest): Promise<JwtPayload | null> {
	const token = (await cookies()).get("token")?.value;
	if (!token) return null;
	try {
		return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
	} catch (error) {
		return null;
	}
}

export async function GET(req: NextRequest) {
	const authUser = await getAuthUser(req);
	if (!authUser) {
		return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
	}

	try {
		let formattedFeedback;

		if (["ADMIN", "SUPERADMIN", "MESSADMIN"].includes(authUser.role)) {
			// Admins get all feedback. This approach is resilient to deleted users.
			const allFeedback = await prisma.feedback.findMany({
				orderBy: { createdAt: "desc" },
			});

			if (allFeedback.length === 0) {
				return NextResponse.json([], { status: 200 });
			}

			const userIds = [...new Set(allFeedback.map((f) => f.userId))];

			const users = await prisma.user.findMany({
				where: { id: { in: userIds } },
				select: { id: true, name: true },
			});

			const userMap = new Map(users.map((u) => [u.id, u.name]));

			formattedFeedback = allFeedback.map((f) => ({
				id: f.id,
				userId: f.userId,
				subject: f.subject,
				message: f.message,
				createdAt: f.createdAt,
				userName: userMap.get(f.userId) || "Deleted User", // Provide a fallback name
			}));
		} else {
			// Students only get their own feedback
			const feedback = await prisma.feedback.findMany({
				where: { userId: authUser.userId },
				include: {
					user: {
						select: { name: true },
					},
				},
				orderBy: { createdAt: "desc" },
			});

			// The user is guaranteed to exist here, but we add a defensive check.
			formattedFeedback = feedback.map((f) => ({
				...f,
				userName: f.user?.name || "Your Account",
			}));
		}

		return NextResponse.json(formattedFeedback, { status: 200 });
	} catch (error) {
		console.error("Get feedback error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

export async function POST(req: NextRequest) {
	const authUser = await getAuthUser(req);
	if (!authUser || authUser.role !== "STUDENT") {
		return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	}

	try {
		const { subject, message } = await req.json();
		if (!subject || !message) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 }
			);
		}

		const newFeedback = await prisma.feedback.create({
			data: {
				subject,
				message,
				userId: authUser.userId,
			},
			include: {
				user: {
					select: { name: true },
				},
			},
		});

		const formattedFeedback = {
			...newFeedback,
			userName: newFeedback.user.name,
		};

		return NextResponse.json(formattedFeedback, { status: 201 });
	} catch (error) {
		console.error("Create feedback error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
