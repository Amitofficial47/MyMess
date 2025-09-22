export type VerificationStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface User {
	id: string;
	displayId: string;
	name: string;
	email: string;
	enrollmentNumber: string | null;
	course: string | null;
	// No password on client-side type
	role: "student" | "admin" | "superadmin" | "messadmin";
	status: VerificationStatus;
	hostel: string;
	avatar?: string;
}

export type MealType = "Breakfast" | "Lunch" | "Dinner";

export interface MenuItem {
	id: string;
	dayOfWeek: DayOfWeek;
	mealType: MealType;
	item: string;
	notes?: string;
	available: boolean;
}

export type DayOfWeek =
	| "Monday"
	| "Tuesday"
	| "Wednesday"
	| "Thursday"
	| "Friday"
	| "Saturday"
	| "Sunday";

export type WeeklyMenu = Record<DayOfWeek, Record<MealType, MenuItem>>;

export interface MealSelection {
	id: string;
	userId: string;
	date: string; // ISO date string
	mealType: MealType;
	token: string;
	consumed: boolean;
	quantity: number;
	createdAt: string; // ISO date string
}

export interface Notification {
	id: string;
	title: string;
	message: string;
	createdAt: string; // ISO date string
}

export interface Bill {
	id: string;
	fileName: string;
	uploadDate: string; // ISO date string
	month: string;
}

export interface Feedback {
	id: string;
	userId: string;
	userName: string; // Will be joined in the API
	subject: string;
	message: string;
	createdAt: string; // ISO date string
}

export interface Addon {
	id: string;
	name: string;
	price: number;
	available: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface AddonConsumption {
	id: string;
	userId: string;
	addonId: string;
	mealSelectionId: string;
	quantity: number;
	priceAtConsumption: number;
	consumed: boolean;
	createdAt: string;
	addon?: {
		name: string;
	};
}
