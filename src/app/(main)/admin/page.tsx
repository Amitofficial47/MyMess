// "use client";

// import { useState, useEffect } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { useData } from "@/contexts/data-provider";
// import { useToast } from "@/hooks/use-toast";
// import {
// 	Table,
// 	TableBody,
// 	TableCell,
// 	TableHead,
// 	TableHeader,
// 	TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import {
// 	Coffee,
// 	Sun,
// 	Moon,
// 	Search,
// 	Hourglass,
// 	Loader2,
// 	Users,
// 	UserCheck,
// 	Building,
// 	ShieldCheck,
// 	Settings,
// 	Bell,
// 	FileUp,
// 	MessageSquare,
// } from "lucide-react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import {
// 	Form,
// 	FormControl,
// 	FormField,
// 	FormItem,
// 	FormMessage,
// } from "@/components/ui/form";
// import { useAuth } from "@/contexts/auth-provider";
// import { Skeleton } from "@/components/ui/skeleton";
// import Link from "next/link";

// // Main component to switch between dashboards
// export default function DashboardPage() {
// 	const { user, loading } = useAuth();

// 	if (loading || !user) {
// 		return (
// 			<div className="flex h-full items-center justify-center">
// 				<Loader2 className="h-8 w-8 animate-spin" />
// 			</div>
// 		);
// 	}

// 	return user.role === "superadmin" ? (
// 		<SuperAdminDashboard />
// 	) : (
// 		<AdminDashboard />
// 	);
// }

// // --- Super Admin Dashboard ---
// function SuperAdminDashboard() {
// 	const [stats, setStats] = useState({
// 		studentCount: 0,
// 		adminCount: 0,
// 		hostelCount: 0,
// 	});
// 	const [isLoading, setIsLoading] = useState(true);

// 	useEffect(() => {
// 		async function fetchStats() {
// 			setIsLoading(true);
// 			try {
// 				const res = await fetch("/api/stats");
// 				if (res.ok) {
// 					const data = await res.json();
// 					setStats(data);
// 				} else {
// 					console.error("Failed to fetch stats: ", await res.text());
// 				}
// 			} catch (error) {
// 				console.error("Failed to fetch stats", error);
// 			} finally {
// 				setIsLoading(false);
// 			}
// 		}
// 		fetchStats();
// 	}, []);

// 	const quickActions = [
// 		{
// 			title: "Manage Admins",
// 			href: "/admin/manage-admins",
// 			icon: ShieldCheck,
// 			description: "Add or remove hostel admins.",
// 		},
// 		{
// 			title: "Edit Menu",
// 			href: "/admin/menu",
// 			icon: Settings,
// 			description: "Update the weekly meal plan.",
// 		},
// 		{
// 			title: "Send Notifications",
// 			href: "/admin/notifications",
// 			icon: Bell,
// 			description: "Broadcast announcements.",
// 		},
// 		{
// 			title: "Upload Bills",
// 			href: "/admin/bills",
// 			icon: FileUp,
// 			description: "Manage monthly student bills.",
// 		},
// 	];

// 	return (
// 		<div className="flex flex-col gap-8">
// 			<div className="text-center">
// 				<h1 className="text-2xl font-bold md:text-3xl lg:text-4xl">
// 					Super Admin Dashboard
// 				</h1>
// 				<p className="text-muted-foreground">
// 					System-wide overview and management.
// 				</p>
// 			</div>

// 			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
// 				<OverviewStatCard
// 					title="Approved Students"
// 					value={stats.studentCount}
// 					icon={Users}
// 					isLoading={isLoading}
// 				/>
// 				<OverviewStatCard
// 					title="Total Admins"
// 					value={stats.adminCount}
// 					icon={UserCheck}
// 					isLoading={isLoading}
// 				/>
// 				<OverviewStatCard
// 					title="Managed Hostels"
// 					value={stats.hostelCount}
// 					icon={Building}
// 					isLoading={isLoading}
// 				/>
// 				<OverviewStatCard
// 					title="System Status"
// 					value="Online"
// 					icon={ShieldCheck}
// 					isLoading={false}
// 				/>
// 			</div>

