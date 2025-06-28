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
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";

const formSchema = z.object({
	otp: z
		.string()
		.min(6, { message: "Your one-time password must be 6 characters." }),
});

export default function VerifyOtpPage() {
	const [isLoading, setIsLoading] = useState(false);
	const { toast } = useToast();
	const router = useRouter();
	const searchParams = useSearchParams();
	const email = searchParams.get("email");

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: { otp: "" },
	});

	const otpValue = form.watch("otp");

	useEffect(() => {
		if (otpValue.length === 6) {
			form.handleSubmit(onSubmit)();
		}
	}, [otpValue]);

	async function onSubmit(values: z.infer<typeof formSchema>) {
		if (!email) {
			toast({
				variant: "destructive",
				title: "Error",
				description: "Email not found. Please start over.",
			});
			return;
		}

		setIsLoading(true);
		try {
			const res = await fetchApi("/api/auth/verify-otp", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, otp: values.otp }),
			});

			const data = await res.json();
			if (res.ok) {
				toast({
					title: "OTP Verified",
					description: "You can now reset your password.",
				});
				router.push(`/reset-password?token=${data.token}`);
			} else {
				toast({
					variant: "destructive",
					title: "Invalid OTP",
					description: data.error || "The OTP is incorrect or has expired.",
				});
				form.reset();
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

	if (!email) {
		return (
			<Card>
				<CardHeader className="text-center">
					<CardTitle className="text-2xl text-destructive">
						Something went wrong
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-center text-muted-foreground">
						No email was provided. Please go back and try again.
					</p>
					<Button asChild className="w-full mt-6">
						<Link href="/forgot-password">Go Back</Link>
					</Button>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader className="text-center">
				<CardTitle className="text-2xl">Check Your Email</CardTitle>
				<CardDescription>
					We've sent a 6-digit OTP to {email}. It expires in 10 minutes.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<FormField
							control={form.control}
							name="otp"
							render={({ field }) => (
								<FormItem>
									<FormLabel>One-Time Password</FormLabel>
									<FormControl>
										<div className="flex justify-center">
											<InputOTP maxLength={6} {...field}>
												<InputOTPGroup>
													<InputOTPSlot index={0} />
													<InputOTPSlot index={1} />
													<InputOTPSlot index={2} />
													<InputOTPSlot index={3} />
													<InputOTPSlot index={4} />
													<InputOTPSlot index={5} />
												</InputOTPGroup>
											</InputOTP>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit" className="w-full" disabled={isLoading}>
							{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							Verify OTP
						</Button>
					</form>
				</Form>
				<p className="mt-4 text-center text-sm text-muted-foreground">
					Didn't get an email?{" "}
					<Link
						href="/forgot-password"
						className="font-medium text-primary hover:underline"
					>
						Resend
					</Link>
				</p>
			</CardContent>
		</Card>
	);
}
