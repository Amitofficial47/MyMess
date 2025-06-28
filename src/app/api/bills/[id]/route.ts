// import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import jwt from "jsonwebtoken";
// import { cookies } from "next/headers";
// import type { UserRole } from "@prisma/client";

// async function verifyAdmin(req: NextRequest) {
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
// 	{ params }: { params: { id: string } }
// ) {
// 	const verification = await verifyAdmin(req);
// 	if (!verification.authorized) return verification.error!;

// 	const { id } = params;

// 	try {
// 		await prisma.bill.delete({
// 			where: { id },
// 		});
// 		return NextResponse.json({ message: "Bill deleted" }, { status: 200 });
// 	} catch (error) {
// 		console.error("Delete bill error:", error);
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

type AuthSuccess = {
	authorized: true;
	error: null;
};
type AuthFailure = {
	authorized: false;
	error: NextResponse;
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
		};
	}
	const token = (await cookies()).get("token")?.value;
	if (!token) {
		return {
			authorized: false,
			error: NextResponse.json({ error: "Not authenticated" }, { status: 401 }),
		};
	}
	try {
		const decoded = jwt.verify(token, jwtSecret) as { role: UserRole };
		if (!["ADMIN", "SUPERADMIN"].includes(decoded.role)) {
			return {
				authorized: false,
				error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
			};
		}
		return { authorized: true, error: null };
	} catch (error) {
		return {
			authorized: false,
			error: NextResponse.json({ error: "Invalid token" }, { status: 401 }),
		};
	}
}

export async function DELETE(
	req: NextRequest,
	context: { params: { id: string } }
) {
	const verification = await verifyAdmin(req);
	if (!verification.authorized) return verification.error;

	const { id } = context.params;

	try {
		await prisma.bill.delete({
			where: { id },
		});
		return NextResponse.json({ message: "Bill deleted" }, { status: 200 });
	} catch (error) {
		console.error("Delete bill error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