// 			<div>
// 				<h2 className="text-xl font-bold md:text-2xl mb-4 text-center md:text-left">
// 					Quick Actions
// 				</h2>
// 				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
// 					{quickActions.map((action) => (
// 						<Link href={action.href} key={action.href} className="flex">
// 							<Card className="hover:bg-accent hover:border-primary transition-colors w-full flex flex-col">
// 								<CardHeader>
// 									<div className="flex items-center gap-4">
// 										<div className="bg-primary/10 p-3 rounded-lg">
// 											<action.icon className="h-6 w-6 text-primary" />
// 										</div>
// 										<CardTitle className="text-lg">{action.title}</CardTitle>
// 									</div>
// 								</CardHeader>
// 								<CardContent className="flex-grow">
// 									<p className="text-sm text-muted-foreground">
// 										{action.description}
// 									</p>
// 								</CardContent>
// 							</Card>
// 						</Link>
// 					))}
// 				</div>
// 			</div>
// 		</div>
// 	);
// }

// const OverviewStatCard = ({
// 	title,
// 	value,
// 	icon: Icon,
// 	isLoading,
// }: {
// 	title: string;
// 	value: string | number;
// 	icon: React.ElementType;
// 	isLoading: boolean;
// }) => (
// 	<Card>
// 		<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// 			<CardTitle className="text-sm font-medium">{title}</CardTitle>
// 			<Icon className="h-4 w-4 text-muted-foreground" />
// 		</CardHeader>
// 		<CardContent>
// 			{isLoading ? (
// 				<Skeleton className="h-8 w-16" />
// 			) : (
// 				<div className="text-2xl font-bold">{value}</div>
// 			)}
// 		</CardContent>
// 	</Card>
// );

// // --- Regular Admin Dashboard ---

// const verifySchema = z.object({
// 	token: z.string().min(1, "Token is required."),
// });

// function AdminDashboard() {
// 	const { mealSelections, verifyToken, users } = useData();
// 	const { user } = useAuth();
// 	const { toast } = useToast();
// 	const [today, setToday] = useState<string | null>(null);
// 	const [stats, setStats] = useState({ studentCount: 0 });
// 	const [isLoadingStats, setIsLoadingStats] = useState(true);

// 	useEffect(() => {
// 		setToday(new Date().toISOString().split("T")[0]);
// 	}, []);

// 	useEffect(() => {
// 		async function fetchStats() {
// 			setIsLoadingStats(true);
// 			try {
// 				const res = await fetch("/api/stats");
// 				if (res.ok) {
// 					const data = await res.json();
// 					setStats(data);
// 				} else {
// 					console.error("Failed to fetch admin stats: ", await res.text());
// 				}
// 			} catch (error) {
// 				console.error("Failed to fetch admin stats", error);
// 			} finally {
// 				setIsLoadingStats(false);
// 			}
// 		}
// 		fetchStats();
// 	}, []);

// 	const form = useForm<z.infer<typeof verifySchema>>({
// 		resolver: zodResolver(verifySchema),
// 		defaultValues: { token: "" },
// 	});

// 	const todaysSelections = today
// 		? mealSelections.filter((sel) => sel.date === today)
// 		: [];

// 	const breakfastCount = todaysSelections.filter(
// 		(s) => s.mealType === "Breakfast" && s.consumed
// 	).length;
// 	const lunchCount = todaysSelections.filter(
// 		(s) => s.mealType === "Lunch" && s.consumed
// 	).length;
// 	const dinnerCount = todaysSelections.filter(
// 		(s) => s.mealType === "Dinner" && s.consumed
// 	).length;

// 	const activeTokens = todaysSelections.filter((sel) => !sel.consumed);

