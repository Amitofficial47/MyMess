// "use client";

// import React, {
// 	createContext,
// 	useContext,
// 	ReactNode,
// 	useState,
// 	useEffect,
// 	useCallback,
// } from "react";
// import type {
// 	User,
// 	WeeklyMenu,
// 	MealSelection,
// 	Notification,
// 	Bill,
// 	Feedback,
// 	DayOfWeek,
// 	MealType,
// 	MenuItem,
// } from "@/lib/types";
// import { useAuth } from "./auth-provider";

// // --- Context Definition ---
// interface DataContextProps {
// 	users: Omit<User, "password" | "email">[];
// 	menu: WeeklyMenu;
// 	updateMenuItem: (
// 		day: DayOfWeek,
// 		mealType: MealType,
// 		menuItem: Partial<MenuItem>
// 	) => Promise<boolean>;
// 	mealSelections: MealSelection[];
// 	addMealSelection: (
// 		userId: string,
// 		mealType: MealType,
// 		date: string
// 	) => Promise<{ success: boolean; selection?: MealSelection; error?: string }>;
// 	verifyToken: (token: string) => Promise<{ success: boolean; error?: string }>;
// 	notifications: Notification[];
// 	addNotification: (title: string, message: string) => Promise<boolean>;
// 	deleteNotification: (id: string) => Promise<boolean>;
// 	bills: Bill[];
// 	addBill: (fileName: string, month: string) => Promise<boolean>;
// 	deleteBill: (id: string) => Promise<boolean>;
// 	feedback: Feedback[];
// 	addFeedback: (subject: string, message: string) => Promise<boolean>;
// }

// const DataContext = createContext<DataContextProps | undefined>(undefined);

// // --- Provider Component ---
// export function DataProvider({ children }: { children: ReactNode }) {
// 	const { user } = useAuth();

// 	const [users, setUsers] = useState<Omit<User, "password" | "email">[]>([]);
// 	const [menu, setMenu] = useState<WeeklyMenu>({} as WeeklyMenu);
// 	const [mealSelections, setMealSelections] = useState<MealSelection[]>([]);
// 	const [notifications, setNotifications] = useState<Notification[]>([]);
// 	const [bills, setBills] = useState<Bill[]>([]);
// 	const [feedback, setFeedback] = useState<Feedback[]>([]);

// 	const fetchAllData = useCallback(async () => {
// 		if (!user) return;
// 		try {
// 			const [
// 				usersRes,
// 				selectionsRes,
// 				menuRes,
// 				notificationsRes,
// 				billsRes,
// 				feedbackRes,
// 			] = await Promise.all([
// 				fetch("/api/users"),
// 				fetch("/api/meal-selections"),
// 				fetch("/api/menu"),
// 				fetch("/api/notifications"),
// 				fetch("/api/bills"),
// 				fetch("/api/feedback"),
// 			]);

// 			if (usersRes.ok) setUsers(await usersRes.json());
// 			if (selectionsRes.ok) setMealSelections(await selectionsRes.json());
// 			if (notificationsRes.ok) setNotifications(await notificationsRes.json());
// 			if (billsRes.ok) setBills(await billsRes.json());
// 			if (feedbackRes.ok) setFeedback(await feedbackRes.json());

// 			if (menuRes.ok) {
// 				const menuItems: MenuItem[] = await menuRes.json();
// 				const weeklyMenu = menuItems.reduce((acc, item) => {
// 					if (!acc[item.dayOfWeek]) acc[item.dayOfWeek] = {} as any;
// 					acc[item.dayOfWeek][item.mealType] = item;
// 					return acc;
// 				}, {} as WeeklyMenu);
// 				setMenu(weeklyMenu);
// 			}
// 		} catch (error) {
// 			console.error("Failed to fetch data:", error);
// 		}
// 	}, [user]);

// 	useEffect(() => {
// 		fetchAllData();
// 	}, [fetchAllData]);

