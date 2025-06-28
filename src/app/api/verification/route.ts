// import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import jwt from "jsonwebtoken";
// import { cookies } from "next/headers";

// async function verifyAdmin(req: NextRequest) {
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

// export async function GET(req: NextRequest) {
// 	const verification = await verifyAdmin(req);
// 	if (!verification.authorized || !verification.decoded) {
// 		return verification.error;
// 	}

// 	const { role, hostel } = verification.decoded;

// 	try {
// 		const whereClause: any = {
// 			role: "STUDENT",
// 			status: "PENDING",
// 		};

// 		if (role === "ADMIN") {
// 			whereClause.hostel = hostel;
// 		}

// 		const pendingStudents = await prisma.user.findMany({
// 			where: whereClause,
// 			select: {
// 				id: true,
// 				name: true,
// 				email: true,
// 				hostel: true,
// 				createdAt: true,
// 				enrollmentNumber: true,
// 				course: true,
// 			},
// 			orderBy: {
// 				createdAt: "asc",
// 			},
// 		});

// 		return NextResponse.json(pendingStudents, { status: 200 });
// 	} catch (error) {
// 		console.error("Get pending students error:", error);
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

export async function GET(req: NextRequest) {
	const verification = await verifyAdmin(req);
	if (!verification.authorized) {
		return verification.error;
	}

	const { role, hostel } = verification.decoded;

	try {
		const whereClause: any = {
			role: "STUDENT",
			status: "PENDING",
		};

		if (role === "ADMIN") {
			whereClause.hostel = hostel;
		}

		const pendingStudents = await prisma.user.findMany({
			where: whereClause,
			select: {
				id: true,
				name: true,
				email: true,
				hostel: true,
				createdAt: true,
				enrollmentNumber: true,
				course: true,
			},
			orderBy: {
				createdAt: "asc",
			},
		});

		return NextResponse.json(pendingStudents, { status: 200 });
	} catch (error) {
		console.error("Get pending students error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
