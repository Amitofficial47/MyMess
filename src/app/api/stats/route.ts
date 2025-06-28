// import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import jwt from "jsonwebtoken";
// import { cookies } from "next/headers";
// import { hostelNames } from "@/lib/hostels";

// export async function GET(req: NextRequest) {
// 	const jwtSecret = process.env.JWT_SECRET;
// 	if (!jwtSecret) {
// 		return NextResponse.json({ error: "Configuration error" }, { status: 500 });
// 	}

// 	const cookieStore = await cookies();
// 	const token = cookieStore.get("token")?.value;

// 	if (!token) {
// 		return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
// 	}

// 	try {
// 		const decoded = jwt.verify(token, jwtSecret) as unknown as {
// 			userId: string;
// 			role: string;
// 			hostel: string;
// 		};
// 		const userRole = decoded.role?.toUpperCase();

// 		if (userRole === "SUPERADMIN") {
// 			const studentCount = await prisma.user.count({
// 				where: { role: "STUDENT", status: "APPROVED" },
// 			});

// 			const adminCount = await prisma.user.count({
// 				where: { role: "ADMIN" },
// 			});

// 			return NextResponse.json({
// 				studentCount,
// 				adminCount,
// 				hostelCount: hostelNames.length,
// 			});
// 		}

// 		if (userRole === "ADMIN" || userRole === "MESSADMIN") {
// 			const studentCount = await prisma.user.count({
// 				where: {
// 					role: "STUDENT",
// 					status: "APPROVED",
// 					hostel: decoded.hostel,
// 				},
// 			});
// 			return NextResponse.json({ studentCount });
// 		}

// 		// Default deny
// 		return NextResponse.json({ error: "Forbidden" }, { status: 403 });
// 	} catch (error) {
// 		console.error("Get stats error:", error);
// 		if (error instanceof jwt.JsonWebTokenError) {
// 			return NextResponse.json({ error: "Invalid token" }, { status: 401 });
// 		}
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
import { hostelNames } from "@/lib/hostels";

export async function GET(req: NextRequest) {
	const jwtSecret = process.env.JWT_SECRET;
	if (!jwtSecret) {
		return NextResponse.json({ error: "Configuration error" }, { status: 500 });
	}

	const cookieStore = await cookies();
	const token = cookieStore.get("token")?.value;

	if (!token) {
		return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
	}

	try {
		const decoded = jwt.verify(token, jwtSecret) as unknown as {
			userId: string;
			role: string;
			hostel: string;
		};
		const userRole = decoded.role?.toUpperCase();

		if (userRole === "SUPERADMIN") {
			const studentCount = await prisma.user.count({
				where: { role: "STUDENT", status: "APPROVED" },
			});

			const adminCount = await prisma.user.count({
				where: { role: "ADMIN" },
			});

			const messAdminCount = await prisma.user.count({
				where: { role: "MESSADMIN" },
			});

			return NextResponse.json({
				studentCount,
				adminCount,
				messAdminCount,
				hostelCount: hostelNames.length,
			});
		}

		if (userRole === "ADMIN") {
			const studentCount = await prisma.user.count({
				where: {
					role: "STUDENT",
					status: "APPROVED",
					hostel: decoded.hostel,
				},
			});
			const messAdminCount = await prisma.user.count({
				where: { role: "MESSADMIN", hostel: decoded.hostel },
			});
			return NextResponse.json({ studentCount, messAdminCount });
		}

		// Default deny
		return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	} catch (error) {
		console.error("Get stats error:", error);
		if (error instanceof jwt.JsonWebTokenError) {
			return NextResponse.json({ error: "Invalid token" }, { status: 401 });
		}
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
