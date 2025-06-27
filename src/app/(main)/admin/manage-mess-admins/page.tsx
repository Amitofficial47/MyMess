"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
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
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2 } from "lucide-react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/auth-provider";

const messAdminFormSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters."),
	email: z.string().email("Invalid email address."),
	password: z.string().min(6, "Password must be at least 6 characters."),
	hostel: z.string().min(1, "Please select a hostel."),
});

const hostels = ["Ganga", "Yamuna", "Saraswati", "Godavari", "Kaveri"];

type MessAdminUser = {
	id: string;
	name: string;
	email: string;
	hostel: string;
};

export default function ManageMessAdminsPage() {
	const { user } = useAuth();
	const [messAdmins, setMessAdmins] = useState<MessAdminUser[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { toast } = useToast();

	const form = useForm<z.infer<typeof messAdminFormSchema>>({
		resolver: zodResolver(messAdminFormSchema),
		defaultValues: { name: "", email: "", password: "", hostel: "" },
	});

	useEffect(() => {
		fetchMessAdmins();
	}, []);

	async function fetchMessAdmins() {
		setIsLoading(true);
		try {
			const res = await fetch("/api/mess-admins");
			if (res.ok) {
				const data = await res.json();
				setMessAdmins(data);
			} else {
				toast({ variant: "destructive", title: "Failed to fetch mess admins" });
			}
		} catch (error) {
			toast({ variant: "destructive", title: "An error occurred" });
		} finally {
			setIsLoading(false);
		}
	}

	async function onSubmit(values: z.infer<typeof messAdminFormSchema>) {
		setIsSubmitting(true);
		try {
			const res = await fetch("/api/mess-admins", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(values),
			});
			const data = await res.json();
			if (res.ok) {
				toast({
					title: "Mess Admin Created",
					description: "The new mess admin account has been created.",
				});
				form.reset();
				fetchMessAdmins();
			} else {
				toast({
					variant: "destructive",
					title: "Creation Failed",
					description: data.error,
				});
			}
		} catch (error) {
			toast({ variant: "destructive", title: "An unexpected error occurred" });
		} finally {
			setIsSubmitting(false);
		}
	}

	async function deleteMessAdmin(id: string) {
		try {
			const res = await fetch(`/api/mess-admins/${id}`, { method: "DELETE" });
			if (res.ok) {
				toast({
					title: "Mess Admin Deleted",
					description: "The account has been removed.",
				});
				setMessAdmins(messAdmins.filter((admin) => admin.id !== id));
			} else {
				toast({ variant: "destructive", title: "Deletion Failed" });
			}
		} catch (error) {
			toast({ variant: "destructive", title: "An unexpected error occurred" });
		}
	}

	const allowedHostels =
		user?.role === "superadmin" ? hostels : user?.hostel ? [user.hostel] : [];

	return (
		<div className="flex flex-col gap-6">
			<div className="text-center">
				<h1 className="text-2xl font-bold md:text-3xl lg:text-4xl">
					Manage Mess Admins
				</h1>
				<p className="text-muted-foreground">
					Create, view, and remove token verifiers for hostels.
				</p>
			</div>
			<div className="grid gap-8 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Create New Mess Admin</CardTitle>
						<CardDescription>
							Assign a new token verifier to a hostel.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-4"
							>
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Full Name</FormLabel>
											<FormControl>
												<Input placeholder="John Doe" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input placeholder="mess.admin@mymess.com" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Password</FormLabel>
											<FormControl>
												<Input
													type="password"
													placeholder="••••••••"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="hostel"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Hostel</FormLabel>
											<Select
												onValueChange={field.onChange}
												value={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Assign a hostel" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{allowedHostels.map((h) => (
														<SelectItem key={h} value={h}>
															{h}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button type="submit" disabled={isSubmitting}>
									{isSubmitting && (
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									)}
									Create Mess Admin
								</Button>
							</form>
						</Form>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Existing Mess Admins</CardTitle>
						<CardDescription>Manage current token verifiers.</CardDescription>
					</CardHeader>
					<CardContent className="p-0">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Name</TableHead>
									<TableHead>Hostel</TableHead>
									<TableHead className="text-right">Action</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{isLoading ? (
									Array.from({ length: 3 }).map((_, i) => (
										<TableRow key={i}>
											<TableCell>
												<Skeleton className="h-5 w-24" />
											</TableCell>
											<TableCell>
												<Skeleton className="h-5 w-16" />
											</TableCell>
											<TableCell className="text-right">
												<Skeleton className="h-8 w-8 ml-auto" />
											</TableCell>
										</TableRow>
									))
								) : messAdmins.length > 0 ? (
									messAdmins.map((admin) => (
										<TableRow key={admin.id}>
											<TableCell>
												<div className="font-medium">{admin.name}</div>
												<div className="text-sm text-muted-foreground">
													{admin.email}
												</div>
											</TableCell>
											<TableCell>{admin.hostel}</TableCell>
											<TableCell className="text-right">
												<AlertDialog>
													<AlertDialogTrigger asChild>
														<Button variant="ghost" size="icon">
															<Trash2 className="h-4 w-4 text-destructive" />
														</Button>
													</AlertDialogTrigger>
													<AlertDialogContent>
														<AlertDialogHeader>
															<AlertDialogTitle>Are you sure?</AlertDialogTitle>
															<AlertDialogDescription>
																This action cannot be undone. This will
																permanently delete the account for {admin.name}.
															</AlertDialogDescription>
														</AlertDialogHeader>
														<AlertDialogFooter>
															<AlertDialogCancel>Cancel</AlertDialogCancel>
															<AlertDialogAction
																onClick={() => deleteMessAdmin(admin.id)}
																className="bg-destructive hover:bg-destructive/90"
															>
																Delete
															</AlertDialogAction>
														</AlertDialogFooter>
													</AlertDialogContent>
												</AlertDialog>
											</TableCell>
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell colSpan={3} className="h-24 text-center">
											No mess admins created yet.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
