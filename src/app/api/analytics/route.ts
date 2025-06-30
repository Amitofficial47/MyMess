import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import {
	subDays,
	format,
	eachDayOfInterval,
	parseISO,
	startOfDay,
} from "date-fns";

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
	const token = (await cookies()).get("token")?.value;
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

	const { role, hostel: adminHostel } = verification.decoded;
	const searchParams = req.nextUrl.searchParams;
	const filterHostel = searchParams.get("hostel");

	try {
		const dateTo = startOfDay(new Date());
		const dateFrom = startOfDay(subDays(dateTo, 29));

		const whereClause: any = {
			consumed: true,
			date: {
				gte: format(dateFrom, "yyyy-MM-dd"),
				lte: format(dateTo, "yyyy-MM-dd"),
			},
		};

		let targetHostel: string | null = null;
		if (role === "SUPERADMIN") {
			if (filterHostel && filterHostel !== "All Hostels") {
				targetHostel = filterHostel;
			}
		} else {
			// role is 'ADMIN'
			targetHostel = adminHostel;
		}

		if (targetHostel) {
			const hostelUsers = await prisma.user.findMany({
				where: { hostel: targetHostel, role: "STUDENT" },
				select: { id: true },
			});
			const userIds = hostelUsers.map((u) => u.id);
			whereClause.userId = { in: userIds };
		}

		const consumedMeals = await prisma.mealSelection.findMany({
			where: whereClause,
			select: { date: true, mealType: true },
		});

		// --- Process Daily Consumption ---
		const dailyCounts = new Map<string, number>();
		const interval = eachDayOfInterval({ start: dateFrom, end: dateTo });
		interval.forEach((day) => {
			dailyCounts.set(format(day, "yyyy-MM-dd"), 0);
		});

		consumedMeals.forEach((meal) => {
			const date = format(parseISO(meal.date), "yyyy-MM-dd");
			dailyCounts.set(date, (dailyCounts.get(date) || 0) + 1);
		});

		const dailyConsumption = Array.from(dailyCounts.entries())
			.map(([date, total]) => ({ date, total }))
			.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

		// --- Process Meal Type Distribution ---
		const mealTypeCounts = { Breakfast: 0, Lunch: 0, Dinner: 0 };
		consumedMeals.forEach((meal) => {
			mealTypeCounts[meal.mealType]++;
		});

		const mealTypeDistribution = [
			{ name: "Breakfast", value: mealTypeCounts.Breakfast },
			{ name: "Lunch", value: mealTypeCounts.Lunch },
			{ name: "Dinner", value: mealTypeCounts.Dinner },
		];

		const totalMeals = consumedMeals.length;

		return NextResponse.json(
			{
				dailyConsumption,
				mealTypeDistribution,
				totalMeals,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Get analytics error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
