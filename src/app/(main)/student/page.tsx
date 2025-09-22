"use client";

import { useState, useEffect } from "react";
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useData } from "@/contexts/data-provider";
import { useAuth } from "@/contexts/auth-provider";
import type { MealType, MealSelection, Addon, MenuItem } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Coffee,
	Sun,
	Moon,
	Loader2,
	PlusCircle,
	CheckCircle,
	Zap,
	Plus,
	Minus,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const mealOptions: { mealType: MealType; icon: React.ElementType }[] = [
	{ mealType: "Breakfast", icon: Coffee },
	{ mealType: "Lunch", icon: Sun },
	{ mealType: "Dinner", icon: Moon },
];

const MealRow = ({
	mealType,
	icon: Icon,
	menuItem,
	isGenerating,
	onSelect,
}: {
	mealType: MealType;
	icon: React.ElementType;
	menuItem: MenuItem | undefined;
	isGenerating: MealType | null;
	onSelect: (mealType: MealType) => void;
}) => {
	const isLoading = isGenerating === mealType;
	const isAvailable = menuItem?.available;

	if (!menuItem) {
		return (
			<div className="flex flex-col md:flex-row items-center justify-between p-4 md:p-6 gap-4">
				<div className="flex items-center gap-4 w-full md:w-auto">
					<Skeleton className="h-8 w-8 rounded-md" />
					<div className="flex-grow space-y-2">
						<Skeleton className="h-5 w-24" />
						<Skeleton className="h-4 w-48" />
					</div>
				</div>
				<Skeleton className="h-10 w-full md:w-36" />
			</div>
		);
	}

	return (
		<div className="flex flex-col md:flex-row items-center justify-between p-4 md:p-6 gap-4">
			<div className="flex items-center gap-4 w-full md:w-auto">
				<Icon className="h-8 w-8 text-primary shrink-0" />
				<div className="flex-grow">
					<h3 className="text-lg font-semibold">{mealType}</h3>
					<p
						className={cn(
							"text-sm",
							isAvailable
								? "text-muted-foreground"
								: "text-destructive font-medium"
						)}
					>
						{menuItem.item || "Not Available"}
					</p>
				</div>
			</div>
			<Button
				className="w-full md:w-auto shrink-0"
				onClick={() => onSelect(mealType)}
				disabled={!isAvailable || !!isGenerating}
			>
				{isLoading ? (
					<Loader2 className="mr-2 h-4 w-4 animate-spin" />
				) : (
					<Zap className="mr-2 h-4 w-4" />
				)}
				{isLoading ? "Generating..." : "Get Token"}
			</Button>
		</div>
	);
};