// 	const updateMenuItem = async (
// 		day: DayOfWeek,
// 		mealType: MealType,
// 		menuItem: Partial<MenuItem>
// 	): Promise<boolean> => {
// 		try {
// 			const res = await fetch("/api/menu", {
// 				method: "PATCH",
// 				headers: { "Content-Type": "application/json" },
// 				body: JSON.stringify({ day, mealType, ...menuItem }),
// 			});
// 			if (res.ok) {
// 				const updatedItem = await res.json();
// 				setMenu((prev) => ({
// 					...prev,
// 					[day]: { ...prev[day], [mealType]: updatedItem },
// 				}));
// 				return true;
// 			}
// 			return false;
// 		} catch (error) {
// 			console.error("Failed to update menu item:", error);
// 			return false;
// 		}
// 	};

// 	const addMealSelection = async (
// 		userId: string,
// 		mealType: MealType,
// 		date: string
// 	): Promise<{
// 		success: boolean;
// 		selection?: MealSelection;
// 		error?: string;
// 	}> => {
// 		try {
// 			const res = await fetch("/api/meal-selections", {
// 				method: "POST",
// 				headers: { "Content-Type": "application/json" },
// 				body: JSON.stringify({ mealType, date }),
// 			});
// 			const data = await res.json();
// 			if (!res.ok) {
// 				return { success: false, error: data.error };
// 			}
// 			setMealSelections((prev) => [data, ...prev]);
// 			return { success: true, selection: data };
// 		} catch (error) {
// 			return { success: false, error: "An unexpected error occurred." };
// 		}
// 	};

// 	const verifyToken = async (
// 		token: string
// 	): Promise<{ success: boolean; error?: string }> => {
// 		try {
// 			const res = await fetch("/api/meal-selections/verify", {
// 				method: "PATCH",
// 				headers: { "Content-Type": "application/json" },
// 				body: JSON.stringify({ token }),
// 			});
// 			const data = await res.json();
// 			if (!res.ok) {
// 				return { success: false, error: data.error };
// 			}
// 			setMealSelections((prev) =>
// 				prev.map((sel) =>
// 					sel.id === data.id ? { ...sel, consumed: true } : sel
// 				)
// 			);
// 			return { success: true };
// 		} catch (error) {
// 			return { success: false, error: "An unexpected error occurred." };
// 		}
// 	};

// 	const addNotification = async (
// 		title: string,
// 		message: string
// 	): Promise<boolean> => {
// 		try {
// 			const res = await fetch("/api/notifications", {
// 				method: "POST",
// 				headers: { "Content-Type": "application/json" },
// 				body: JSON.stringify({ title, message }),
// 			});
// 			if (res.ok) {
// 				const newNotification = await res.json();
// 				setNotifications((prev) => [newNotification, ...prev]);
// 				return true;
// 			}
// 			return false;
// 		} catch (error) {
// 			console.error("Failed to add notification:", error);
// 			return false;
// 		}
// 	};

// 	const deleteNotification = async (id: string): Promise<boolean> => {
// 		try {
// 			const res = await fetch(`/api/notifications/${id}`, { method: "DELETE" });
// 			if (res.ok) {
// 				setNotifications((prev) => prev.filter((n) => n.id !== id));
// 				return true;
// 			}
// 			return false;
// 		} catch (error) {
// 			console.error("Failed to delete notification:", error);
// 			return false;
// 		}
// 	};

// 	const addBill = async (fileName: string, month: string): Promise<boolean> => {
// 		try {
// 			const res = await fetch("/api/bills", {
// 				method: "POST",
// 				headers: { "Content-Type": "application/json" },
// 				body: JSON.stringify({ fileName, month }),
// 			});
// 			if (res.ok) {
// 				const newBill = await res.json();
// 				setBills((prev) => [newBill, ...prev]);
// 				return true;
// 			}
// 			return false;
// 		} catch (error) {
// 			console.error("Failed to add bill:", error);
// 			return false;
// 		}
// 	};

// 	const deleteBill = async (id: string): Promise<boolean> => {
// 		try {
// 			const res = await fetch(`/api/bills/${id}`, { method: "DELETE" });
// 			if (res.ok) {
// 				setBills((prev) => prev.filter((b) => b.id !== id));
// 				return true;
// 			}
// 			return false;
// 		} catch (error) {
// 			console.error("Failed to delete bill:", error);
// 			return false;
// 		}
// 	};

