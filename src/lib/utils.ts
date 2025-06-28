// import { clsx, type ClassValue } from "clsx"
// import { twMerge } from "tailwind-merge"

// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs))
// }

// export function generateUserId(): string {
//   return Math.random().toString(36).substring(2, 7).toUpperCase();
// }

// export function generateToken(): string {
//   return Math.random().toString(36).substring(2, 7).toUpperCase();
// }

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function generateUserId(): string {
	// Generates a 6-character alphanumeric ID
	return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function generateToken(): string {
	return Math.random().toString(36).substring(2, 7).toUpperCase();
}

export function generateOtp(): string {
	// Generates a 6-digit numeric OTP
	return Math.floor(100000 + Math.random() * 900000).toString();
}
