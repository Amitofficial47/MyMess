// "use client";

// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { useAuth } from "@/contexts/auth-provider";
// import { useData } from "@/contexts/data-provider";
// import { useToast } from "@/hooks/use-toast";
// import { useState, useEffect } from "react";
// import { Loader2 } from "lucide-react";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
// import { Skeleton } from "@/components/ui/skeleton";

// const feedbackSchema = z.object({
//   subject: z.string().min(5, "Subject must be at least 5 characters."),
//   message: z.string().min(10, "Message must be at least 10 characters."),
// });

// export default function SubmitFeedbackPage() {
//   const { user } = useAuth();
//   const { feedback, addFeedback } = useData();
//   const { toast } = useToast();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isClient, setIsClient] = useState(false);

//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   const form = useForm<z.infer<typeof feedbackSchema>>({
//     resolver: zodResolver(feedbackSchema),
//     defaultValues: { subject: "", message: "" },
//   });

//   function onSubmit(values: z.infer<typeof feedbackSchema>) {
//     if (!user) return;
//     setIsSubmitting(true);
//     addFeedback(user.id, user.name, values.subject, values.message);
//     toast({
//       title: "Feedback Submitted",
//       description: "Thank you for your valuable feedback!",
//     });
//     form.reset();
//     setIsSubmitting(false);
//   }

//   const userFeedback = feedback
//     .filter((f) => f.userId === user?.id)
//     .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

//   return (
//     <div className="grid gap-8 md:grid-cols-2">
//       <div className="flex flex-col gap-6">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold md:text-3xl lg:text-4xl">Submit Feedback</h1>
//           <p className="text-muted-foreground">
//             We value your opinion. Let us know how we can improve.
//           </p>
//         </div>
//         <Card>
//           <CardContent className="p-6">
//             <Form {...form}>
//               <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//                 <FormField
//                   control={form.control}
//                   name="subject"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Subject</FormLabel>
//                       <FormControl>
//                         <Input placeholder="e.g., Regarding lunch quality" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="message"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Message</FormLabel>
//                       <FormControl>
//                         <Textarea
//                           placeholder="Please provide details here..."
//                           className="min-h-[120px]"
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <Button type="submit" disabled={isSubmitting}>
//                   {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//                   Submit
//                 </Button>
//               </form>
//             </Form>
//           </CardContent>
//         </Card>
//       </div>

//       <div className="flex flex-col gap-6">
//         <div className="text-center md:text-left">
//           <h2 className="text-xl font-bold md:text-2xl lg:text-3xl">Your Past Feedback</h2>
//           <p className="text-muted-foreground">A history of your submissions.</p>
//         </div>
//         <Card className="flex-1">
//           <CardContent className="p-6 space-y-4">
//             {userFeedback.length > 0 ? (
//               userFeedback.map((f, index) => (
//                 <div key={f.id}>
//                   <div>
//                     <h3 className="font-semibold">{f.subject}</h3>
//                     <p className="text-sm text-muted-foreground">{f.message}</p>
//                     <p className="text-xs text-muted-foreground mt-2">{isClient ? new Date(f.timestamp).toLocaleString() : <Skeleton className="h-3 w-32" />}</p>
//                   </div>
//                   {index < userFeedback.length - 1 && <Separator className="my-4" />}
//                 </div>
//               ))
//             ) : (
//               <p className="text-center text-muted-foreground pt-10">You haven&apos;t submitted any feedback yet.</p>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
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
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/auth-provider";
import { useData } from "@/contexts/data-provider";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const feedbackSchema = z.object({
	subject: z.string().min(5, "Subject must be at least 5 characters."),
	message: z.string().min(10, "Message must be at least 10 characters."),
});

export default function SubmitFeedbackPage() {
	const { user } = useAuth();
	const { feedback, addFeedback } = useData();
	const { toast } = useToast();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	const form = useForm<z.infer<typeof feedbackSchema>>({
		resolver: zodResolver(feedbackSchema),
		defaultValues: { subject: "", message: "" },
	});

	async function onSubmit(values: z.infer<typeof feedbackSchema>) {
		if (!user) return;
		setIsSubmitting(true);
		const success = await addFeedback(values.subject, values.message);
		if (success) {
			toast({
				title: "Feedback Submitted",
				description: "Thank you for your valuable feedback!",
			});
			form.reset();
		} else {
			toast({
				variant: "destructive",
				title: "Submission Failed",
				description: "Could not submit your feedback. Please try again.",
			});
		}
		setIsSubmitting(false);
	}

	const userFeedback = feedback
		.filter((f) => f.userId === user?.id)
		.sort(
			(a, b) =>
				new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
		);

	return (
		<div className="grid gap-8 md:grid-cols-2">
			<div className="flex flex-col gap-6">
				<div className="text-center">
					<h1 className="text-2xl font-bold md:text-3xl lg:text-4xl">
						Submit Feedback
					</h1>
					<p className="text-muted-foreground">
						We value your opinion. Let us know how we can improve.
					</p>
				</div>
				<Card>
					<CardContent className="p-6">
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-6"
							>
								<FormField
									control={form.control}
									name="subject"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Subject</FormLabel>
											<FormControl>
												<Input
													placeholder="e.g., Regarding lunch quality"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="message"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Message</FormLabel>
											<FormControl>
												<Textarea
													placeholder="Please provide details here..."
													className="min-h-[120px]"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button type="submit" disabled={isSubmitting}>
									{isSubmitting && (
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									)}
									Submit
								</Button>
							</form>
						</Form>
					</CardContent>
				</Card>
			</div>

			<div className="flex flex-col gap-6">
				<div className="text-center md:text-left">
					<h2 className="text-xl font-bold md:text-2xl lg:text-3xl">
						Your Past Feedback
					</h2>
					<p className="text-muted-foreground">
						A history of your submissions.
					</p>
				</div>
				<Card className="flex-1">
					<CardContent className="p-6 space-y-4">
						{userFeedback.length > 0 ? (
							userFeedback.map((f, index) => (
								<div key={f.id}>
									<div>
										<h3 className="font-semibold">{f.subject}</h3>
										<p className="text-sm text-muted-foreground">{f.message}</p>
										<p className="text-xs text-muted-foreground mt-2">
											{isClient ? (
												new Date(f.createdAt).toLocaleString()
											) : (
												<Skeleton className="h-3 w-32" />
											)}
										</p>
									</div>
									{index < userFeedback.length - 1 && (
										<Separator className="my-4" />
									)}
								</div>
							))
						) : (
							<p className="text-center text-muted-foreground pt-10">
								You haven&apos;t submitted any feedback yet.
							</p>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
