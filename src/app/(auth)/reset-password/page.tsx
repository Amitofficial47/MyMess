"use client";

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
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";

const formSchema = z
	.object({
		password: z
			.string()
			.min(6, { message: "Password must be at least 6 characters." }),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

export default function ResetPasswordPage() {
	const [isLoading, setIsLoading] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const { toast } = useToast();
	const router = useRouter();
	const searchParams = useSearchParams();
	const token = searchParams.get("token");

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: { password: "", confirmPassword: "" },
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		if (!token) {
			toast({
				variant: "destructive",
				title: "Error",
				description: "Missing password reset token.",
			});
			return;
		}

		setIsLoading(true);
		try {
			const res = await fetchApi("/api/auth/reset-password", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ token, password: values.password }),
			});

			if (res.ok) {
				setIsSuccess(true);
			} else {
				const data = await res.json();
				toast({
					variant: "destructive",
					title: "Error",
					description:
						data.error ||
						"Failed to reset password. The link may be invalid or expired.",
				});
			}
		} catch (error) {
			toast({
				variant: "destructive",
				title: "Network Error",
				description: "Could not connect to the server. Please try again later.",
			});
		} finally {
			setIsLoading(false);
		}
	}

	if (!token) {
		return (
			<Card>
				<CardHeader className="text-center">
					<CardTitle className="text-2xl text-destructive">
						Invalid Link
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-center text-muted-foreground">
						The password reset link is missing or invalid. Please request a new
						one.
					</p>
					<Button asChild className="w-full mt-6">
						<Link href="/forgot-password">Request New Link</Link>
					</Button>
				</CardContent>
			</Card>
		);
	}

	if (isSuccess) {
		return (
			<Card>
				<CardHeader className="text-center">
					<CardTitle className="text-2xl">Password Reset!</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-center text-muted-foreground">
						Your password has been changed successfully. You will receive a
						confirmation email shortly. You can now log in with your new
						password.
					</p>
					<Button asChild className="w-full mt-6">
						<Link href="/login">Go to Login</Link>
					</Button>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader className="text-center">
				<CardTitle className="text-2xl">Create New Password</CardTitle>
				<CardDescription>
					Choose a new, strong password for your account.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>New Password</FormLabel>
									<FormControl>
										<Input type="password" placeholder="••••••••" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="confirmPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Confirm New Password</FormLabel>
									<FormControl>
										<Input type="password" placeholder="••••••••" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit" className="w-full" disabled={isLoading}>
							{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							Reset Password
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
