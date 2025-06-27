// "use client";

// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { Button } from "@/components/ui/button";
// import {
// 	Form,
// 	FormControl,
// 	FormField,
// 	FormItem,
// 	FormLabel,
// 	FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import {
// 	Select,
// 	SelectContent,
// 	SelectItem,
// 	SelectTrigger,
// 	SelectValue,
// } from "@/components/ui/select";
// import { useAuth } from "@/contexts/auth-provider";
// import { useRouter } from "next/navigation";
// import { useToast } from "@/hooks/use-toast";
// import { useState } from "react";
// import { Loader2 } from "lucide-react";

// const formSchema = z.object({
// 	name: z.string().min(2, { message: "Name must be at least 2 characters." }),
// 	enrollmentNumber: z
// 		.string()
// 		.min(1, { message: "Enrollment number is required." }),
// 	email: z.string().email({ message: "Invalid email address." }),
// 	password: z
// 		.string()
// 		.min(6, { message: "Password must be at least 6 characters." }),
// 	hostel: z.string().min(1, { message: "Please select a hostel." }),
// 	course: z.string().min(1, { message: "Please select your course." }),
// });

// const hostels = ["Ganga", "Yamuna", "Saraswati", "Godavari", "Kaveri"];
// const courses = [
// 	"MA",
// 	"MCA",
// 	"MBA",
// 	"MSC",
// 	"PHD-Scholor",
// 	"MPED",
// 	"BIosciences",
// 	"Other",
// ];

// export function SignupForm() {
// 	const [isLoading, setIsLoading] = useState(false);
// 	const router = useRouter();
// 	const { signup } = useAuth();
// 	const { toast } = useToast();

// 	const form = useForm<z.infer<typeof formSchema>>({
// 		resolver: zodResolver(formSchema),
// 		defaultValues: {
// 			name: "",
// 			email: "",
// 			password: "",
// 			hostel: "",
// 			enrollmentNumber: "",
// 			course: "",
// 		},
// 	});

// 	async function onSubmit(values: z.infer<typeof formSchema>) {
// 		setIsLoading(true);
// 		const result = await signup(
// 			values.name,
// 			values.email,
// 			values.password,
// 			values.hostel,
// 			values.enrollmentNumber,
// 			values.course
// 		);
// 		if (result.success) {
// 			router.push("/");
// 			router.refresh();
// 		} else {
// 			toast({
// 				variant: "destructive",
// 				title: "Signup Failed",
// 				description: result.message || "An unexpected error occurred.",
// 			});
// 		}
// 		setIsLoading(false);
// 	}

