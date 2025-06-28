// "use client";

// import { useState, useEffect, useMemo } from "react";
// import {
// 	Table,
// 	TableBody,
// 	TableCell,
// 	TableHead,
// 	TableHeader,
// 	TableRow,
// } from "@/components/ui/table";
// import {
// 	Card,
// 	CardContent,
// 	CardHeader,
// 	CardTitle,
// 	CardDescription,
// } from "@/components/ui/card";
// import {
// 	Select,
// 	SelectContent,
// 	SelectItem,
// 	SelectTrigger,
// 	SelectValue,
// } from "@/components/ui/select";
// import { useData } from "@/contexts/data-provider";
// import { useAuth } from "@/contexts/auth-provider";
// import { Badge } from "@/components/ui/badge";
// import {
// 	CheckCircle,
// 	Calendar,
// 	User,
// 	KeyRound,
// 	Utensils,
// 	Banknote,
// } from "lucide-react";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Label } from "@/components/ui/label";
// import { hostelNames } from "@/lib/hostels";

// const superAdminHostelOptions = ["All Hostels", ...hostelNames];
// const MEAL_PRICE = 50;

// const getPastMonths = (count: number) => {
// 	const months = [];
// 	const today = new Date();
// 	for (let i = 0; i < count; i++) {
// 		const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
// 		months.push(
// 			d.toLocaleString("default", { month: "long", year: "numeric" })
// 		);
// 	}
// 	return months;
// };

// const availableMonths = getPastMonths(12);

// export default function AdminMealHistoryPage() {
// 	const { user } = useAuth();
// 	const { mealSelections, users } = useData();
// 	const [isClient, setIsClient] = useState(false);

// 	const [superAdminSelectedHostel, setSuperAdminSelectedHostel] =
// 		useState<string>(superAdminHostelOptions[0]);
// 	const [selectedMonth, setSelectedMonth] = useState<string>(() =>
// 		new Date().toLocaleString("default", { month: "long", year: "numeric" })
// 	);

// 	const hostelForFilter =
// 		user?.role === "superadmin" ? superAdminSelectedHostel : user?.hostel;

// 	useEffect(() => {
// 		setIsClient(true);
// 	}, []);

// 	const consumedMeals = useMemo(() => {
// 		return mealSelections
// 			.filter((sel) => sel.consumed)
// 			.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
// 	}, [mealSelections]);

// 	const filteredMeals = useMemo(() => {
// 		if (!selectedMonth || !hostelForFilter) return [];

// 		const hostelUsers = users.filter(
// 			(u) => hostelForFilter === "All Hostels" || u.hostel === hostelForFilter
// 		);
// 		const hostelUserIds = new Set(hostelUsers.map((u) => u.id));

// 		return consumedMeals.filter((meal) => {
// 			const mealMonth = new Date(meal.date).toLocaleString("default", {
// 				month: "long",
// 				year: "numeric",
// 			});
// 			return hostelUserIds.has(meal.userId) && mealMonth === selectedMonth;
// 		});
// 	}, [consumedMeals, users, hostelForFilter, selectedMonth]);

// 	const summary = useMemo(() => {
// 		const totalMeals = filteredMeals.length;
// 		const totalAmount = totalMeals * MEAL_PRICE;
// 		return { totalMeals, totalAmount };
// 	}, [filteredMeals]);

// 	const getUserName = (userId: string) =>
// 		users.find((u) => u.id === userId)?.name || "Unknown User";

// 	return (
// 		<div className="flex flex-col gap-6">
// 			<div className="text-center">
// 				<h1 className="text-2xl font-bold md:text-3xl lg:text-4xl">
// 					Meal History
// 				</h1>
// 				<p className="text-muted-foreground">
// 					Review consumed meals, filtered by hostel and month.
// 				</p>
// 			</div>

// 			<Card>
// 				<CardContent className="p-4 flex flex-col sm:flex-row gap-4">
// 					{user?.role === "superadmin" && (
// 						<div className="flex-1 space-y-2">
// 							<Label>Hostel</Label>
// 							<Select
// 								value={superAdminSelectedHostel}
// 								onValueChange={setSuperAdminSelectedHostel}
// 							>
// 								<SelectTrigger>
// 									<SelectValue placeholder="Select Hostel" />
// 								</SelectTrigger>
// 								<SelectContent>
// 									{superAdminHostelOptions.map((h) => (
// 										<SelectItem key={h} value={h}>
// 											{h}
// 										</SelectItem>
// 									))}
// 								</SelectContent>
// 							</Select>
// 						</div>
// 					)}
// 					<div className="flex-1 space-y-2">
// 						<Label>Month</Label>
// 						<Select value={selectedMonth} onValueChange={setSelectedMonth}>
// 							<SelectTrigger>
// 								<SelectValue placeholder="Select Month" />
// 							</SelectTrigger>
// 							<SelectContent>
// 								{availableMonths.map((m) => (
// 									<SelectItem key={m} value={m}>
// 										{m}
// 									</SelectItem>
// 								))}
// 							</SelectContent>
// 						</Select>
// 					</div>
// 				</CardContent>
// 			</Card>

