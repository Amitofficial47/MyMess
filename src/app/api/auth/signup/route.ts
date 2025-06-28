// import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import bcrypt from "bcryptjs";
// import { hostels } from "@/lib/hostels";

// export async function POST(req: NextRequest) {
// 	try {
// 		const { name, email, password, hostel, enrollmentNumber, course } =
// 			await req.json();

// 		if (
// 			!name ||
// 			!email ||
// 			!password ||
// 			!hostel ||
// 			!enrollmentNumber ||
// 			!course
// 		) {
// 			return NextResponse.json(
// 				{ error: "Missing required fields" },
// 				{ status: 400 }
// 			);
// 		}

// 		// --- Hostel Capacity Check ---
// 		const selectedHostelInfo = hostels.find((h) => h.name === hostel);

// 		if (!selectedHostelInfo) {
// 			return NextResponse.json(
// 				{ error: "Invalid hostel selected" },
// 				{ status: 400 }
// 			);
// 		}

// 		const currentOccupancy = await prisma.user.count({
// 			where: {
// 				hostel: hostel,
// 				// We count both approved and pending students towards the capacity
// 				status: { in: ["APPROVED", "PENDING"] },
// 			},
// 		});

// 		if (currentOccupancy >= selectedHostelInfo.capacity) {
// 			return NextResponse.json(
// 				{ error: `Sorry, ${hostel} is currently full.` },
// 				{ status: 409 }
// 			);
// 		}
// 		// --- End Capacity Check ---

// 		const existingUserByEmail = await prisma.user.findUnique({
// 			where: { email: email.toLowerCase() },
// 		});
// 		if (existingUserByEmail) {
// 			return NextResponse.json(
// 				{ error: "User with this email already exists" },
// 				{ status: 409 }
// 			);
// 		}

// 		const existingUserByEnrollment = await prisma.user.findUnique({
// 			where: { enrollmentNumber },
// 		});
// 		if (existingUserByEnrollment) {
// 			return NextResponse.json(
// 				{ error: "User with this enrollment number already exists" },
// 				{ status: 409 }
// 			);
// 		}

// 		const hashedPassword = await bcrypt.hash(password, 10);

// 		const user = await prisma.user.create({
// 			data: {
// 				name,
// 				email: email.toLowerCase(),
// 				password: hashedPassword,
// 				hostel,
// 				enrollmentNumber,
// 				course,
// 				role: "STUDENT", // Default role for signup
// 				status: "PENDING", // All new signups are pending
// 			},
// 		});

// 		const { password: _, ...userWithoutPassword } = user;

// 		const clientUser = {
// 			...userWithoutPassword,
// 			role: user.role.toLowerCase() as "student" | "admin" | "superadmin",
// 			status: user.status,
// 		};

// 		return NextResponse.json(clientUser, { status: 201 });
// 	} catch (error) {
// 		console.error("Signup error:", error);
// 		return NextResponse.json(
// 			{ error: "Internal server error" },
// 			{ status: 500 }
// 		);
// 	}
// }

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { hostels } from "@/lib/hostels";
import { generateUserId } from "@/lib/utils";

export async function POST(req: NextRequest) {
	try {
		const { name, email, password, hostel, enrollmentNumber, course } =
			await req.json();

		if (
			!name ||
			!email ||
			!password ||
			!hostel ||
			!enrollmentNumber ||
			!course
		) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 }
			);
		}

		// --- Hostel Capacity Check ---
		const selectedHostelInfo = hostels.find((h) => h.name === hostel);

		if (!selectedHostelInfo) {
			return NextResponse.json(
				{ error: "Invalid hostel selected" },
				{ status: 400 }
			);
		}

		const currentOccupancy = await prisma.user.count({
			where: {
				hostel: hostel,
				// We count both approved and pending students towards the capacity
				status: { in: ["APPROVED", "PENDING"] },
			},
		});

		if (currentOccupancy >= selectedHostelInfo.capacity) {
			return NextResponse.json(
				{ error: `Sorry, ${hostel} is currently full.` },
				{ status: 409 }
			);
		}
		// --- End Capacity Check ---

		const existingUserByEmail = await prisma.user.findUnique({
			where: { email: email.toLowerCase() },
		});
		if (existingUserByEmail) {
			return NextResponse.json(
				{ error: "User with this email already exists" },
				{ status: 409 }
			);
		}

		if (enrollmentNumber) {
			const existingUserByEnrollment = await prisma.user.findUnique({
				where: { enrollmentNumber },
			});
			if (existingUserByEnrollment) {
				return NextResponse.json(
					{ error: "User with this enrollment number already exists" },
					{ status: 409 }
				);
			}
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await prisma.user.create({
			data: {
				displayId: generateUserId(),
				name,
				email: email.toLowerCase(),
				password: hashedPassword,
				hostel,
				enrollmentNumber,
				course,
				role: "STUDENT", // Default role for signup
				status: "PENDING", // All new signups are pending
			},
		});

		const { password: _, ...userWithoutPassword } = user;

		const clientUser = {
			...userWithoutPassword,
			role: user.role.toLowerCase() as "student" | "admin" | "superadmin",
			status: user.status,
		};

		return NextResponse.json(clientUser, { status: 201 });
	} catch (error) {
		console.error("Signup error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
