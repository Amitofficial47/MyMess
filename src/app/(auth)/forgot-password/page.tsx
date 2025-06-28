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
import { fetchApi } from "@/lib/api";
import { useRouter } from "next/navigation";

const formSchema = z.object({
	email: z.string().email({ message: "Please enter a valid email address." }),
});

export default function ForgotPasswordPage() {
	const [isLoading, setIsLoading] = useState(false);
	const { toast } = useToast();
	const router = useRouter();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: { email: "" },
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setIsLoading(true);
		try {
			const res = await fetchApi("/api/auth/request-password-reset", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(values),
			});

			if (res.ok) {
				toast({
					title: "OTP Sent",
					description: "An OTP has been sent to your email address.",
				});
				router.push(`/verify-otp?email=${encodeURIComponent(values.email)}`);
			} else {
				const data = await res.json();
				toast({
					variant: "destructive",
					title: "Error",
					description: data.error || "An unexpected error occurred.",
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

	return (
		<Card>
			<CardHeader className="text-center">
				<CardTitle className="text-2xl">Forgot Password</CardTitle>
				<CardDescription>
					Enter your email and we&apos;ll send you an OTP to reset your
					password.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input placeholder="user@example.com" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit" className="w-full" disabled={isLoading}>
							{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							Send OTP
						</Button>
					</form>
				</Form>
				<p className="mt-4 text-center text-sm text-muted-foreground">
					Remembered your password?{" "}
					<Link
						href="/login"
						className="font-medium text-primary hover:underline"
					>
						Log in
					</Link>
				</p>
			</CardContent>
		</Card>
	);
}