// 			<div className="grid gap-6 md:grid-cols-2">
// 				<Card>
// 					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// 						<CardTitle className="text-sm font-medium">
// 							Total Meals Consumed
// 						</CardTitle>
// 						<Utensils className="h-4 w-4 text-muted-foreground" />
// 					</CardHeader>
// 					<CardContent>
// 						<div className="text-2xl font-bold">
// 							{isClient ? (
// 								summary.totalMeals
// 							) : (
// 								<Skeleton className="h-8 w-16" />
// 							)}
// 						</div>
// 						<p className="text-xs text-muted-foreground">
// 							in {selectedMonth} for {hostelForFilter}
// 						</p>
// 					</CardContent>
// 				</Card>
// 				<Card>
// 					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// 						<CardTitle className="text-sm font-medium">
// 							Estimated Revenue
// 						</CardTitle>
// 						<Banknote className="h-4 w-4 text-muted-foreground" />
// 					</CardHeader>
// 					<CardContent>
// 						<div className="text-2xl font-bold">
// 							₹
// 							{isClient ? (
// 								summary.totalAmount.toFixed(2)
// 							) : (
// 								<Skeleton className="h-8 w-24" />
// 							)}
// 						</div>
// 						<p className="text-xs text-muted-foreground">
// 							Based on ₹{MEAL_PRICE}/meal
// 						</p>
// 					</CardContent>
// 				</Card>
// 			</div>

// 			<Card>
// 				<CardHeader>
// 					<CardTitle>Detailed History</CardTitle>
// 					<CardDescription>
// 						A list of all consumed meals matching the current filters.
// 					</CardDescription>
// 				</CardHeader>
// 				<CardContent>
// 					<div className="hidden rounded-lg border md:block">
// 						<Table>
// 							<TableHeader>
// 								<TableRow>
// 									<TableHead>Date</TableHead>
// 									<TableHead>Student ID</TableHead>
// 									<TableHead>Student</TableHead>
// 									<TableHead>Meal Type</TableHead>
// 									<TableHead>Token</TableHead>
// 									<TableHead className="text-right">Status</TableHead>
// 								</TableRow>
// 							</TableHeader>
// 							<TableBody>
// 								{isClient && filteredMeals.length > 0 ? (
// 									filteredMeals.map((selection) => (
// 										<TableRow key={selection.id}>
// 											<TableCell>
// 												{new Date(selection.date).toLocaleDateString()}
// 											</TableCell>
// 											<TableCell className="font-mono">
// 												{selection.userId}
// 											</TableCell>
// 											<TableCell>{getUserName(selection.userId)}</TableCell>
// 											<TableCell>{selection.mealType}</TableCell>
// 											<TableCell className="font-mono">
// 												{selection.token}
// 											</TableCell>
// 											<TableCell className="text-right">
// 												<Badge className="bg-green-600 hover:bg-green-700">
// 													<CheckCircle className="h-4 w-4 mr-1" />
// 													Consumed
// 												</Badge>
// 											</TableCell>
// 										</TableRow>
// 									))
// 								) : (
// 									<TableRow>
// 										<TableCell colSpan={6} className="h-24 text-center">
// 											{isClient ? (
// 												`No consumed meals found for ${hostelForFilter} in ${selectedMonth}.`
// 											) : (
// 												<Skeleton className="h-5 w-full" />
// 											)}
// 										</TableCell>
// 									</TableRow>
// 								)}
// 							</TableBody>
// 						</Table>
// 					</div>

