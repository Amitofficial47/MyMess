// "use client";

// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
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
// 	CardDescription,
// 	CardHeader,
// 	CardTitle,
// } from "@/components/ui/card";
// import { useToast } from "@/hooks/use-toast";
// import { Loader2, Check, X } from "lucide-react";
// import { Skeleton } from "@/components/ui/skeleton";
// import {
// 	AlertDialog,
// 	AlertDialogAction,
// 	AlertDialogCancel,
// 	AlertDialogContent,
// 	AlertDialogDescription,
// 	AlertDialogFooter,
// 	AlertDialogHeader,
// 	AlertDialogTitle,
// 	AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import type { VerificationStatus } from "@/lib/types";

// type PendingStudent = {
// 	id: string;
// 	name: string;
// 	email: string;
// 	hostel: string;
// 	createdAt: string;
// 	enrollmentNumber: string | null;
// 	course: string | null;
// };

// export default function VerifyStudentsPage() {
// 	const [students, setStudents] = useState<PendingStudent[]>([]);
// 	const [isLoading, setIsLoading] = useState(true);
// 	const [isUpdating, setIsUpdating] = useState<string | null>(null); // Store the ID of the student being updated
// 	const { toast } = useToast();

// 	useEffect(() => {
// 		fetchPendingStudents();
// 	}, []);

// 	async function fetchPendingStudents() {
// 		setIsLoading(true);
// 		try {
// 			const res = await fetch("/api/verification");
// 			if (res.ok) {
// 				const data = await res.json();
// 				setStudents(data);
// 			} else {
// 				toast({
// 					variant: "destructive",
// 					title: "Failed to fetch pending students",
// 				});
// 			}
// 		} catch (error) {
// 			toast({
// 				variant: "destructive",
// 				title: "An error occurred while fetching students",
// 			});
// 		} finally {
// 			setIsLoading(false);
// 		}
// 	}

// 	async function handleUpdateStatus(id: string, status: VerificationStatus) {
// 		setIsUpdating(id);
// 		try {
// 			const res = await fetch(`/api/verification/${id}`, {
// 				method: "PATCH",
// 				headers: { "Content-Type": "application/json" },
// 				body: JSON.stringify({ status }),
// 			});
// 			if (res.ok) {
// 				toast({
// 					title: `Student ${status === "APPROVED" ? "Approved" : "Rejected"}`,
// 					description: "The student's status has been updated.",
// 				});
// 				setStudents((prev) => prev.filter((student) => student.id !== id));
// 			} else {
// 				const data = await res.json();
// 				toast({
// 					variant: "destructive",
// 					title: "Update Failed",
// 					description: data.error,
// 				});
// 			}
// 		} catch (error) {
// 			toast({ variant: "destructive", title: "An unexpected error occurred" });
// 		} finally {
// 			setIsUpdating(null);
// 		}
// 	}

