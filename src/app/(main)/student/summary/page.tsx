"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-provider";
import { useData } from "@/contexts/data-provider";
import { Utensils, Banknote, ShoppingBasket } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const MEAL_PRICE = 35;

export default function MonthlySummaryPage() {
	const { user } = useAuth();
	const { mealSelections, addonConsumptions } = useData();
	const [currentDate, setCurrentDate] = useState<Date | null>(null);

	useEffect(() => {
		setCurrentDate(new Date());
	}, []);

	const summary = useMemo(() => {
		if (!currentDate || !user) {
			return {
				totalMeals: 0,
				baseMealCost: 0,
				totalAddons: 0,
				addonCost: 0,
				totalBill: 0,
			};
		}

		const year = currentDate.getFullYear().toString();
		const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
		const currentYearMonth = `${year}-${month}`;

		const monthlyMeals = mealSelections.filter((sel) => {
			if (!sel.date || !sel.consumed || sel.userId !== user.id) {
				return false;
			}
			const mealYearMonth = sel.date.substring(0, 7); // Extracts "YYYY-MM"
			return mealYearMonth === currentYearMonth;
		});

		const monthlyMealIds = new Set(monthlyMeals.map((m) => m.id));

		const monthlyAddons = addonConsumptions.filter((con) => {
			return (
				con.userId === user.id &&
				con.consumed &&
				monthlyMealIds.has(con.mealSelectionId)
			);
		});

		const totalMeals = monthlyMeals.reduce((acc, sel) => acc + sel.quantity, 0);
		const baseMealCost = totalMeals * MEAL_PRICE;
		const totalAddons = monthlyAddons.length;
		const addonCost = monthlyAddons.reduce(
			(acc, con) => acc + con.priceAtConsumption,
			0
		);
		const totalBill = baseMealCost + addonCost;

		return { totalMeals, baseMealCost, totalAddons, addonCost, totalBill };
	}, [currentDate, user, mealSelections, addonConsumptions]);

	if (!currentDate) {
		return (
			<div className="flex flex-col gap-6">
				<div className="text-center">
					<h1 className="text-2xl font-bold md:text-3xl lg:text-4xl">
						Monthly Summary
					</h1>
					<p className="text-muted-foreground">Loading your summary...</p>
				</div>
				<div className="grid gap-6 md:grid-cols-3">
					<Skeleton className="h-40" />
					<Skeleton className="h-40" />
					<Skeleton className="h-40" />
				</div>
			</div>
		);
	}

	const monthName = currentDate.toLocaleString("default", { month: "long" });

	return (
		<div className="flex flex-col gap-6">
			<div className="text-center">
				<h1 className="text-2xl font-bold md:text-3xl lg:text-4xl">
					Monthly Summary
				</h1>
				<p className="text-muted-foreground">
					Your meal consumption and estimated bill for {monthName}.
				</p>
			</div>
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Meals Consumed
						</CardTitle>
						<Utensils className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{summary.totalMeals}</div>
						<p className="text-xs text-muted-foreground">
							Base cost of ₹{summary.baseMealCost.toFixed(2)}
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Add-ons Consumed
						</CardTitle>
						<ShoppingBasket className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{summary.totalAddons}</div>
						<p className="text-xs text-muted-foreground">
							Total cost of ₹{summary.addonCost.toFixed(2)}
						</p>
					</CardContent>
				</Card>
				<Card className="md:col-span-2 lg:col-span-1 border-primary">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Estimated Bill
						</CardTitle>
						<Banknote className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							₹{summary.totalBill.toFixed(2)}
						</div>
						<p className="text-xs text-muted-foreground">
							For the month of {monthName}
						</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