// 	const addFeedback = async (
// 		subject: string,
// 		message: string
// 	): Promise<boolean> => {
// 		try {
// 			const res = await fetch("/api/feedback", {
// 				method: "POST",
// 				headers: { "Content-Type": "application/json" },
// 				body: JSON.stringify({ subject, message }),
// 			});
// 			if (res.ok) {
// 				const newFeedback = await res.json();
// 				setFeedback((prev) => [newFeedback, ...prev]);
// 				return true;
// 			}
// 			return false;
// 		} catch (error) {
// 			console.error("Failed to add feedback:", error);
// 			return false;
// 		}
// 	};

// 	const value = {
// 		users,
// 		menu,
// 		updateMenuItem,
// 		mealSelections,
// 		addMealSelection,
// 		verifyToken,
// 		notifications,
// 		addNotification,
// 		deleteNotification,
// 		bills,
// 		addBill,
// 		deleteBill,
// 		feedback,
// 		addFeedback,
// 	};

// 	return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
// }

// // --- Custom Hook ---
// export function useData() {
// 	const context = useContext(DataContext);
// 	if (context === undefined) {
// 		throw new Error("useData must be used within a DataProvider");
// 	}
// 	return context;
// }

"use client";

import React, {
	createContext,
	useContext,
	ReactNode,
	useState,
	useEffect,
	useCallback,
} from "react";
import type {
	User,
	WeeklyMenu,
	MealSelection,
	Notification,
	Bill,
	Feedback,
	DayOfWeek,
	MealType,
	MenuItem,
} from "@/lib/types";
import { useAuth } from "./auth-provider";
import { fetchApi } from "@/lib/api";

