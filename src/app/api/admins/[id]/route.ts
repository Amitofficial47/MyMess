// import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import jwt from "jsonwebtoken";
// import { cookies } from "next/headers";

// async function verifySuperAdmin(req: NextRequest) {
// 	const jwtSecret = process.env.JWT_SECRET;
// 	if (!jwtSecret) {
// 		console.error("JWT_SECRET is not defined.");
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
// 		};
// 		if (decoded.role !== "SUPERADMIN") {
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

// export async function DELETE(
// 	req: NextRequest,
// 	{ params }: { params: { id: string } }
// ) {
// 	const verification = await verifySuperAdmin(req);
// 	if (!verification.authorized || !verification.decoded) {
// 		return verification.error;
// 	}

// 	const { id } = params;

// 	if (!id) {
// 		return NextResponse.json(
// 			{ error: "Admin ID is required" },
// 			{ status: 400 }
// 		);
// 	}

// 	// Prevent superadmin from deleting themselves
// 	if (id === verification.decoded.userId) {
// 		return NextResponse.json(
// 			{ error: "Cannot delete your own account" },
// 			{ status: 403 }
// 		);
// 	}

// 	try {
// 		const deletedAdmin = await prisma.user.delete({
// 			where: {
// 				id: id,
// 				role: "ADMIN", // Ensure only admins can be deleted via this endpoint
// 			},
// 		});

// 		return NextResponse.json(
// 			{ message: "Admin deleted successfully" },
// 			{ status: 200 }
// 		);
// 	} catch (error: any) {
// 		if (error.code === "P2025") {
// 			// Prisma's code for "record not found"
// 			return NextResponse.json(
// 				{ error: "Admin not found or is not a deletable user" },
// 				{ status: 404 }
// 			);
// 		}
// 		console.error("Delete admin error:", error);
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

type AuthSuccess = {
	authorized: true;
	error: null;
	decoded: { userId: string; role: string };
};
type AuthFailure = {
	authorized: false;
	error: NextResponse;
	decoded: null;
};
type AuthResult = AuthSuccess | AuthFailure;

async function verifySuperAdmin(req: NextRequest): Promise<AuthResult> {
	const jwtSecret = process.env.JWT_SECRET;
	if (!jwtSecret) {
		console.error("JWT_SECRET is not defined.");
		return {
			authorized: false,
			error: NextResponse.json(
				{ error: "Configuration error" },
				{ status: 500 }
			),
			decoded: null,
		};
	}

	const cookieStore = await cookies();
	const token = cookieStore.get("token")?.value;

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
		};
		if (decoded.role !== "SUPERADMIN") {
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

export async function DELETE(
	req: NextRequest,
	context: { params: { id: string } }
) {
	const verification = await verifySuperAdmin(req);
	if (!verification.authorized) {
		return verification.error;
	}

	const { id } = context.params;

	if (!id) {
		return NextResponse.json(
			{ error: "Admin ID is required" },
			{ status: 400 }
		);
	}

	// Prevent superadmin from deleting themselves
	if (id === verification.decoded.userId) {
		return NextResponse.json(
			{ error: "Cannot delete your own account" },
			{ status: 403 }
		);
	}

	try {
		await prisma.user.delete({
			where: {
				id: id,
				role: "ADMIN", // Ensure only admins can be deleted via this endpoint
			},
		});

		return NextResponse.json(
			{ message: "Admin deleted successfully" },
			{ status: 200 }
		);
	} catch (error: any) {
		if (error.code === "P2025") {
			// Prisma's code for "record not found"
			return NextResponse.json(
				{ error: "Admin not found or is not a deletable user" },
				{ status: 404 }
			);
		}
		console.error("Delete admin error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