// 					<div className="space-y-4 md:hidden">
// 						{isClient && filteredMeals.length > 0 ? (
// 							filteredMeals.map((selection) => (
// 								<Card key={selection.id} className="border-l-4 border-primary">
// 									<CardHeader>
// 										<CardTitle className="flex items-center justify-between text-base">
// 											<span>{getUserName(selection.userId)}</span>
// 											<Badge className="bg-green-600 hover:bg-green-700">
// 												<CheckCircle className="mr-1 h-4 w-4" />
// 												Consumed
// 											</Badge>
// 										</CardTitle>
// 										<CardDescription className="flex items-center gap-2 pt-1">
// 											<User className="h-4 w-4" />
// 											ID: <span className="font-mono">{selection.userId}</span>
// 										</CardDescription>
// 									</CardHeader>
// 									<CardContent className="space-y-2">
// 										<div className="flex items-center gap-2 text-sm">
// 											<Calendar className="h-4 w-4 text-muted-foreground" />
// 											<span className="text-muted-foreground">{`${new Date(
// 												selection.date
// 											).toLocaleDateString()} • ${selection.mealType}`}</span>
// 										</div>
// 										<div className="flex items-center gap-2 text-sm">
// 											<KeyRound className="h-4 w-4 text-muted-foreground" />
// 											<span className="font-mono text-muted-foreground">
// 												{selection.token}
// 											</span>
// 										</div>
// 									</CardContent>
// 								</Card>
// 							))
// 						) : (
// 							<div className="p-10 text-center text-muted-foreground">
// 								{isClient ? (
// 									`No consumed meals found for ${hostelForFilter} in ${selectedMonth}.`
// 								) : (
// 									<Skeleton className="h-5 w-full" />
// 								)}
// 							</div>
// 						)}
// 					</div>
// 				</CardContent>
// 			</Card>
// 		</div>
// 	);
// }

"use client";