// 	const handleVerifyToken = (values: z.infer<typeof verifySchema>) => {
// 		const success = verifyToken(values.token);
// 		if (success) {
// 			toast({
// 				title: "Token Verified",
// 				description: "Meal marked as consumed.",
// 				className: "bg-green-100 dark:bg-green-900 border-green-400",
// 			});
// 		} else {
// 			toast({
// 				variant: "destructive",
// 				title: "Invalid Token",
// 				description: "This token is invalid or has already been used.",
// 			});
// 		}
// 		form.reset();
// 	};

// 	const getUserName = (userId: string) =>
// 		users.find((u) => u.id === userId)?.name || "Unknown";

// 	return (
// 		<div className="flex flex-col gap-6">
// 			<div className="text-center">
// 				<h1 className="text-2xl font-bold md:text-3xl lg:text-4xl">
// 					Admin Dashboard
// 				</h1>
// 				<p className="text-muted-foreground">{user?.hostel} Hostel</p>
// 			</div>

// 			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
// 				<OperationalStatCard
// 					title="Students in Hostel"
// 					count={stats.studentCount}
// 					icon={Users}
// 					isLoading={isLoadingStats}
// 				/>
// 				<OperationalStatCard
// 					title="Breakfasts Served"
// 					count={breakfastCount}
// 					icon={Coffee}
// 				/>
// 				<OperationalStatCard
// 					title="Lunches Served"
// 					count={lunchCount}
// 					icon={Sun}
// 				/>
// 				<OperationalStatCard
// 					title="Dinners Served"
// 					count={dinnerCount}
// 					icon={Moon}
// 				/>
// 			</div>

// 			<div className="grid gap-6 md:grid-cols-2">
// 				<Card>
// 					<CardHeader>
// 						<CardTitle>Verify Token</CardTitle>
// 					</CardHeader>
// 					<CardContent>
// 						<Form {...form}>
// 							<form
// 								onSubmit={form.handleSubmit(handleVerifyToken)}
// 								className="flex items-start gap-2"
// 							>
// 								<FormField
// 									control={form.control}
// 									name="token"
// 									render={({ field }) => (
// 										<FormItem className="flex-grow">
// 											<FormControl>
// 												<Input
// 													placeholder="Enter token..."
// 													{...field}
// 													className="font-mono uppercase"
// 												/>
// 											</FormControl>
// 											<FormMessage />
// 										</FormItem>
// 									)}
// 								/>
// 								<Button type="submit">
// 									<Search className="h-4 w-4 mr-2" /> Verify
// 								</Button>
// 							</form>
// 						</Form>
// 					</CardContent>
// 				</Card>
// 				<Card>
// 					<CardHeader>
// 						<CardTitle>Today&apos;s Active Tokens</CardTitle>
// 					</CardHeader>
// 					<CardContent>
// 						<div className="rounded-md border">
// 							<Table>
// 								<TableHeader>
// 									<TableRow>
// 										<TableHead>Student</TableHead>
// 										<TableHead>Meal</TableHead>
// 										<TableHead className="text-right">Status</TableHead>
// 									</TableRow>
// 								</TableHeader>
// 								<TableBody>
// 									{activeTokens.length > 0 ? (
// 										activeTokens.map((sel) => (
// 											<TableRow key={sel.id}>
// 												<TableCell>{getUserName(sel.userId)}</TableCell>
// 												<TableCell>{sel.mealType}</TableCell>
// 												<TableCell className="text-right">
// 													<Badge variant="secondary">
// 														<Hourglass className="h-4 w-4 mr-1" />
// 														Pending
// 													</Badge>
// 												</TableCell>
// 											</TableRow>
// 										))
// 									) : (
// 										<TableRow>
// 											<TableCell colSpan={3} className="h-24 text-center">
// 												No active tokens for today.
// 											</TableCell>
// 										</TableRow>
// 									)}
// 								</TableBody>
// 							</Table>
// 						</div>
// 					</CardContent>
// 				</Card>
// 			</div>
// 		</div>
// 	);
// }

