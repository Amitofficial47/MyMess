"use client";

import React, {
	createContext,
	useContext,
	ReactNode,
	useState,
	useEffect,
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
import { generateToken } from "@/lib/utils";
import { useAuth } from "./auth-provider";

// This context will now primarily handle frontend-simulated data that hasn't been migrated to the backend.
// User data is now fetched via the AuthProvider and API routes.

// --- Initial Data ---
// This data is used if localStorage is empty.
const initialMenu: WeeklyMenu = {
	Monday: {
		Breakfast: { item: "Poha, Jalebi", available: true },
		Lunch: { item: "Rajma, Rice, Roti", available: true },
		Dinner: { item: "Aloo Gobi, Roti", available: true },
	},
	Tuesday: {
		Breakfast: { item: "Idli, Sambar", available: true },
		Lunch: { item: "Chole Bhature", available: true },
		Dinner: { item: "Paneer Butter Masala, Roti", available: true },
	},
	Wednesday: {
		Breakfast: { item: "Aloo Paratha, Curd", available: true },
		Lunch: { item: "Kadhi Pakoda, Rice", available: true },
		Dinner: { item: "Mix Veg, Dal, Roti", available: true },
	},
	Thursday: {
		Breakfast: { item: "Upma, Coconut Chutney", available: true },
		Lunch: { item: "Dal Makhani, Naan", available: true },
		Dinner: { item: "Bhindi Masala, Roti", available: true },
	},
	Friday: {
		Breakfast: { item: "Dosa, Sambar", available: true },
		Lunch: { item: "Veg Biryani, Raita", available: true },
		Dinner: { item: "Malai Kofta, Roti", available: true },
	},
	Saturday: {
		Breakfast: { item: "Masala Oats", available: true },
		Lunch: { item: "Special Thali", available: true },
		Dinner: { item: "Pasta", available: true },
	},
	Sunday: {
		Breakfast: { item: "Puri Sabji", available: true },
		Lunch: { item: "Paneer Tikka, Rice", available: true },
		Dinner: { item: "Closed", available: false },
	},
};

// --- Context Definition ---
interface DataContextProps {
	users: Omit<User, "password" | "email">[];
	menu: WeeklyMenu;
	setMenu: (menu: WeeklyMenu) => void;
	updateMenuItem: (
		day: DayOfWeek,
		mealType: MealType,
		menuItem: MenuItem
	) => void;
	mealSelections: MealSelection[];
	addMealSelection: (
		userId: string,
		mealType: MealType,
		date: string
	) => MealSelection | null;
	verifyToken: (token: string) => boolean;
	notifications: Notification[];
	addNotification: (title: string, message: string) => void;
	deleteNotification: (id: string) => void;
	bills: Bill[];
	addBill: (fileName: string, month: string) => void;
	deleteBill: (id: string) => void;
	feedback: Feedback[];
	addFeedback: (
		userId: string,
		userName: string,
		subject: string,
		message: string
	) => void;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

// A separate hook for managing localStorage to keep the provider clean.
function usePersistentState<T>(
	key: string,
	initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
	const [state, setState] = useState<T>(() => {
		if (typeof window === "undefined") {
			return initialValue;
		}
		try {
			const item = window.localStorage.getItem(key);
			return item ? JSON.parse(item) : initialValue;
		} catch (error) {
			console.warn(`Error reading localStorage key “${key}”:`, error);
			return initialValue;
		}
	});

	const setWithPersistence = (value: React.SetStateAction<T>) => {
		try {
			const valueToStore = value instanceof Function ? value(state) : value;
			setState(valueToStore);
			if (typeof window !== "undefined") {
				window.localStorage.setItem(key, JSON.stringify(valueToStore));
			}
		} catch (error) {
			console.error(`Error writing to localStorage key “${key}”:`, error);
		}
	};

	return [state, setWithPersistence];
}

// --- Provider Component ---
export function DataProvider({ children }: { children: ReactNode }) {
	const { user } = useAuth();
	const [users, setUsers] = useState<Omit<User, "password" | "email">[]>([]);

	// Fetch all users if the current user is an admin for display purposes (e.g., history page)
	useEffect(() => {
		const fetchUsers = async () => {
			if (user?.role === "admin" || user?.role === "superadmin") {
				try {
					const res = await fetch("/api/users");
					if (res.ok) {
						const data = await res.json();
						setUsers(data);
					} else {
						console.error("Failed to fetch users");
						setUsers([]);
					}
				} catch (error) {
					console.error("Error fetching users:", error);
					setUsers([]);
				}
			} else {
				setUsers([]);
			}
		};
		fetchUsers();
	}, [user]);

	// The rest of the data remains on localStorage for simulation purposes.
	// Note: These should be migrated to a database for a real application.
	const [menu, setMenu] = usePersistentState<WeeklyMenu>(
		"messmate-menu",
		initialMenu
	);
	const [mealSelections, setMealSelections] = usePersistentState<
		MealSelection[]
	>("messmate-meals", []);
	const [notifications, setNotifications] = usePersistentState<Notification[]>(
		"messmate-notifications",
		[]
	);
	const [bills, setBills] = usePersistentState<Bill[]>("messmate-bills", []);
	const [feedback, setFeedback] = usePersistentState<Feedback[]>(
		"messmate-feedback",
		[]
	);

	const updateMenuItem = (
		day: DayOfWeek,
		mealType: MealType,
		menuItem: MenuItem
	) => {
		setMenu((prevMenu) => ({
			...prevMenu,
			[day]: { ...prevMenu[day], [mealType]: menuItem },
		}));
	};

	const addMealSelection = (
		userId: string,
		mealType: MealType,
		date: string
	): MealSelection | null => {
		const existingSelection = mealSelections.find(
			(sel) =>
				sel.userId === userId && sel.date === date && sel.mealType === mealType
		);
		if (existingSelection) {
			return null;
		}
		const newSelection: MealSelection = {
			id: crypto.randomUUID(),
			userId,
			date,
			mealType,
			token: generateToken(),
			consumed: false,
		};
		setMealSelections((prev) => [...prev, newSelection]);
		return newSelection;
	};

	const verifyToken = (token: string): boolean => {
		const selectionIndex = mealSelections.findIndex(
			(sel) => sel.token.toLowerCase() === token.toLowerCase() && !sel.consumed
		);
		if (selectionIndex > -1) {
			const newSelections = [...mealSelections];
			newSelections[selectionIndex].consumed = true;
			setMealSelections(newSelections);
			return true;
		}
		return false;
	};

	const addNotification = (title: string, message: string) => {
		const newNotification: Notification = {
			id: crypto.randomUUID(),
			title,
			message,
			timestamp: new Date().toISOString(),
		};
		setNotifications((prev) => [newNotification, ...prev]);
	};

	const deleteNotification = (id: string) => {
		setNotifications((prev) => prev.filter((n) => n.id !== id));
	};

	const addBill = (fileName: string, month: string) => {
		const newBill: Bill = {
			id: crypto.randomUUID(),
			fileName,
			month,
			uploadDate: new Date().toISOString(),
		};
		setBills((prev) => [newBill, ...prev]);
	};

	const deleteBill = (id: string) => {
		setBills((prev) => prev.filter((b) => b.id !== id));
	};

	const addFeedback = (
		userId: string,
		userName: string,
		subject: string,
		message: string
	) => {
		const newFeedback: Feedback = {
			id: crypto.randomUUID(),
			userId,
			userName,
			subject,
			message,
			timestamp: new Date().toISOString(),
		};
		setFeedback((prev) => [newFeedback, ...prev]);
	};

	const value = {
		users,
		menu,
		setMenu,
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