import { useState, useEffect, useMemo } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useData } from "@/contexts/data-provider";
import { useAuth } from "@/contexts/auth-provider";
import { Badge } from "@/components/ui/badge";
import {
	CheckCircle,
	Calendar,
	User,
	KeyRound,
	Utensils,
	Banknote,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { hostelNames } from "@/lib/hostels";

const superAdminHostelOptions = ["All Hostels", ...hostelNames];
const MEAL_PRICE = 50;

const getPastMonths = (count: number) => {
	const months = [];
	const today = new Date();
	for (let i = 0; i < count; i++) {
		const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
		months.push(
			d.toLocaleString("default", { month: "long", year: "numeric" })
		);
	}
	return months;
};

const availableMonths = getPastMonths(12);

export default function AdminMealHistoryPage() {
	const { user } = useAuth();
	const { mealSelections, users } = useData();
	const [isClient, setIsClient] = useState(false);

	const [superAdminSelectedHostel, setSuperAdminSelectedHostel] =
		useState<string>(superAdminHostelOptions[0]);
	const [selectedMonth, setSelectedMonth] = useState<string>(() =>
		new Date().toLocaleString("default", { month: "long", year: "numeric" })
	);

	const hostelForFilter =
		user?.role === "superadmin" ? superAdminSelectedHostel : user?.hostel;

	useEffect(() => {
		setIsClient(true);
	}, []);

	const consumedMeals = useMemo(() => {
		return mealSelections
			.filter((sel) => sel.consumed)
			.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
	}, [mealSelections]);

	const filteredMeals = useMemo(() => {
		if (!selectedMonth || !hostelForFilter) return [];

		const hostelUsers = users.filter(
			(u) => hostelForFilter === "All Hostels" || u.hostel === hostelForFilter
		);
		const hostelUserIds = new Set(hostelUsers.map((u) => u.id));

		return consumedMeals.filter((meal) => {
			const mealMonth = new Date(meal.date).toLocaleString("default", {
				month: "long",
				year: "numeric",
			});
			return hostelUserIds.has(meal.userId) && mealMonth === selectedMonth;
		});
	}, [consumedMeals, users, hostelForFilter, selectedMonth]);

	const summary = useMemo(() => {
		const totalMeals = filteredMeals.length;
		const totalAmount = totalMeals * MEAL_PRICE;
		return { totalMeals, totalAmount };
	}, [filteredMeals]);

	const getUser = (userId: string) => users.find((u) => u.id === userId);

	return (
		<div className="flex flex-col gap-6">
			<div className="text-center">
				<h1 className="text-2xl font-bold md:text-3xl lg:text-4xl">
					Meal History
				</h1>
				<p className="text-muted-foreground">
					Review consumed meals, filtered by hostel and month.
				</p>
			</div>

			<Card>
				<CardContent className="p-4 flex flex-col sm:flex-row gap-4">
					{user?.role === "superadmin" && (
						<div className="flex-1 space-y-2">
							<Label>Hostel</Label>
							<Select
								value={superAdminSelectedHostel}
								onValueChange={setSuperAdminSelectedHostel}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select Hostel" />
								</SelectTrigger>
								<SelectContent>
									{superAdminHostelOptions.map((h) => (
										<SelectItem key={h} value={h}>
											{h}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					)}
					<div className="flex-1 space-y-2">
						<Label>Month</Label>
						<Select value={selectedMonth} onValueChange={setSelectedMonth}>
							<SelectTrigger>
								<SelectValue placeholder="Select Month" />
							</SelectTrigger>
							<SelectContent>
								{availableMonths.map((m) => (
									<SelectItem key={m} value={m}>
										{m}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</CardContent>
			</Card>

			<div className="grid gap-6 md:grid-cols-2">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Meals Consumed
						</CardTitle>
						<Utensils className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{isClient ? (
								summary.totalMeals
							) : (
								<Skeleton className="h-8 w-16" />
							)}
						</div>
						<p className="text-xs text-muted-foreground">
							in {selectedMonth} for {hostelForFilter}
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Estimated Revenue
						</CardTitle>
						<Banknote className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							₹
							{isClient ? (
								summary.totalAmount.toFixed(2)
							) : (
								<Skeleton className="h-8 w-24" />
							)}
						</div>
						<p className="text-xs text-muted-foreground">
							Based on ₹{MEAL_PRICE}/meal
						</p>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Detailed History</CardTitle>
					<CardDescription>
						A list of all consumed meals matching the current filters.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="hidden rounded-lg border md:block">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Date</TableHead>
									<TableHead>Student ID</TableHead>
									<TableHead>Student</TableHead>
									<TableHead>Meal Type</TableHead>
									<TableHead>Token</TableHead>
									<TableHead className="text-right">Status</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{isClient && filteredMeals.length > 0 ? (
									filteredMeals.map((selection) => {
										const student = getUser(selection.userId);
										return (
											<TableRow key={selection.id}>
												<TableCell>
													{new Date(selection.date).toLocaleDateString()}
												</TableCell>
												<TableCell className="font-mono">
													{student?.displayId || "N/A"}
												</TableCell>
												<TableCell>{student?.name || "Unknown User"}</TableCell>
												<TableCell>{selection.mealType}</TableCell>
												<TableCell className="font-mono">
													{selection.token}
												</TableCell>
												<TableCell className="text-right">
													<Badge className="bg-green-600 hover:bg-green-700">
														<CheckCircle className="h-4 w-4 mr-1" />
														Consumed
													</Badge>
												</TableCell>
											</TableRow>
										);
									})
								) : (
									<TableRow>
										<TableCell colSpan={6} className="h-24 text-center">
											{isClient ? (
												`No consumed meals found for ${hostelForFilter} in ${selectedMonth}.`
											) : (
												<Skeleton className="h-5 w-full" />
											)}
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>

					<div className="space-y-4 md:hidden">
						{isClient && filteredMeals.length > 0 ? (
							filteredMeals.map((selection) => {
								const student = getUser(selection.userId);
								return (
									<Card
										key={selection.id}
										className="border-l-4 border-primary"
									>
										<CardHeader>
											<CardTitle className="flex items-center justify-between text-base">
												<span>{student?.name || "Unknown User"}</span>
												<Badge className="bg-green-600 hover:bg-green-700">
													<CheckCircle className="mr-1 h-4 w-4" />
													Consumed
												</Badge>
											</CardTitle>
											<CardDescription className="flex items-center gap-2 pt-1">
												<User className="h-4 w-4" />
												ID:{" "}
												<span className="font-mono">
													{student?.displayId || "N/A"}
												</span>
											</CardDescription>
										</CardHeader>
										<CardContent className="space-y-2">
											<div className="flex items-center gap-2 text-sm">
												<Calendar className="h-4 w-4 text-muted-foreground" />
												<span className="text-muted-foreground">{`${new Date(
													selection.date
												).toLocaleDateString()} • ${selection.mealType}`}</span>
											</div>
											<div className="flex items-center gap-2 text-sm">
												<KeyRound className="h-4 w-4 text-muted-foreground" />
												<span className="font-mono text-muted-foreground">
													{selection.token}
												</span>
											</div>
										</CardContent>
									</Card>
								);
							})
						) : (
							<div className="p-10 text-center text-muted-foreground">
								{isClient ? (
									`No consumed meals found for ${hostelForFilter} in ${selectedMonth}.`
								) : (
									<Skeleton className="h-5 w-full" />
								)}
							</div>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
