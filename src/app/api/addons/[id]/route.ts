import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import type { UserRole } from "@prisma/client";

async function getAuth(req: NextRequest) {
	const token = (await cookies()).get("token")?.value;
	if (!token) return null;
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
			role: UserRole;
		};
		return decoded;
	} catch (error) {
		return null;
	}
}

async function verifyPrivilegedUser(req: NextRequest) {
	const auth = await getAuth(req);
	if (!auth || !["MESSADMIN", "SUPERADMIN"].includes(auth.role)) {
		return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	}
	return null;
}

// PATCH to update an add-on
export async function PATCH(
	req: NextRequest,
	context: { params: { id: string } }
) {
	const forbiddenResponse = await verifyPrivilegedUser(req);
	if (forbiddenResponse) return forbiddenResponse;

	try {
		const { id } = context.params;
		const { name, price, available } = await req.json();

		const data: { name?: string; price?: number; available?: boolean } = {};
		if (name) data.name = name;
		if (typeof price === "number") data.price = price;
		if (typeof available === "boolean") data.available = available;

		const updatedAddon = await prisma.addon.update({
			where: { id },
			data,
		});

		return NextResponse.json(updatedAddon, { status: 200 });
	} catch (error: any) {
		if (error.code === "P2023" || error.code === "P2025") {
			return NextResponse.json(
				{ error: "Add-on not found or has an invalid ID format." },
				{ status: 404 }
			);
		}
		console.error("Update addon error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

// DELETE an add-on
export async function DELETE(
	req: NextRequest,
	context: { params: { id: string } }
) {
	const forbiddenResponse = await verifyPrivilegedUser(req);
	if (forbiddenResponse) return forbiddenResponse;

	try {
		const { id } = context.params;
		await prisma.addon.delete({
			where: { id },
		});
		return NextResponse.json(
			{ message: "Add-on deleted successfully" },
			{ status: 200 }
		);
	} catch (error: any) {
		if (error.code === "P2025" || error.code === "P2023") {
			return NextResponse.json(
				{ error: "Add-on not found or has an invalid ID format." },
				{ status: 404 }
			);
		}
		console.error("Delete addon error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