// const OperationalStatCard = ({
// 	title,
// 	count,
// 	icon: Icon,
// 	isLoading = false,
// }: {
// 	title: string;
// 	count: number;
// 	icon: React.ElementType;
// 	isLoading?: boolean;
// }) => (
// 	<Card>
// 		<CardHeader className="flex flex-col items-center justify-center space-y-2 pb-2">
// 			<Icon className="h-8 w-8 text-primary" />
// 			<CardTitle className="text-base font-semibold">{title}</CardTitle>
// 		</CardHeader>
// 		<CardContent className="text-center">
// 			{isLoading ? (
// 				<Skeleton className="h-9 w-12 mx-auto" />
// 			) : (
// 				<div className="text-3xl font-bold">{count}</div>
// 			)}
// 		</CardContent>
// 	</Card>
// );

"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useData } from "@/contexts/data-provider";
import { useToast } from "@/hooks/use-toast";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
	Coffee,
	Sun,
	Moon,
	Search,
	Hourglass,
	Loader2,
	Users,
	UserCheck,
	Building,
	ShieldCheck,
	Settings,
	Bell,
	FileUp,
	MessageSquare,
	Contact2,
	Shield,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/contexts/auth-provider";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

// Main component to switch between dashboards
export default function DashboardPage() {
	const { user, loading } = useAuth();

	if (loading || !user) {
		return (
			<div className="flex h-full items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin" />
			</div>
		);
	}

	if (user.role === "superadmin") return <SuperAdminDashboard />;
	if (user.role === "admin") return <AdminDashboard />;
	if (user.role === "messadmin") return <MessAdminDashboard />;

	return null;
}