// 	return (
// 		<div className="flex flex-col gap-6">
// 			<div className="text-center">
// 				<h1 className="text-2xl font-bold md:text-3xl lg:text-4xl">
// 					Verify Students
// 				</h1>
// 				<p className="text-muted-foreground">
// 					Approve or reject new student registration requests.
// 				</p>
// 			</div>
// 			<Card>
// 				<CardHeader>
// 					<CardTitle>Pending Requests</CardTitle>
// 					<CardDescription>
// 						The following students have registered and are awaiting verification
// 						for their respective hostels.
// 					</CardDescription>
// 				</CardHeader>
// 				<CardContent>
// 					<div className="rounded-lg border">
// 						<Table>
// 							<TableHeader>
// 								<TableRow>
// 									<TableHead>Student</TableHead>
// 									<TableHead>Enrollment No.</TableHead>
// 									<TableHead>Course</TableHead>
// 									<TableHead>Hostel</TableHead>
// 									<TableHead>Registered On</TableHead>
// 									<TableHead className="text-right">Actions</TableHead>
// 								</TableRow>
// 							</TableHeader>
// 							<TableBody>
// 								{isLoading ? (
// 									Array.from({ length: 3 }).map((_, i) => (
// 										<TableRow key={i}>
// 											<TableCell>
// 												<Skeleton className="h-5 w-32" />
// 											</TableCell>
// 											<TableCell>
// 												<Skeleton className="h-5 w-24" />
// 											</TableCell>
// 											<TableCell>
// 												<Skeleton className="h-5 w-20" />
// 											</TableCell>
// 											<TableCell>
// 												<Skeleton className="h-5 w-20" />
// 											</TableCell>
// 											<TableCell>
// 												<Skeleton className="h-5 w-24" />
// 											</TableCell>
// 											<TableCell className="text-right">
// 												<Skeleton className="h-8 w-24 ml-auto" />
// 											</TableCell>
// 										</TableRow>
// 									))
// 								) : students.length > 0 ? (
// 									students.map((student) => (
// 										<TableRow key={student.id}>
// 											<TableCell>
// 												<div className="font-medium">{student.name}</div>
// 												<div className="text-sm text-muted-foreground">
// 													{student.email}
// 												</div>
// 											</TableCell>
// 											<TableCell className="font-mono">
// 												{student.enrollmentNumber}
// 											</TableCell>
// 											<TableCell>{student.course}</TableCell>
// 											<TableCell>{student.hostel}</TableCell>
// 											<TableCell>
// 												{new Date(student.createdAt).toLocaleDateString()}
// 											</TableCell>
// 											<TableCell className="text-right">
// 												{isUpdating === student.id ? (
// 													<div className="flex justify-end">
// 														<Loader2 className="h-5 w-5 animate-spin" />
// 													</div>
// 												) : (
// 													<div className="flex gap-2 justify-end">
// 														<AlertDialog>
// 															<AlertDialogTrigger asChild>
// 																<Button
// 																	size="sm"
// 																	variant="outline"
// 																	className="text-green-600 border-green-600 hover:bg-green-600 hover:text-white"
// 																>
// 																	<Check className="mr-1 h-4 w-4" />
// 																	Approve
// 																</Button>
// 															</AlertDialogTrigger>
// 															<AlertDialogContent>
// 																<AlertDialogHeader>
// 																	<AlertDialogTitle>
// 																		Approve Student?
// 																	</AlertDialogTitle>
// 																	<AlertDialogDescription>
// 																		Are you sure you want to approve the
// 																		registration for {student.name}? They will
// 																		gain full access to the student portal.
// 																	</AlertDialogDescription>
// 																</AlertDialogHeader>
// 																<AlertDialogFooter>
// 																	<AlertDialogCancel>Cancel</AlertDialogCancel>
// 																	<AlertDialogAction
// 																		onClick={() =>
// 																			handleUpdateStatus(student.id, "APPROVED")
// 																		}
// 																		className="bg-green-600 hover:bg-green-700"
// 																	>
// 																		Approve
// 																	</AlertDialogAction>
// 																</AlertDialogFooter>
// 															</AlertDialogContent>
// 														</AlertDialog>
// 														<AlertDialog>
// 															<AlertDialogTrigger asChild>
// 																<Button size="sm" variant="destructive">
// 																	<X className="mr-1 h-4 w-4" />
// 																	Reject
// 																</Button>
// 															</AlertDialogTrigger>
// 															<AlertDialogContent>
// 																<AlertDialogHeader>
// 																	<AlertDialogTitle>
// 																		Reject Student?
// 																	</AlertDialogTitle>
// 																	<AlertDialogDescription>
// 																		This will reject the registration for{" "}
// 																		{student.name}. They will be notified that
// 																		their request was rejected. This action
// 																		can't be easily undone.
// 																	</AlertDialogDescription>
// 																</AlertDialogHeader>
// 																<AlertDialogFooter>
// 																	<AlertDialogCancel>Cancel</AlertDialogCancel>
// 																	<AlertDialogAction
// 																		onClick={() =>
// 																			handleUpdateStatus(student.id, "REJECTED")
// 																		}
// 																		className="bg-destructive hover:bg-destructive/90"
// 																	>
// 																		Reject
// 																	</AlertDialogAction>
// 																</AlertDialogFooter>
// 															</AlertDialogContent>
// 														</AlertDialog>
// 													</div>
// 												)}
// 											</TableCell>
// 										</TableRow>
// 									))
// 								) : (
// 									<TableRow>
// 										<TableCell colSpan={6} className="h-24 text-center">
// 											No pending student requests.
// 										</TableCell>
// 									</TableRow>
// 								)}
// 							</TableBody>
// 						</Table>
// 					</div>
// 				</CardContent>
// 			</Card>
// 		</div>
// 	);
// }

"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Loader2, Check, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
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
import type { VerificationStatus } from "@/lib/types";
import { fetchApi } from "@/lib/api";

type PendingStudent = {
	id: string;
	name: string;
	email: string;
	hostel: string;
	createdAt: string;
	enrollmentNumber: string | null;
	course: string | null;
};

