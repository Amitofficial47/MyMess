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
// import { useAuth } from "@/contexts/auth-provider";
// import { useToast } from "@/hooks/use-toast";
// import { useState } from "react";
// import { Loader2 } from "lucide-react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";

// const profileSchema = z.object({
// 	name: z.string().min(2, "Name must be at least 2 characters."),
// 	avatar: z.any().optional(),
// });

// export default function ProfilePage() {
// 	const { user, updateUser } = useAuth();
// 	const { toast } = useToast();
// 	const [isSubmitting, setIsSubmitting] = useState(false);
// 	const [imagePreview, setImagePreview] = useState<string | null>(
// 		user?.avatar || null
// 	);

// 	const form = useForm<z.infer<typeof profileSchema>>({
// 		resolver: zodResolver(profileSchema),
// 		defaultValues: {
// 			name: user?.name || "",
// 		},
// 	});

// 	async function onSubmit(values: z.infer<typeof profileSchema>) {
// 		if (!user) return;
// 		setIsSubmitting(true);

// 		let avatarDataUrl = user.avatar;
// 		const file = values.avatar?.[0];

// 		if (file) {
// 			avatarDataUrl = await new Promise((resolve, reject) => {
// 				const reader = new FileReader();
// 				reader.onloadend = () => resolve(reader.result as string);
// 				reader.onerror = reject;
// 				reader.readAsDataURL(file);
// 			});
// 		}

// 		updateUser(values.name, avatarDataUrl);
// 		toast({
// 			title: "Profile Updated",
// 			description: "Your profile has been successfully updated.",
// 		});
// 		setIsSubmitting(false);
// 	}

// 	if (!user) {
// 		return null;
// 	}

// 	const fallbackInitials = user.name
// 		.split(" ")
// 		.map((n) => n[0])
// 		.slice(0, 2)
// 		.join("");

// 	return (
// 		<div className="flex flex-col gap-6 max-w-2xl mx-auto">
// 			<div className="text-center">
// 				<h1 className="text-2xl font-bold md:text-3xl">Your Profile</h1>
// 				<p className="text-muted-foreground">
// 					View and edit your personal information.
// 				</p>
// 			</div>
// 			<Card>
// 				<Form {...form}>
// 					<form onSubmit={form.handleSubmit(onSubmit)}>
// 						<CardContent className="p-6 space-y-6">
// 							<div className="flex flex-col items-center space-y-4">
// 								<Avatar className="h-24 w-24">
// 									<AvatarImage
// 										src={imagePreview || undefined}
// 										alt={user.name}
// 									/>
// 									<AvatarFallback className="text-3xl">
// 										{fallbackInitials}
// 									</AvatarFallback>
// 								</Avatar>
// 								<div className="text-center">
// 									<h2 className="text-2xl font-bold">{user.name}</h2>
// 									<p className="text-muted-foreground">
// 										{user.email} &bull; ID: {user.id}
// 									</p>
// 									<Badge variant="secondary" className="mt-2 capitalize">
// 										{user.role}
// 									</Badge>
// 								</div>
// 							</div>

// 							<FormField
// 								control={form.control}
// 								name="name"
// 								render={({ field }) => (
// 									<FormItem>
// 										<FormLabel>Full Name</FormLabel>
// 										<FormControl>
// 											<Input placeholder="Your full name" {...field} />
// 										</FormControl>
// 										<FormMessage />
// 									</FormItem>
// 								)}
// 							/>

// 							<FormField
// 								control={form.control}
// 								name="avatar"
// 								render={({ field: { onChange, value, ...rest } }) => (
// 									<FormItem>
// 										<FormLabel>Change Photo</FormLabel>
// 										<FormControl>
// 											<Input
// 												type="file"
// 												accept="image/*"
// 												className="file:text-primary file:font-medium"
// 												onChange={(e) => {
// 													const file = e.target.files?.[0];
// 													if (file) {
// 														const reader = new FileReader();
// 														reader.onloadend = () => {
// 															setImagePreview(reader.result as string);
// 														};
// 														reader.readAsDataURL(file);
// 													}
// 													onChange(e.target.files);
// 												}}
// 												{...rest}
// 											/>
// 										</FormControl>
// 										<FormMessage />
// 									</FormItem>
// 								)}
// 							/>

// 							<Button type="submit" className="w-full" disabled={isSubmitting}>
// 								{isSubmitting && (
// 									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
// 								)}
// 								Save Changes
// 							</Button>
// 						</CardContent>
// 					</form>
// 				</Form>
// 			</Card>
// 		</div>
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
import { useAuth } from "@/contexts/auth-provider";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const profileSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters."),
	avatar: z.any().optional(),
});

export default function ProfilePage() {
	const { user, updateUser } = useAuth();
	const { toast } = useToast();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [imagePreview, setImagePreview] = useState<string | null>(
		user?.avatar || null
	);

	const form = useForm<z.infer<typeof profileSchema>>({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			name: user?.name || "",
		},
	});

	async function onSubmit(values: z.infer<typeof profileSchema>) {
		if (!user) return;
		setIsSubmitting(true);

		let avatarDataUrl = user.avatar;
		const file = values.avatar?.[0];

		if (file) {
			avatarDataUrl = await new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.onloadend = () => resolve(reader.result as string);
				reader.onerror = reject;
				reader.readAsDataURL(file);
			});
		}

		updateUser(values.name, avatarDataUrl);
		toast({
			title: "Profile Updated",
			description: "Your profile has been successfully updated.",
		});
		setIsSubmitting(false);
	}

	if (!user) {
		return null;
	}

	const fallbackInitials = user.name
		.split(" ")
		.map((n) => n[0])
		.slice(0, 2)
		.join("");

	return (
		<div className="flex flex-col gap-6 max-w-2xl mx-auto">
			<div className="text-center">
				<h1 className="text-2xl font-bold md:text-3xl">Your Profile</h1>
				<p className="text-muted-foreground">
					View and edit your personal information.
				</p>
			</div>
			<Card>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<CardContent className="p-6 space-y-6">
							<div className="flex flex-col items-center space-y-4">
								<Avatar className="h-24 w-24">
									<AvatarImage
										src={imagePreview || undefined}
										alt={user.name}
									/>
									<AvatarFallback className="text-3xl">
										{fallbackInitials}
									</AvatarFallback>
								</Avatar>
								<div className="text-center">
									<h2 className="text-2xl font-bold">{user.name}</h2>
									<p className="text-muted-foreground">
										{user.email} &bull; ID: {user.displayId}
									</p>
									<Badge variant="secondary" className="mt-2 capitalize">
										{user.role}
									</Badge>
								</div>
							</div>

							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Full Name</FormLabel>
										<FormControl>
											<Input placeholder="Your full name" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="avatar"
								render={({ field: { onChange, value, ...rest } }) => (
									<FormItem>
										<FormLabel>Change Photo</FormLabel>
										<FormControl>
											<Input
												type="file"
												accept="image/*"
												className="file:text-primary file:font-medium"
												onChange={(e) => {
													const file = e.target.files?.[0];
													if (file) {
														const reader = new FileReader();
														reader.onloadend = () => {
															setImagePreview(reader.result as string);
														};
														reader.readAsDataURL(file);
													}
													onChange(e.target.files);
												}}
												{...rest}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Button type="submit" className="w-full" disabled={isSubmitting}>
								{isSubmitting && (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								)}
								Save Changes
							</Button>
						</CardContent>
					</form>
				</Form>
			</Card>
		</div>
	);
}