// 	return (
// 		<Form {...form}>
// 			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
// 				<FormField
// 					control={form.control}
// 					name="name"
// 					render={({ field }) => (
// 						<FormItem>
// 							<FormLabel>Full Name</FormLabel>
// 							<FormControl>
// 								<Input placeholder="John Doe" {...field} />
// 							</FormControl>
// 							<FormMessage />
// 						</FormItem>
// 					)}
// 				/>
// 				<FormField
// 					control={form.control}
// 					name="enrollmentNumber"
// 					render={({ field }) => (
// 						<FormItem>
// 							<FormLabel>Enrollment Number</FormLabel>
// 							<FormControl>
// 								<Input placeholder="e.g., A12345678" {...field} />
// 							</FormControl>
// 							<FormMessage />
// 						</FormItem>
// 					)}
// 				/>
// 				<FormField
// 					control={form.control}
// 					name="email"
// 					render={({ field }) => (
// 						<FormItem>
// 							<FormLabel>Email</FormLabel>
// 							<FormControl>
// 								<Input placeholder="user@messmate.com" {...field} />
// 							</FormControl>
// 							<FormMessage />
// 						</FormItem>
// 					)}
// 				/>
// 				<FormField
// 					control={form.control}
// 					name="password"
// 					render={({ field }) => (
// 						<FormItem>
// 							<FormLabel>Password</FormLabel>
// 							<FormControl>
// 								<Input type="password" placeholder="••••••••" {...field} />
// 							</FormControl>
// 							<FormMessage />
// 						</FormItem>
// 					)}
// 				/>
// 				<div className="grid grid-cols-2 gap-4">
// 					<FormField
// 						control={form.control}
// 						name="hostel"
// 						render={({ field }) => (
// 							<FormItem>
// 								<FormLabel>Hostel</FormLabel>
// 								<Select
// 									onValueChange={field.onChange}
// 									defaultValue={field.value}
// 								>
// 									<FormControl>
// 										<SelectTrigger>
// 											<SelectValue placeholder="Select" />
// 										</SelectTrigger>
// 									</FormControl>
// 									<SelectContent>
// 										{hostels.map((hostel) => (
// 											<SelectItem key={hostel} value={hostel}>
// 												{hostel}
// 											</SelectItem>
// 										))}
// 									</SelectContent>
// 								</Select>
// 								<FormMessage />
// 							</FormItem>
// 						)}
// 					/>
// 					<FormField
// 						control={form.control}
// 						name="course"
// 						render={({ field }) => (
// 							<FormItem>
// 								<FormLabel>Course</FormLabel>
// 								<Select
// 									onValueChange={field.onChange}
// 									defaultValue={field.value}
// 								>
// 									<FormControl>
// 										<SelectTrigger>
// 											<SelectValue placeholder="Select" />
// 										</SelectTrigger>
// 									</FormControl>
// 									<SelectContent>
// 										{courses.map((course) => (
// 											<SelectItem key={course} value={course}>
// 												{course}
// 											</SelectItem>
// 										))}
// 									</SelectContent>
// 								</Select>
// 								<FormMessage />
// 							</FormItem>
// 						)}
// 					/>
// 				</div>
// 				<Button type="submit" className="w-full" disabled={isLoading}>
// 					{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
// 					Create Account
// 				</Button>
// 			</form>
// 		</Form>
// 	);
// }

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
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/auth-provider";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { hostelNames } from "@/lib/hostels";

const formSchema = z.object({
	name: z.string().min(2, { message: "Name must be at least 2 characters." }),
	enrollmentNumber: z
		.string()
		.min(1, { message: "Enrollment number is required." }),
	email: z.string().email({ message: "Invalid email address." }),
	password: z
		.string()
		.min(6, { message: "Password must be at least 6 characters." }),
	hostel: z.string().min(1, { message: "Please select a hostel." }),
	course: z.string().min(1, { message: "Please select your course." }),
});

const courses = [
	"MA",
	"MCA",
	"MBA",
	"MSC",
	"PHD-Scholor",
	"MPED",
	"BIosciences",
	"Other",
];

export function SignupForm() {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const { signup } = useAuth();
	const { toast } = useToast();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			hostel: "",
			enrollmentNumber: "",
			course: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setIsLoading(true);
		const result = await signup(
			values.name,
			values.email,
			values.password,
			values.hostel,
			values.enrollmentNumber,
			values.course
		);
		if (result.success) {
			router.push("/");
			router.refresh();
		} else {
			toast({
				variant: "destructive",
				title: "Signup Failed",
				description: result.message || "An unexpected error occurred.",
			});
		}
		setIsLoading(false);
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
					name="enrollmentNumber"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Enrollment Number</FormLabel>
							<FormControl>
								<Input placeholder="e.g., A12345678" {...field} />
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
								<Input placeholder="user@smp.com" {...field} />
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
								<Input type="password" placeholder="••••••••" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="grid grid-cols-2 gap-4">
					<FormField
						control={form.control}
						name="hostel"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Hostel</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Select" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{hostelNames.map((hostel) => (
											<SelectItem key={hostel} value={hostel}>
												{hostel}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="course"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Course</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Select" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{courses.map((course) => (
											<SelectItem key={course} value={course}>
												{course}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<Button type="submit" className="w-full" disabled={isLoading}>
					{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
					Create Account
				</Button>
			</form>
		</Form>
	);
}