export default function VerifyStudentsPage() {
	const [students, setStudents] = useState<PendingStudent[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isUpdating, setIsUpdating] = useState<string | null>(null); // Store the ID of the student being updated
	const { toast } = useToast();

	useEffect(() => {
		fetchPendingStudents();
	}, []);

	async function fetchPendingStudents() {
		setIsLoading(true);
		try {
			const res = await fetchApi("/api/verification");
			if (res.ok) {
				const data = await res.json();
				setStudents(data);
			} else {
				toast({
					variant: "destructive",
					title: "Failed to fetch pending students",
				});
			}
		} catch (error) {
			toast({
				variant: "destructive",
				title: "An error occurred while fetching students",
			});
		} finally {
			setIsLoading(false);
		}
	}

	async function handleUpdateStatus(id: string, status: VerificationStatus) {
		setIsUpdating(id);
		try {
			const res = await fetchApi(`/api/verification/${id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ status }),
			});
			if (res.ok) {
				toast({
					title: `Student ${status === "APPROVED" ? "Approved" : "Rejected"}`,
					description: "The student's status has been updated.",
				});
				setStudents((prev) => prev.filter((student) => student.id !== id));
			} else {
				const data = await res.json();
				toast({
					variant: "destructive",
					title: "Update Failed",
					description: data.error,
				});
			}
		} catch (error) {
			toast({ variant: "destructive", title: "An unexpected error occurred" });
		} finally {
			setIsUpdating(null);
		}
	}

	return (
		<div className="flex flex-col gap-6">
			<div className="text-center">
				<h1 className="text-2xl font-bold md:text-3xl lg:text-4xl">
					Verify Students
				</h1>
				<p className="text-muted-foreground">
					Approve or reject new student registration requests.
				</p>
			</div>
			<Card>
				<CardHeader>
					<CardTitle>Pending Requests</CardTitle>
					<CardDescription>
						The following students have registered and are awaiting verification
						for their respective hostels.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="rounded-lg border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Student</TableHead>
									<TableHead>Enrollment No.</TableHead>
									<TableHead>Course</TableHead>
									<TableHead>Hostel</TableHead>
									<TableHead>Registered On</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{isLoading ? (
									Array.from({ length: 3 }).map((_, i) => (
										<TableRow key={i}>
											<TableCell>
												<Skeleton className="h-5 w-32" />
											</TableCell>
											<TableCell>
												<Skeleton className="h-5 w-24" />
											</TableCell>
											<TableCell>
												<Skeleton className="h-5 w-20" />
											</TableCell>
											<TableCell>
												<Skeleton className="h-5 w-20" />
											</TableCell>
											<TableCell>
												<Skeleton className="h-5 w-24" />
											</TableCell>
											<TableCell className="text-right">
												<Skeleton className="h-8 w-24 ml-auto" />
											</TableCell>
										</TableRow>
									))
								) : students.length > 0 ? (
									students.map((student) => (
										<TableRow key={student.id}>
											<TableCell>
												<div className="font-medium">{student.name}</div>
												<div className="text-sm text-muted-foreground">
													{student.email}
												</div>
											</TableCell>
											<TableCell className="font-mono">
												{student.enrollmentNumber}
											</TableCell>
											<TableCell>{student.course}</TableCell>
											<TableCell>{student.hostel}</TableCell>
											<TableCell>
												{new Date(student.createdAt).toLocaleDateString()}
											</TableCell>
											<TableCell className="text-right">
												{isUpdating === student.id ? (
													<div className="flex justify-end">
														<Loader2 className="h-5 w-5 animate-spin" />
													</div>
												) : (
													<div className="flex gap-2 justify-end">
														<AlertDialog>
															<AlertDialogTrigger asChild>
																<Button
																	size="sm"
																	variant="outline"
																	className="text-green-600 border-green-600 hover:bg-green-600 hover:text-white"
																>
																	<Check className="mr-1 h-4 w-4" />
																	Approve
																</Button>
															</AlertDialogTrigger>
															<AlertDialogContent>
																<AlertDialogHeader>
																	<AlertDialogTitle>
																		Approve Student?
																	</AlertDialogTitle>
																	<AlertDialogDescription>
																		Are you sure you want to approve the
																		registration for {student.name}? They will
																		gain full access to the student portal.
																	</AlertDialogDescription>
																</AlertDialogHeader>
																<AlertDialogFooter>
																	<AlertDialogCancel>Cancel</AlertDialogCancel>
																	<AlertDialogAction
																		onClick={() =>
																			handleUpdateStatus(student.id, "APPROVED")
																		}
																		className="bg-green-600 hover:bg-green-700"
																	>
																		Approve
																	</AlertDialogAction>
																</AlertDialogFooter>
															</AlertDialogContent>
														</AlertDialog>
														<AlertDialog>
															<AlertDialogTrigger asChild>
																<Button size="sm" variant="destructive">
																	<X className="mr-1 h-4 w-4" />
																	Reject
																</Button>
															</AlertDialogTrigger>
															<AlertDialogContent>
																<AlertDialogHeader>
																	<AlertDialogTitle>
																		Reject Student?
																	</AlertDialogTitle>
																	<AlertDialogDescription>
																		This will reject the registration for{" "}
																		{student.name}. They will be notified that
																		their request was rejected. This action
																		can't be easily undone.
																	</AlertDialogDescription>
																</AlertDialogHeader>
																<AlertDialogFooter>
																	<AlertDialogCancel>Cancel</AlertDialogCancel>
																	<AlertDialogAction
																		onClick={() =>
																			handleUpdateStatus(student.id, "REJECTED")
																		}
																		className="bg-destructive hover:bg-destructive/90"
																	>
																		Reject
																	</AlertDialogAction>
																</AlertDialogFooter>
															</AlertDialogContent>
														</AlertDialog>
													</div>
												)}
											</TableCell>
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell colSpan={6} className="h-24 text-center">
											No pending student requests.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
