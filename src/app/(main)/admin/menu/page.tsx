"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useData } from "@/contexts/data-provider";
import type { DayOfWeek, MealType, MenuItem, WeeklyMenu } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

const days: DayOfWeek[] = [
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
	"Sunday",
];

export default function AdminMenuPage() {
	const { menu, updateMenuItem } = useData();
	const { toast } = useToast();
	const [editedMenu, setEditedMenu] = useState<WeeklyMenu>(menu);
	const [selectedDay, setSelectedDay] = useState<DayOfWeek>("Monday");
	const [isSaving, setIsSaving] = useState(false);
	const isMobile = useIsMobile();

	useEffect(() => {
		const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
		if (days.includes(today as DayOfWeek)) {
			setSelectedDay(today as DayOfWeek);
		}
	}, []);

	useEffect(() => {
		setEditedMenu(menu);
	}, [menu]);

	const handleItemChange = (
		day: DayOfWeek,
		mealType: MealType,
		field: keyof Omit<MenuItem, "id" | "dayOfWeek" | "mealType">,
		value: string | boolean
	) => {
		setEditedMenu((prev) => {
			const newMenu = JSON.parse(JSON.stringify(prev)); // Deep copy
			if (newMenu[day]?.[mealType]) {
				(newMenu[day][mealType] as any)[field] = value;
			}
			return newMenu;
		});
	};

	const handleSaveDay = async (day: DayOfWeek) => {
		setIsSaving(true);
		const dayMenu = editedMenu[day];
		if (!dayMenu) return;

		const breakfastPromise = updateMenuItem(
			day,
			"Breakfast",
			dayMenu.Breakfast
		);
		const lunchPromise = updateMenuItem(day, "Lunch", dayMenu.Lunch);
		const dinnerPromise = updateMenuItem(day, "Dinner", dayMenu.Dinner);

		const results = await Promise.all([
			breakfastPromise,
			lunchPromise,
			dinnerPromise,
		]);

		if (results.every(Boolean)) {
			toast({
				title: "Menu Saved",
				description: `Menu for ${day} has been updated.`,
			});
		} else {
			toast({
				variant: "destructive",
				title: "Save Failed",
				description: `Could not update menu for ${day}.`,
			});
		}
		setIsSaving(false);
	};

	if (isMobile === undefined || Object.keys(menu).length === 0) {
		return (
			<div className="flex flex-col gap-6">
				<div className="text-center">
					<h1 className="text-2xl font-bold md:text-3xl lg:text-4xl">
						Edit Weekly Menu
					</h1>
					<p className="text-muted-foreground">
						Update meal items and availability for each day.
					</p>
				</div>
				<Skeleton className="h-12 w-full" />
				<Skeleton className="h-96 w-full" />
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6">
			<div className="text-center">
				<h1 className="text-2xl font-bold md:text-3xl lg:text-4xl">
					Edit Weekly Menu
				</h1>
				<p className="text-muted-foreground">
					Update meal items and availability for each day.
				</p>
			</div>

			{isMobile ? (
				<Select
					value={selectedDay}
					onValueChange={(day) => setSelectedDay(day as DayOfWeek)}
				>
					<SelectTrigger>
						<span className="flex-1 text-center">
							<SelectValue placeholder="Select a day" />
						</span>
					</SelectTrigger>
					<SelectContent>
						{days.map((day) => (
							<SelectItem key={day} value={day} className="justify-center">
								{day}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			) : (
				<Tabs
					value={selectedDay}
					onValueChange={(day) => setSelectedDay(day as DayOfWeek)}
					className="w-full"
				>
					<TabsList className="grid w-full grid-cols-7">
						{days.map((day) => (
							<TabsTrigger key={day} value={day}>
								{day}
							</TabsTrigger>
						))}
					</TabsList>
				</Tabs>
			)}

			{editedMenu[selectedDay] && (
				<div className="mt-2">
					<Card>
						<CardHeader>
							<CardTitle className="flex justify-between items-center text-xl md:text-2xl">
								<span>{selectedDay}'s Menu</span>
								<Button
									onClick={() => handleSaveDay(selectedDay)}
									disabled={isSaving}
								>
									{isSaving && (
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									)}
									Save Changes
								</Button>
							</CardTitle>
						</CardHeader>
						<CardContent className="grid gap-6 md:grid-cols-3">
							<MealEditForm
								mealType="Breakfast"
								menuItem={editedMenu[selectedDay].Breakfast}
								onChange={(field, value) =>
									handleItemChange(selectedDay, "Breakfast", field, value)
								}
							/>
							<MealEditForm
								mealType="Lunch"
								menuItem={editedMenu[selectedDay].Lunch}
								onChange={(field, value) =>
									handleItemChange(selectedDay, "Lunch", field, value)
								}
							/>
							<MealEditForm
								mealType="Dinner"
								menuItem={editedMenu[selectedDay].Dinner}
								onChange={(field, value) =>
									handleItemChange(selectedDay, "Dinner", field, value)
								}
							/>
						</CardContent>
					</Card>
				</div>
			)}
		</div>
	);
}

interface MealEditFormProps {
	mealType: MealType;
	menuItem: MenuItem;
	onChange: (
		field: keyof Omit<MenuItem, "id" | "dayOfWeek" | "mealType">,
		value: string | boolean
	) => void;
}

function MealEditForm({ mealType, menuItem, onChange }: MealEditFormProps) {
	return (
		<div className="space-y-4 rounded-lg border p-4">
			<h3 className="text-lg font-semibold">{mealType}</h3>
			<div className="space-y-2">
				<Label htmlFor={`${mealType}-item`}>Meal Items</Label>
				<Input
					id={`${mealType}-item`}
					value={menuItem?.item || ""}
					onChange={(e) => onChange("item", e.target.value)}
				/>
			</div>
			<div className="space-y-2">
				<Label htmlFor={`${mealType}-notes`}>Notes (optional)</Label>
				<Input
					id={`${mealType}-notes`}
					value={menuItem?.notes || ""}
					onChange={(e) => onChange("notes", e.target.value)}
				/>
			</div>
			<div className="flex items-center space-x-2">
				<Switch
					id={`${mealType}-available`}
					checked={menuItem?.available ?? false}
					onCheckedChange={(checked) => onChange("available", checked)}
				/>
				<Label htmlFor={`${mealType}-available`}>Available</Label>
			</div>
		</div>
	);
}
