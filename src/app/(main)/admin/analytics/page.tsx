"use client";

import { useEffect, useState } from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	XAxis,
	Pie,
	PieChart,
	Cell,
} from "recharts";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { useAuth } from "@/contexts/auth-provider";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { fetchApi } from "@/lib/api";
import { hostelNames } from "@/lib/hostels";

const superAdminHostelOptions = ["All Hostels", ...hostelNames];
const COLORS = ["#16a34a", "#6ee7b7", "#a7f3d0"];

interface DailyData {
	date: string;
	total: number;
}

interface MealTypeData {
	name: string;
	value: number;
	fill: string;
}

interface AnalyticsData {
	dailyConsumption: DailyData[];
	mealTypeDistribution: MealTypeData[];
	totalMeals: number;
}

export default function AnalyticsPage() {
	const { user } = useAuth();
	const [data, setData] = useState<AnalyticsData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [hostelFilter, setHostelFilter] = useState(superAdminHostelOptions[0]);

	useEffect(() => {
		async function fetchData() {
			setIsLoading(true);
			const query = new URLSearchParams();
			if (user?.role === "superadmin" && hostelFilter !== "All Hostels") {
				query.append("hostel", hostelFilter);
			}

			try {
				const res = await fetchApi(`/api/analytics?${query.toString()}`);
				if (res.ok) {
					const analyticsData = await res.json();
					setData(analyticsData);
				} else {
					console.error("Failed to fetch analytics");
					setData(null);
				}
			} catch (error) {
				console.error("Error fetching analytics", error);
				setData(null);
			} finally {
				setIsLoading(false);
			}
		}
		fetchData();
	}, [user?.role, hostelFilter]);

	return (
		<div className="flex flex-col gap-6">
			<div className="text-center">
				<h1 className="text-2xl font-bold md:text-3xl lg:text-4xl">
					Analytics Dashboard
				</h1>
				<p className="text-muted-foreground">
					Visualize meal consumption trends and data.
				</p>
			</div>

			{user?.role === "superadmin" && (
				<Card>
					<CardHeader>
						<CardTitle>Filters</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid gap-2 md:w-1/3">
							<Label htmlFor="hostel-filter">Hostel</Label>
							<Select value={hostelFilter} onValueChange={setHostelFilter}>
								<SelectTrigger id="hostel-filter">
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
					</CardContent>
				</Card>
			)}

			{isLoading ? (
				<div className="flex items-center justify-center p-10">
					<Loader2 className="h-8 w-8 animate-spin text-primary" />
				</div>
			) : !data ? (
				<Card>
					<CardContent className="p-10 text-center text-muted-foreground">
						Could not load analytics data. Please try again later.
					</CardContent>
				</Card>
			) : (
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
					<Card className="lg:col-span-4">
						<CardHeader>
							<CardTitle>Daily Consumption - Last 30 Days</CardTitle>
							<CardDescription>Total meals consumed per day.</CardDescription>
						</CardHeader>
						<CardContent>
							<ChartContainer config={{}}>
								<BarChart data={data.dailyConsumption} accessibilityLayer>
									<CartesianGrid vertical={false} />
									<XAxis
										dataKey="date"
										tickLine={false}
										axisLine={false}
										tickMargin={8}
										tickFormatter={(value) =>
											new Date(value).toLocaleDateString("en-US", {
												day: "numeric",
												month: "short",
											})
										}
									/>
									<ChartTooltip content={<ChartTooltipContent />} />
									<Bar dataKey="total" fill="var(--color-primary)" radius={4} />
								</BarChart>
							</ChartContainer>
						</CardContent>
					</Card>

					<Card className="lg:col-span-3">
						<CardHeader>
							<CardTitle>Meal Type Distribution</CardTitle>
							<CardDescription>Total meals: {data.totalMeals}</CardDescription>
						</CardHeader>
						<CardContent className="flex items-center justify-center">
							<ChartContainer
								config={{}}
								className="mx-auto aspect-square h-[250px]"
							>
								<PieChart>
									<ChartTooltip
										content={<ChartTooltipContent nameKey="name" />}
									/>
									<Pie
										data={data.mealTypeDistribution}
										dataKey="value"
										nameKey="name"
										cx="50%"
										cy="50%"
										outerRadius={80}
										label
									>
										{data.mealTypeDistribution.map((entry, index) => (
											<Cell
												key={`cell-${index}`}
												fill={COLORS[index % COLORS.length]}
											/>
										))}
									</Pie>
								</PieChart>
							</ChartContainer>
						</CardContent>
					</Card>
				</div>
			)}
		</div>
	);
}
