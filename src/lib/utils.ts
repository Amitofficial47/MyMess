import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateUserId(): string {
  return Math.random().toString(36).substring(2, 7).toUpperCase();
}

export function generateToken(): string {
  return Math.random().toString(36).substring(2, 7).toUpperCase();
}
