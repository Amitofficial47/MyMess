export type VerificationStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface User {
	id: string;
	name: string;
	email: string;
	enrollmentNumber: string | null;
	course: string | null;
	// No password on client-side type
	role: "student" | "admin" | "superadmin";
	status: VerificationStatus;
	hostel: string;
	avatar?: string;
}

export type MealType = "Breakfast" | "Lunch" | "Dinner";

export interface MenuItem {
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
}

export interface Notification {
	id: string;
	title: string;
	message: string;
	timestamp: string; // ISO date string
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
	userName: string;
	subject: string;
	message: string;
	timestamp: string; // ISO date string
}