// --- Context Definition ---
interface DataContextProps {
	users: Omit<User, "password" | "email">[];
	menu: WeeklyMenu;
	updateMenuItem: (
		day: DayOfWeek,
		mealType: MealType,
		menuItem: Partial<MenuItem>
	) => Promise<boolean>;
	mealSelections: MealSelection[];
	addMealSelection: (
		userId: string,
		mealType: MealType,
		date: string
	) => Promise<{ success: boolean; selection?: MealSelection; error?: string }>;
	verifyToken: (token: string) => Promise<{ success: boolean; error?: string }>;
	notifications: Notification[];
	addNotification: (title: string, message: string) => Promise<boolean>;
	deleteNotification: (id: string) => Promise<boolean>;
	bills: Bill[];
	addBill: (fileName: string, month: string) => Promise<boolean>;
	deleteBill: (id: string) => Promise<boolean>;
	feedback: Feedback[];
	addFeedback: (subject: string, message: string) => Promise<boolean>;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

// --- Provider Component ---
export function DataProvider({ children }: { children: ReactNode }) {
	const { user } = useAuth();

	const [users, setUsers] = useState<Omit<User, "password" | "email">[]>([]);
	const [menu, setMenu] = useState<WeeklyMenu>({} as WeeklyMenu);
	const [mealSelections, setMealSelections] = useState<MealSelection[]>([]);
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [bills, setBills] = useState<Bill[]>([]);
	const [feedback, setFeedback] = useState<Feedback[]>([]);

	const fetchAllData = useCallback(async () => {
		if (!user) return;
		try {
			const [
				usersRes,
				selectionsRes,
				menuRes,
				notificationsRes,
				billsRes,
				feedbackRes,
			] = await Promise.all([
				fetchApi("/api/users"),
				fetchApi("/api/meal-selections"),
				fetchApi("/api/menu"),
				fetchApi("/api/notifications"),
				fetchApi("/api/bills"),
				fetchApi("/api/feedback"),
			]);

			if (usersRes.ok) setUsers(await usersRes.json());
			if (selectionsRes.ok) setMealSelections(await selectionsRes.json());
			if (notificationsRes.ok) setNotifications(await notificationsRes.json());
			if (billsRes.ok) setBills(await billsRes.json());
			if (feedbackRes.ok) setFeedback(await feedbackRes.json());

			if (menuRes.ok) {
				const menuItems: MenuItem[] = await menuRes.json();
				const weeklyMenu = menuItems.reduce((acc, item) => {
					if (!acc[item.dayOfWeek]) acc[item.dayOfWeek] = {} as any;
					acc[item.dayOfWeek][item.mealType] = item;
					return acc;
				}, {} as WeeklyMenu);
				setMenu(weeklyMenu);
			}
		} catch (error) {
			console.error("Failed to fetch data:", error);
		}
	}, [user]);

	useEffect(() => {
		fetchAllData();
	}, [fetchAllData]);

	const updateMenuItem = async (
		day: DayOfWeek,
		mealType: MealType,
		menuItem: Partial<MenuItem>
	): Promise<boolean> => {
		try {
			const res = await fetchApi("/api/menu", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ day, mealType, ...menuItem }),
			});
			if (res.ok) {
				const updatedItem = await res.json();
				setMenu((prev) => ({
					...prev,
					[day]: { ...prev[day], [mealType]: updatedItem },
				}));
				return true;
			}
			return false;
		} catch (error) {
			console.error("Failed to update menu item:", error);
			return false;
		}
	};

	const addMealSelection = async (
		userId: string,
		mealType: MealType,
		date: string
	): Promise<{
		success: boolean;
		selection?: MealSelection;
		error?: string;
	}> => {
		try {
			const res = await fetchApi("/api/meal-selections", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ mealType, date }),
			});
			const data = await res.json();
			if (!res.ok) {
				return { success: false, error: data.error };
			}
			setMealSelections((prev) => [data, ...prev]);
			return { success: true, selection: data };
		} catch (error) {
			return { success: false, error: "An unexpected error occurred." };
		}
	};

	const verifyToken = async (
		token: string
	): Promise<{ success: boolean; error?: string }> => {
		try {
			const res = await fetchApi("/api/meal-selections/verify", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ token }),
			});
			const data = await res.json();
			if (!res.ok) {
				return { success: false, error: data.error };
			}
			setMealSelections((prev) =>
				prev.map((sel) =>
					sel.id === data.id ? { ...sel, consumed: true } : sel
				)
			);
			return { success: true };
		} catch (error) {
			return { success: false, error: "An unexpected error occurred." };
		}
	};

	const addNotification = async (
		title: string,
		message: string
	): Promise<boolean> => {
		try {
			const res = await fetchApi("/api/notifications", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ title, message }),
			});
			if (res.ok) {
				const newNotification = await res.json();
				setNotifications((prev) => [newNotification, ...prev]);
				return true;
			}
			return false;
		} catch (error) {
			console.error("Failed to add notification:", error);
			return false;
		}
	};

	const deleteNotification = async (id: string): Promise<boolean> => {
		try {
			const res = await fetchApi(`/api/notifications/${id}`, {
				method: "DELETE",
			});
			if (res.ok) {
				setNotifications((prev) => prev.filter((n) => n.id !== id));
				return true;
			}
			return false;
		} catch (error) {
			console.error("Failed to delete notification:", error);
			return false;
		}
	};

	const addBill = async (fileName: string, month: string): Promise<boolean> => {
		try {
			const res = await fetchApi("/api/bills", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ fileName, month }),
			});
			if (res.ok) {
				const newBill = await res.json();
				setBills((prev) => [newBill, ...prev]);
				return true;
			}
			return false;
		} catch (error) {
			console.error("Failed to add bill:", error);
			return false;
		}
	};

	const deleteBill = async (id: string): Promise<boolean> => {
		try {
			const res = await fetchApi(`/api/bills/${id}`, { method: "DELETE" });
			if (res.ok) {
				setBills((prev) => prev.filter((b) => b.id !== id));
				return true;
			}
			return false;
		} catch (error) {
			console.error("Failed to delete bill:", error);
			return false;
		}
	};

	const addFeedback = async (
		subject: string,
		message: string
	): Promise<boolean> => {
		try {
			const res = await fetchApi("/api/feedback", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ subject, message }),
			});
			if (res.ok) {
				const newFeedback = await res.json();
				setFeedback((prev) => [newFeedback, ...prev]);
				return true;
			}
			return false;
		} catch (error) {
			console.error("Failed to add feedback:", error);
			return false;
		}
	};

	const value = {
		users,
		menu,
		updateMenuItem,
		mealSelections,
		addMealSelection,
		verifyToken,
		notifications,
		addNotification,
		deleteNotification,
		bills,
		addBill,
		deleteBill,
		feedback,
		addFeedback,
	};

	return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

// --- Custom Hook ---
export function useData() {
	const context = useContext(DataContext);
	if (context === undefined) {
		throw new Error("useData must be used within a DataProvider");
	}
	return context;
}
