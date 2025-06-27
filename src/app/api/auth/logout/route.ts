import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
	try {
		(await cookies()).set("token", "", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: -1, // Expire the cookie
			path: "/",
		});

		return NextResponse.json({ message: "Logout successful" }, { status: 200 });
	} catch (error) {
		console.error("Logout error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
