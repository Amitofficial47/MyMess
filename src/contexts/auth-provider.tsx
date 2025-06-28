"use client";

import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from "react";
import type { User } from "@/lib/types";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";

interface AuthContextProps {
	user: User | null;
	loading: boolean;
	login: (
		email: string,
		password: string
	) => Promise<{ success: boolean; message?: string; user?: User }>;
	signup: (
		name: string,
		email: string,
		password: string,
		hostel: string,
		enrollmentNumber: string,
		course: string
	) => Promise<{ success: boolean; message?: string; user?: User }>;
	logout: () => void;
	updateUser: (name: string, avatar?: string) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const checkUserSession = async () => {
			try {
				const res = await fetchApi("/api/auth/me");
				if (res.ok) {
					const data = await res.json();
					setUser(data);
				} else {
					setUser(null);
				}
			} catch (error) {
				console.error("Failed to fetch user session", error);
				setUser(null);
			} finally {
				setLoading(false);
			}
		};
		checkUserSession();
	}, []);

	const login = async (
		email: string,
		password: string
	): Promise<{ success: boolean; message?: string; user?: User }> => {
		try {
			const res = await fetchApi("/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});
			const data = await res.json();
			if (res.ok) {
				setUser(data.user);
				return { success: true, user: data.user };
			}
			return { success: false, message: data.error };
		} catch (error) {
			return { success: false, message: "An unexpected error occurred." };
		}
	};

	const signup = async (
		name: string,
		email: string,
		password: string,
		hostel: string,
		enrollmentNumber: string,
		course: string
	): Promise<{ success: boolean; message?: string; user?: User }> => {
		try {
			const res = await fetchApi("/api/auth/signup", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name,
					email,
					password,
					hostel,
					enrollmentNumber,
					course,
				}),
			});

			const data = await res.json();
			if (!res.ok) {
				return { success: false, message: data.error };
			}

			// Automatically log the user in after successful signup
			const loginResult = await login(email, password);
			return loginResult;
		} catch (error) {
			return {
				success: false,
				message: "An unexpected error occurred during signup.",
			};
		}
	};

	const logout = async () => {
		try {
			await fetchApi("/api/auth/logout", { method: "POST" });
			setUser(null);
		} catch (error) {
			console.error("Logout failed", error);
		}
	};

	const updateUser = (name: string, avatar?: string) => {
		// This will need a backend implementation.
		console.warn("updateUser is not fully implemented with the backend yet.");
		if (user) {
			const updatedUser = {
				...user,
				name,
				avatar: avatar !== undefined ? avatar : user.avatar,
			};
			setUser(updatedUser);
			// TODO: Create a POST /api/user/update endpoint
		}
	};

	const value = { user, loading, login, signup, logout, updateUser };

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
