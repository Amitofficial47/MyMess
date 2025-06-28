// import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import jwt from "jsonwebtoken";
// import { cookies } from "next/headers";
// import type { VerificationStatus } from "@prisma/client";

// type AuthSuccess = {
// 	authorized: true;
// 	error: null;
// 	decoded: { userId: string; role: string; hostel: string };
// };
// type AuthFailure = {
// 	authorized: false;
// 	error: NextResponse;
// 	decoded: null;
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
// 			decoded: null,
// 		};
// 	}

// 	const cookieStore = cookies();
// 	const token = (await cookieStore).get("token")?.value;

// 	if (!token) {
// 		return {
// 			authorized: false,
// 			error: NextResponse.json({ error: "Not authenticated" }, { status: 401 }),
// 			decoded: null,
// 		};
// 	}

// 	try {
// 		const decoded = jwt.verify(token, jwtSecret) as unknown as {
// 			userId: string;
// 			role: string;
// 			hostel: string;
// 		};
// 		if (decoded.role !== "ADMIN" && decoded.role !== "SUPERADMIN") {
// 			return {
// 				authorized: false,
// 				error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
// 				decoded: null,
// 			};
// 		}
// 		return { authorized: true, error: null, decoded };
// 	} catch (error) {
// 		return {
// 			authorized: false,
// 			error: NextResponse.json({ error: "Invalid token" }, { status: 401 }),
// 			decoded: null,
// 		};
// 	}
// }

// export async function PATCH(
// 	req: NextRequest,
// 	context: { params: { id: string } }
// ) {
// 	const verification = await verifyAdmin(req);
// 	if (!verification.authorized) {
// 		return verification.error;
// 	}

// 	const { id: userIdToVerify } = context.params;
// 	const { status } = (await req.json()) as { status: VerificationStatus };

// 	if (!userIdToVerify) {
// 		return NextResponse.json({ error: "User ID is required" }, { status: 400 });
// 	}

// 	if (!["APPROVED", "REJECTED"].includes(status)) {
// 		return NextResponse.json(
// 			{ error: "Invalid status provided" },
// 			{ status: 400 }
// 		);
// 	}

// 	try {
// 		const studentToVerify = await prisma.user.findUnique({
// 			where: { id: userIdToVerify },
// 		});

// 		if (!studentToVerify) {
// 			return NextResponse.json(
// 				{ error: "User to verify not found" },
// 				{ status: 404 }
// 			);
// 		}

// 		// Security check: Admins can only verify students in their own hostel. Superadmins can verify anyone.
// 		if (
// 			verification.decoded.role === "ADMIN" &&
// 			studentToVerify.hostel !== verification.decoded.hostel
// 		) {
// 			return NextResponse.json(
// 				{ error: "Forbidden: You can only manage students in your own hostel" },
// 				{ status: 403 }
// 			);
// 		}

// 		await prisma.user.update({
// 			where: { id: userIdToVerify },
// 			data: { status: status },
// 		});

// 		return NextResponse.json(
// 			{ message: `User status updated to ${status}` },
// 			{ status: 200 }
// 		);
// 	} catch (error) {
// 		console.error("Verification update error:", error);
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
import { sendVerificationEmail } from "@/lib/email";

type AuthSuccess = {
	authorized: true;
	error: null;
	decoded: { userId: string; role: string; hostel: string };
};
type AuthFailure = {
	authorized: false;
	error: NextResponse;
	decoded: null;
};
type AuthResult = AuthSuccess | AuthFailure;

async function verifyAdmin(req: NextRequest): Promise<AuthResult> {
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
		if (decoded.role !== "ADMIN" && decoded.role !== "SUPERADMIN") {
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

export async function PATCH(
	req: NextRequest,
	context: { params: { id: string } }
) {
	const verification = await verifyAdmin(req);
	if (!verification.authorized) {
		return verification.error;
	}

	const { id: userIdToVerify } = context.params;
	const { status } = (await req.json()) as { status: VerificationStatus };

	if (!userIdToVerify) {
		return NextResponse.json({ error: "User ID is required" }, { status: 400 });
	}

	if (!["APPROVED", "REJECTED"].includes(status)) {
		return NextResponse.json(
			{ error: "Invalid status provided" },
			{ status: 400 }
		);
	}

	try {
		const studentToVerify = await prisma.user.findUnique({
			where: { id: userIdToVerify },
		});

		if (!studentToVerify) {
			return NextResponse.json(
				{ error: "User to verify not found" },
				{ status: 404 }
			);
		}

		// Security check: Admins can only verify students in their own hostel. Superadmins can verify anyone.
		if (
			verification.decoded.role === "ADMIN" &&
			studentToVerify.hostel !== verification.decoded.hostel
		) {
			return NextResponse.json(
				{ error: "Forbidden: You can only manage students in your own hostel" },
				{ status: 403 }
			);
		}

		await prisma.user.update({
			where: { id: userIdToVerify },
			data: { status: status },
		});

		// Send notification email if approved
		if (status === "APPROVED") {
			try {
				await sendVerificationEmail(
					studentToVerify.email,
					studentToVerify.name,
					studentToVerify.displayId,
					studentToVerify.hostel
				);
			} catch (emailError) {
				console.error(
					`Failed to send verification email to ${studentToVerify.email}:`,
					emailError
				);
				// Do not block the main action if email fails. Log the error.
			}
		}

		return NextResponse.json(
			{ message: `User status updated to ${status}` },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Verification update error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