export default function StudentDashboard() {
	const { user } = useAuth();
	const {
		addMealSelection,
		menu,
		addons,
		addAddonConsumption,
		addonConsumptions,
	} = useData();
	const { toast } = useToast();

	const [showTokenDialog, setShowTokenDialog] = useState(false);
	const [activeSelection, setActiveSelection] = useState<MealSelection | null>(
		null
	);
	const [addedAddonIds, setAddedAddonIds] = useState<Set<string>>(new Set());

	const [today, setToday] = useState<string | null>(null);
	const [dayOfWeek, setDayOfWeek] = useState<keyof typeof menu | null>(null);
	const [dayOfWeekName, setDayOfWeekName] = useState<string>("");
	const [isGenerating, setIsGenerating] = useState<MealType | null>(null);
	const [isAddingAddon, setIsAddingAddon] = useState<string | null>(null);

	const [configuringMeal, setConfiguringMeal] = useState<MealType | null>(null);
	const [quantity, setQuantity] = useState(1);

	useEffect(() => {
		const now = new Date();
		setToday(now.toISOString().split("T")[0]);
		const day = now.toLocaleDateString("en-US", {
			weekday: "long",
		}) as keyof typeof menu;
		setDayOfWeek(day);
		setDayOfWeekName(day);
	}, []);

	useEffect(() => {
		if (activeSelection) {
			const existingAddonsForSelection = new Set(
				addonConsumptions
					.filter((ac) => ac.mealSelectionId === activeSelection.id)
					.map((ac) => ac.addonId)
			);
			setAddedAddonIds(existingAddonsForSelection);
		} else {
			setAddedAddonIds(new Set());
		}
	}, [activeSelection, addonConsumptions]);

	const handleMealSelection = (mealType: MealType) => {
		if (!user || !today || !dayOfWeek) return;

		if (!menu[dayOfWeek]?.[mealType]?.available) {
			toast({
				variant: "destructive",
				title: "Meal Unavailable",
				description: `${mealType} is not available today.`,
			});
			return;
		}

		setQuantity(1);
		setConfiguringMeal(mealType);
	};

	const handleConfirmSelection = async () => {
		if (!user || !today || !configuringMeal) return;

		setIsGenerating(configuringMeal);

		const result = await addMealSelection(
			user.id,
			configuringMeal,
			today,
			quantity
		);

		if (result.success && result.selection) {
			setActiveSelection(result.selection);
			setShowTokenDialog(true);
		} else {
			toast({
				variant: "destructive",
				title: "Selection Failed",
				description:
					result.error ||
					`You have already selected ${configuringMeal} for today.`,
			});
		}

		setIsGenerating(null);
		setConfiguringMeal(null);
	};

	const handleAddonSelection = async (addon: Addon) => {
		if (!activeSelection) return;
		setIsAddingAddon(addon.id);
		const result = await addAddonConsumption(addon.id, activeSelection.id);
		if (result) {
			toast({
				title: "Add-on Added",
				description: `${addon.name} has been added to your meal.`,
			});
			setAddedAddonIds((prev) => new Set(prev).add(addon.id));
		} else {
			toast({
				variant: "destructive",
				title: "Failed to Add",
				description: `Could not add ${addon.name}. Please try again.`,
			});
		}
		setIsAddingAddon(null);
	};

	return (
		<div className="flex flex-col gap-8">
			<div className="text-center">
				<h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
					Today's Menu
				</h1>
				<p className="text-muted-foreground md:text-xl">
					Hello {user?.name.split(" ")[0]}! Here's what's available for{" "}
					{dayOfWeekName}.
				</p>
			</div>

			<Card className="w-full">
				<CardHeader>
					<CardTitle>Select Your Meal</CardTitle>
					<CardDescription>
						Choose from the available options below to generate your unique meal
						token.
					</CardDescription>
				</CardHeader>
				<CardContent className="p-0">
					<div className="divide-y divide-border">
						{mealOptions.map(({ mealType, icon }) => (
							<MealRow
								key={mealType}
								mealType={mealType}
								icon={icon}
								menuItem={dayOfWeek ? menu[dayOfWeek]?.[mealType] : undefined}
								isGenerating={isGenerating}
								onSelect={handleMealSelection}
							/>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Quantity Selection Dialog */}
			<Dialog
				open={!!configuringMeal}
				onOpenChange={(isOpen) => !isOpen && setConfiguringMeal(null)}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Select Quantity for {configuringMeal}</DialogTitle>
						<DialogDescription>
							How many meals would you like to get a token for?
						</DialogDescription>
					</DialogHeader>
					<div className="flex items-center justify-center gap-4 py-4">
						<Button
							variant="outline"
							size="icon"
							onClick={() => setQuantity((q) => Math.max(1, q - 1))}
						>
							<Minus className="h-4 w-4" />
						</Button>
						<span className="text-2xl font-bold w-12 text-center">
							{quantity}
						</span>
						<Button
							variant="outline"
							size="icon"
							onClick={() => setQuantity((q) => Math.min(10, q + 1))}
						>
							<Plus className="h-4 w-4" />
						</Button>
					</div>
					<DialogFooter>
						<Button variant="ghost" onClick={() => setConfiguringMeal(null)}>
							Cancel
						</Button>
						<Button
							onClick={handleConfirmSelection}
							disabled={isGenerating === configuringMeal}
						>
							{isGenerating === configuringMeal && (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							)}
							Generate Token
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Token Display Dialog */}
			<Dialog open={showTokenDialog} onOpenChange={setShowTokenDialog}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Your Meal Token</DialogTitle>
						<DialogDescription>
							Show this token at the counter. You can also add extras to your
							meal.
						</DialogDescription>
					</DialogHeader>
					<div className="my-4 flex items-center justify-center bg-muted p-4 rounded-md">
						<p className="text-4xl font-bold tracking-widest text-primary">
							{activeSelection?.token}
						</p>
					</div>

					<Separator />

					<div className="pt-2">
						<h3 className="text-lg font-semibold mb-2">Add Extras</h3>
						<div className="space-y-2 max-h-48 overflow-y-auto">
							{addons
								.filter((a) => a.available)
								.map((addon) => {
									const isAdded = addedAddonIds.has(addon.id);
									return (
										<div
											key={addon.id}
											className="flex items-center justify-between p-2 rounded-md border"
										>
											<div>
												<p className="font-medium">{addon.name}</p>
												<p className="text-sm text-muted-foreground">
													₹{addon.price.toFixed(2)}
												</p>
											</div>
											<Button
												size="sm"
												variant={isAdded ? "secondary" : "outline"}
												onClick={() => !isAdded && handleAddonSelection(addon)}
												disabled={!!isAddingAddon || isAdded}
											>
												{isAddingAddon === addon.id ? (
													<Loader2 className="h-4 w-4 animate-spin" />
												) : isAdded ? (
													<>
														<CheckCircle className="mr-2 h-4 w-4 text-green-600" />
														Added
													</>
												) : (
													<>
														<PlusCircle className="mr-2 h-4 w-4" />
														Add
													</>
												)}
											</Button>
										</div>
									);
								})}
						</div>
					</div>

					<DialogFooter>
						<Button onClick={() => setShowTokenDialog(false)}>Done</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
