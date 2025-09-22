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
	Addon,
	AddonConsumption,
} from "@/lib/types";
import { useAuth } from "./auth-provider";
import { fetchApi } from "@/lib/api";

interface VerifiedMealData {
	meal: MealSelection & { studentName: string };
	addons: { name: string; quantity: number; price: number }[];
}

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
		date: string,
		quantity: number
	) => Promise<{ success: boolean; selection?: MealSelection; error?: string }>;
	verifyToken: (
		token: string
	) => Promise<{ success: boolean; error?: string; data?: VerifiedMealData }>;
	notifications: Notification[];
	addNotification: (title: string, message: string) => Promise<boolean>;
	deleteNotification: (id: string) => Promise<boolean>;
	bills: Bill[];
	addBill: (fileName: string, month: string) => Promise<boolean>;
	deleteBill: (id: string) => Promise<boolean>;
	feedback: Feedback[];
	addFeedback: (subject: string, message: string) => Promise<boolean>;
	addons: Addon[];
	addAddon: (name: string, price: number) => Promise<Addon | null>;
	updateAddon: (id: string, data: Partial<Addon>) => Promise<Addon | null>;
	deleteAddon: (id: string) => Promise<boolean>;
	addonConsumptions: AddonConsumption[];
	addAddonConsumption: (
		addonId: string,
		mealSelectionId: string
	) => Promise<AddonConsumption | null>;
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
	const [addons, setAddons] = useState<Addon[]>([]);
	const [addonConsumptions, setAddonConsumptions] = useState<
		AddonConsumption[]
	>([]);

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
				addonsRes,
				addonConsumptionsRes,
			] = await Promise.all([
				fetchApi("/api/users"),
				fetchApi("/api/meal-selections"),
				fetchApi("/api/menu"),
				fetchApi("/api/notifications"),
				fetchApi("/api/bills"),
				fetchApi("/api/feedback"),
				fetchApi("/api/addons"),
				fetchApi("/api/addon-consumptions"),
			]);

			if (usersRes.ok) setUsers(await usersRes.json());
			if (selectionsRes.ok) setMealSelections(await selectionsRes.json());
			if (notificationsRes.ok) setNotifications(await notificationsRes.json());
			if (billsRes.ok) setBills(await billsRes.json());
			if (feedbackRes.ok) setFeedback(await feedbackRes.json());
			if (addonsRes.ok) setAddons(await addonsRes.json());
			if (addonConsumptionsRes.ok)
				setAddonConsumptions(await addonConsumptionsRes.json());

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
		date: string,
		quantity: number
	): Promise<{
		success: boolean;
		selection?: MealSelection;
		error?: string;
	}> => {
		try {
			const res = await fetchApi("/api/meal-selections", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ mealType, date, quantity }),
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
	): Promise<{ success: boolean; error?: string; data?: VerifiedMealData }> => {
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

			// Update local state for meal selection
			setMealSelections((prev) =>
				prev.map((sel) =>
					sel.id === data.meal.id ? { ...sel, consumed: true } : sel
				)
			);

			// Update local state for addon consumptions
			const verifiedMealSelectionId = data.meal.id;
			setAddonConsumptions((prev) =>
				prev.map((ac) =>
					ac.mealSelectionId === verifiedMealSelectionId
						? { ...ac, consumed: true }
						: ac
				)
			);

			return { success: true, data };
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

	const addAddon = async (
		name: string,
		price: number
	): Promise<Addon | null> => {
		try {
			const res = await fetchApi("/api/addons", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name, price }),
			});
			if (res.ok) {
				const newAddon = await res.json();
				setAddons((prev) =>
					[...prev, newAddon].sort((a, b) => a.name.localeCompare(b.name))
				);
				return newAddon;
			}
			return null;
		} catch (error) {
			console.error("Failed to add addon:", error);
			return null;
		}
	};

	const updateAddon = async (
		id: string,
		data: Partial<Addon>
	): Promise<Addon | null> => {
		try {
			const res = await fetchApi(`/api/addons/${id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
			if (res.ok) {
				const updatedAddon = await res.json();
				setAddons((prev) => prev.map((a) => (a.id === id ? updatedAddon : a)));
				return updatedAddon;
			}
			return null;
		} catch (error) {
			console.error("Failed to update addon:", error);
			return null;
		}
	};

	const deleteAddon = async (id: string): Promise<boolean> => {
		try {
			const res = await fetchApi(`/api/addons/${id}`, { method: "DELETE" });
			if (res.ok) {
				setAddons((prev) => prev.filter((a) => a.id !== id));
				return true;
			}
			return false;
		} catch (error) {
			console.error("Failed to delete addon:", error);
			return false;
		}
	};

	const addAddonConsumption = async (
		addonId: string,
		mealSelectionId: string
	): Promise<AddonConsumption | null> => {
		try {
			const res = await fetchApi("/api/addon-consumptions", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ addonId, mealSelectionId }),
			});
			if (res.ok) {
				const newConsumption = await res.json();
				setAddonConsumptions((prev) => [...prev, newConsumption]);
				return newConsumption;
			}
			return null;
		} catch (error) {
			console.error("Failed to add addon consumption:", error);
			return null;
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
		addons,
		addAddon,
		updateAddon,
		deleteAddon,
		addonConsumptions,
		addAddonConsumption,
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
