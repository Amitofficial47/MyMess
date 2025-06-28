// import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import jwt from "jsonwebtoken";
// import { cookies } from "next/headers";
// import type { UserRole } from "@prisma/client";

// type AuthSuccess = {
// 	authorized: true;
// 	error: null;
// };
// type AuthFailure = {
// 	authorized: false;
// 	error: NextResponse;
// };
// type AuthResult = AuthSuccess | AuthFailure;

// async function verifyAdmin(req: NextRequest): Promise<AuthResult> {
// 	const jwtSecret = process.env.JWT_SECRET;
// 	if (!jwtSecret) {
// 		return {
// 			authorized: false,
// 			error: NextResponse.json(
// 				{ error: "Configuration error" },
// 				{ status: 500 }
// 			),
// 		};
// 	}
// 	const token = (await cookies()).get("token")?.value;
// 	if (!token) {
// 		return {
// 			authorized: false,
// 			error: NextResponse.json({ error: "Not authenticated" }, { status: 401 }),
// 		};
// 	}
// 	try {
// 		const decoded = jwt.verify(token, jwtSecret) as { role: UserRole };
// 		if (!["ADMIN", "SUPERADMIN"].includes(decoded.role)) {
// 			return {
// 				authorized: false,
// 				error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
// 			};
// 		}
// 		return { authorized: true, error: null };
// 	} catch (error) {
// 		return {
// 			authorized: false,
// 			error: NextResponse.json({ error: "Invalid token" }, { status: 401 }),
// 		};
// 	}
// }

// export async function DELETE(
// 	req: NextRequest,
// 	context: { params: { id: string } }
// ) {
// 	const verification = await verifyAdmin(req);
// 	if (!verification.authorized) return verification.error;

// 	const { id } = context.params;

// 	try {
// 		await prisma.notification.delete({
// 			where: { id },
// 		});
// 		return NextResponse.json(
// 			{ message: "Notification deleted" },
// 			{ status: 200 }
// 		);
// 	} catch (error) {
// 		console.error("Delete notification error:", error);
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
		let feedback;
		if (["ADMIN", "SUPERADMIN", "MESSADMIN"].includes(authUser.role)) {
			// Admins get all feedback
			feedback = await prisma.feedback.findMany({
				include: {
					user: {
						select: { name: true },
					},
				},
				orderBy: { createdAt: "desc" },
			});
		} else {
			// Students only get their own feedback
			feedback = await prisma.feedback.findMany({
				where: { userId: authUser.userId },
				include: {
					user: {
						select: { name: true },
					},
				},
				orderBy: { createdAt: "desc" },
			});
		}

		const formattedFeedback = feedback.map((f) => ({
			...f,
			userName: f.user.name,
		}));

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