// --- Super Admin Dashboard ---
function SuperAdminDashboard() {
	const [stats, setStats] = useState({
		studentCount: 0,
		adminCount: 0,
		hostelCount: 0,
	});
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function fetchStats() {
			setIsLoading(true);
			try {
				const res = await fetch("/api/stats");
				if (res.ok) {
					const data = await res.json();
					setStats(data);
				} else {
					console.error("Failed to fetch stats: ", await res.text());
				}
			} catch (error) {
				console.error("Failed to fetch stats", error);
			} finally {
				setIsLoading(false);
			}
		}
		fetchStats();
	}, []);

	const quickActions = [
		{
			title: "Manage Admins",
			href: "/admin/manage-admins",
			icon: Shield,
			description: "Add or remove hostel admins.",
		},
		{
			title: "Manage Mess Admins",
			href: "/admin/manage-mess-admins",
			icon: ShieldCheck,
			description: "Manage token verifiers.",
		},
		{
			title: "Edit Menu",
			href: "/admin/menu",
			icon: Settings,
			description: "Update the weekly meal plan.",
		},
		{
			title: "Send Notifications",
			href: "/admin/notifications",
			icon: Bell,
			description: "Broadcast announcements.",
		},
	];

	return (
		<div className="flex flex-col gap-8">
			<div className="text-center">
				<h1 className="text-2xl font-bold md:text-3xl lg:text-4xl">
					Super Admin Dashboard
				</h1>
				<p className="text-muted-foreground">
					System-wide overview and management.
				</p>
			</div>

			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
				<OverviewStatCard
					title="Approved Students"
					value={stats.studentCount}
					icon={Users}
					isLoading={isLoading}
				/>
				<OverviewStatCard
					title="Total Admins"
					value={stats.adminCount}
					icon={UserCheck}
					isLoading={isLoading}
				/>
				<OverviewStatCard
					title="Managed Hostels"
					value={stats.hostelCount}
					icon={Building}
					isLoading={isLoading}
				/>
				<OverviewStatCard
					title="System Status"
					value="Online"
					icon={ShieldCheck}
					isLoading={false}
				/>
			</div>

			<div>
				<h2 className="text-xl font-bold md:text-2xl mb-4 text-center md:text-left">
					Quick Actions
				</h2>
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
					{quickActions.map((action) => (
						<Link href={action.href} key={action.href} className="flex">
							<Card className="hover:bg-accent hover:border-primary transition-colors w-full flex flex-col">
								<CardHeader>
									<div className="flex items-center gap-4">
										<div className="bg-primary/10 p-3 rounded-lg">
											<action.icon className="h-6 w-6 text-primary" />
										</div>
										<CardTitle className="text-lg">{action.title}</CardTitle>
									</div>
								</CardHeader>
								<CardContent className="flex-grow">
									<p className="text-sm text-muted-foreground">
										{action.description}
									</p>
								</CardContent>
							</Card>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
}

const OverviewStatCard = ({
	title,
	value,
	icon: Icon,
	isLoading,
}: {
	title: string;
	value: string | number;
	icon: React.ElementType;
	isLoading: boolean;
}) => (
	<Card>
		<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
			<CardTitle className="text-sm font-medium">{title}</CardTitle>
			<Icon className="h-4 w-4 text-muted-foreground" />
		</CardHeader>
		<CardContent>
			{isLoading ? (
				<Skeleton className="h-8 w-16" />
			) : (
				<div className="text-2xl font-bold">{value}</div>
			)}
		</CardContent>
	</Card>
);

// --- Token Verification Component (Shared by Admin & MessAdmin) ---
const verifySchema = z.object({
	token: z.string().min(1, "Token is required."),
});

function TokenVerificationSection() {
	const { verifyToken } = useData();
	const { toast } = useToast();
	const form = useForm<z.infer<typeof verifySchema>>({
		resolver: zodResolver(verifySchema),
		defaultValues: { token: "" },
	});

	const handleVerifyToken = (values: z.infer<typeof verifySchema>) => {
		const success = verifyToken(values.token);
		if (success) {
			toast({
				title: "Token Verified",
				description: "Meal marked as consumed.",
				className: "bg-green-100 dark:bg-green-900 border-green-400",
			});
		} else {
			toast({
				variant: "destructive",
				title: "Invalid Token",
				description: "This token is invalid or has already been used.",
			});
		}
		form.reset();
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Verify Token</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleVerifyToken)}
						className="flex items-start gap-2"
					>
						<FormField
							control={form.control}
							name="token"
							render={({ field }) => (
								<FormItem className="flex-grow">
									<FormControl>
										<Input
											placeholder="Enter token..."
											{...field}
											className="font-mono uppercase"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit">
							<Search className="h-4 w-4 mr-2" /> Verify
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}

function ActiveTokensTable() {
	const { mealSelections, users } = useData();
	const [today, setToday] = useState<string | null>(null);

	useEffect(() => {
		setToday(new Date().toISOString().split("T")[0]);
	}, []);

	const activeTokens = today
		? mealSelections.filter((sel) => sel.date === today && !sel.consumed)
		: [];
	const getUserName = (userId: string) =>
		users.find((u) => u.id === userId)?.name || "Unknown";

	return (
		<Card>
			<CardHeader>
				<CardTitle>Today&apos;s Active Tokens</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="rounded-md border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Student</TableHead>
								<TableHead>Meal</TableHead>
								<TableHead className="text-right">Status</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{activeTokens.length > 0 ? (
								activeTokens.map((sel) => (
									<TableRow key={sel.id}>
										<TableCell>{getUserName(sel.userId)}</TableCell>
										<TableCell>{sel.mealType}</TableCell>
										<TableCell className="text-right">
											<Badge variant="secondary">
												<Hourglass className="h-4 w-4 mr-1" />
												Pending
											</Badge>
										</TableCell>
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell colSpan={3} className="h-24 text-center">
										No active tokens for today.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>
	);
}

// --- Regular Admin Dashboard ---
function AdminDashboard() {
	const { mealSelections } = useData();
	const { user } = useAuth();
	const [today, setToday] = useState<string | null>(null);
	const [stats, setStats] = useState({ studentCount: 0 });
	const [isLoadingStats, setIsLoadingStats] = useState(true);

	useEffect(() => {
		setToday(new Date().toISOString().split("T")[0]);
	}, []);

	useEffect(() => {
		async function fetchStats() {
			setIsLoadingStats(true);
			try {
				const res = await fetch("/api/stats");
				if (res.ok) {
					const data = await res.json();
					setStats(data);
				} else {
					console.error("Failed to fetch admin stats: ", await res.text());
				}
			} catch (error) {
				console.error("Failed to fetch admin stats", error);
			} finally {
				setIsLoadingStats(false);
			}
		}
		fetchStats();
	}, []);

	const todaysSelections = today
		? mealSelections.filter((sel) => sel.date === today)
		: [];

	const breakfastCount = todaysSelections.filter(
		(s) => s.mealType === "Breakfast" && s.consumed
	).length;
	const lunchCount = todaysSelections.filter(
		(s) => s.mealType === "Lunch" && s.consumed
	).length;
	const dinnerCount = todaysSelections.filter(
		(s) => s.mealType === "Dinner" && s.consumed
	).length;

	return (
		<div className="flex flex-col gap-6">
			<div className="text-center">
				<h1 className="text-2xl font-bold md:text-3xl lg:text-4xl">
					Admin Dashboard
				</h1>
				<p className="text-muted-foreground">{user?.hostel} Hostel</p>
			</div>

			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
				<OperationalStatCard
					title="Students in Hostel"
					count={stats.studentCount}
					icon={Users}
					isLoading={isLoadingStats}
				/>
				<OperationalStatCard
					title="Breakfasts Served"
					count={breakfastCount}
					icon={Coffee}
				/>
				<OperationalStatCard
					title="Lunches Served"
					count={lunchCount}
					icon={Sun}
				/>
				<OperationalStatCard
					title="Dinners Served"
					count={dinnerCount}
					icon={Moon}
				/>
			</div>

			<div className="grid gap-6 md:grid-cols-2">
				<TokenVerificationSection />
				<ActiveTokensTable />
			</div>
		</div>
	);
}

// --- Mess Admin Dashboard ---
function MessAdminDashboard() {
	const { user } = useAuth();
	const { mealSelections } = useData();
	const [today, setToday] = useState<string | null>(null);

	useEffect(() => {
		setToday(new Date().toISOString().split("T")[0]);
	}, []);

	const todaysSelections = today
		? mealSelections.filter((sel) => sel.date === today)
		: [];

	const breakfastCount = todaysSelections.filter(
		(s) => s.mealType === "Breakfast" && s.consumed
	).length;
	const lunchCount = todaysSelections.filter(
		(s) => s.mealType === "Lunch" && s.consumed
	).length;
	const dinnerCount = todaysSelections.filter(
		(s) => s.mealType === "Dinner" && s.consumed
	).length;

	return (
		<div className="flex flex-col gap-6">
			<div className="text-center">
				<h1 className="text-2xl font-bold md:text-3xl lg:text-4xl">
					Mess Admin Dashboard
				</h1>
				<p className="text-muted-foreground">{user?.hostel} Hostel</p>
			</div>

			<div className="grid gap-6 md:grid-cols-3">
				<OperationalStatCard
					title="Breakfasts Served"
					count={breakfastCount}
					icon={Coffee}
				/>
				<OperationalStatCard
					title="Lunches Served"
					count={lunchCount}
					icon={Sun}
				/>
				<OperationalStatCard
					title="Dinners Served"
					count={dinnerCount}
					icon={Moon}
				/>
			</div>

			<div className="grid gap-6 md:grid-cols-2">
				<TokenVerificationSection />
				<ActiveTokensTable />
			</div>
		</div>
	);
}

const OperationalStatCard = ({
	title,
	count,
	icon: Icon,
	isLoading = false,
}: {
	title: string;
	count: number;
	icon: React.ElementType;
	isLoading?: boolean;
}) => (
	<Card>
		<CardHeader className="flex flex-col items-center justify-center space-y-2 pb-2">
			<Icon className="h-8 w-8 text-primary" />
			<CardTitle className="text-base font-semibold">{title}</CardTitle>
		</CardHeader>
		<CardContent className="text-center">
			{isLoading ? (
				<Skeleton className="h-9 w-12 mx-auto" />
			) : (
				<div className="text-3xl font-bold">{count}</div>
			)}
		</CardContent>
	</Card>
);
