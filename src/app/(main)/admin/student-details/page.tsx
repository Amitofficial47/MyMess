// "use client";

// import { useEffect, useMemo, useState } from "react";
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
// import {
// 	Loader2,
// 	User,
// 	Mail,
// 	University,
// 	Library,
// 	Home,
// 	Calendar,
// } from "lucide-react";
// import { Skeleton } from "@/components/ui/skeleton";
// import { useAuth } from "@/contexts/auth-provider";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { useIsMobile } from "@/hooks/use-mobile";
// import {
// 	Select,
// 	SelectContent,
// 	SelectItem,
// 	SelectTrigger,
// 	SelectValue,
// } from "@/components/ui/select";
// import { Label } from "@/components/ui/label";

// const hostels = [
// 	"All Hostels",
// 	"Ganga",
// 	"Yamuna",
// 	"Saraswati",
// 	"Godavari",
// 	"Kaveri",
// ];

// type Student = {
// 	id: string;
// 	name: string;
// 	email: string;
// 	hostel: string;
// 	enrollmentNumber: string | null;
// 	course: string | null;
// 	createdAt: string;
// 	avatar: string | null;
// };

// export default function StudentDetailsPage() {
// 	const { user } = useAuth();
// 	const isMobile = useIsMobile();
// 	const { toast } = useToast();

// 	const [students, setStudents] = useState<Student[]>([]);
// 	const [isLoading, setIsLoading] = useState(true);
// 	const [selectedHostel, setSelectedHostel] = useState<string>(hostels[0]);

// 	useEffect(() => {
// 		async function fetchStudents() {
// 			setIsLoading(true);
// 			try {
// 				const res = await fetch("/api/students");
// 				if (res.ok) {
// 					const data = await res.json();
// 					setStudents(data);
// 				} else {
// 					toast({ variant: "destructive", title: "Failed to fetch students" });
// 				}
// 			} catch (error) {
// 				toast({
// 					variant: "destructive",
// 					title: "An error occurred while fetching students",
// 				});
// 			} finally {
// 				setIsLoading(false);
// 			}
// 		}
// 		fetchStudents();
// 	}, [toast]);

// 	const filteredStudents = useMemo(() => {
// 		if (user?.role !== "superadmin" || selectedHostel === "All Hostels") {
// 			return students;
// 		}
// 		return students.filter((s) => s.hostel === selectedHostel);
// 	}, [students, selectedHostel, user?.role]);

// 	const getInitials = (name: string) =>
// 		name
// 			.split(" ")
// 			.map((n) => n[0])
// 			.slice(0, 2)
// 			.join("");

// 	return (
// 		<div className="flex flex-col gap-6">
// 			<div className="text-center">
// 				<h1 className="text-2xl font-bold md:text-3xl lg:text-4xl">
// 					Student Details
// 				</h1>
// 				<p className="text-muted-foreground">
// 					A list of all approved students.
// 				</p>
// 			</div>

// 			<Card>
// 				<CardHeader>
// 					<CardTitle>
// 						{user?.role === "superadmin"
// 							? "Filter Students"
// 							: `Students in ${user?.hostel} Hostel`}
// 					</CardTitle>
// 					<CardDescription>
// 						{user?.role === "superadmin"
// 							? "Select a hostel to view its students."
// 							: `Total approved students: ${filteredStudents.length}`}
// 					</CardDescription>
// 				</CardHeader>
// 				{user?.role === "superadmin" && (
// 					<CardContent>
// 						<div className="grid gap-4 md:grid-cols-3">
// 							<div className="grid gap-2">
// 								<Label htmlFor="hostel-filter">Hostel</Label>
// 								<Select
// 									value={selectedHostel}
// 									onValueChange={setSelectedHostel}
// 								>
// 									<SelectTrigger id="hostel-filter">
// 										<SelectValue placeholder="Select Hostel" />
// 									</SelectTrigger>
// 									<SelectContent>
// 										{hostels.map((h) => (
// 											<SelectItem key={h} value={h}>
// 												{h}
// 											</SelectItem>
// 										))}
// 									</SelectContent>
// 								</Select>
// 							</div>
// 							<div className="flex items-end">
// 								<p className="text-sm text-muted-foreground">
// 									Showing {filteredStudents.length} of {students.length}{" "}
// 									students.
// 								</p>
// 							</div>
// 						</div>
// 					</CardContent>
// 				)}
// 			</Card>

// 			{isLoading ? (
// 				<div className="flex items-center justify-center p-10">
// 					<Loader2 className="h-8 w-8 animate-spin text-primary" />
// 				</div>
// 			) : (
// 				<>
// 					{/* Desktop Table View */}
// 					{!isMobile && (
// 						<div className="rounded-lg border">
// 							<Table>
// 								<TableHeader>
// 									<TableRow>
// 										<TableHead>Student</TableHead>
// 										<TableHead>Enrollment No.</TableHead>
// 										<TableHead>Course</TableHead>
// 										{user?.role === "superadmin" && (
// 											<TableHead>Hostel</TableHead>
// 										)}
// 										<TableHead>Registered On</TableHead>
// 									</TableRow>
// 								</TableHeader>
// 								<TableBody>
// 									{filteredStudents.length > 0 ? (
// 										filteredStudents.map((student) => (
// 											<TableRow key={student.id}>
// 												<TableCell>
// 													<div className="flex items-center gap-3">
// 														<Avatar>
// 															<AvatarImage src={student.avatar || undefined} />
// 															<AvatarFallback>
// 																{getInitials(student.name)}
// 															</AvatarFallback>
// 														</Avatar>
// 														<div>
// 															<div className="font-medium">{student.name}</div>
// 															<div className="text-sm text-muted-foreground">
// 																{student.email}
// 															</div>
// 														</div>
// 													</div>
// 												</TableCell>
// 												<TableCell className="font-mono">
// 													{student.enrollmentNumber}
// 												</TableCell>
// 												<TableCell>{student.course}</TableCell>
// 												{user?.role === "superadmin" && (
// 													<TableCell>{student.hostel}</TableCell>
// 												)}
// 												<TableCell>
// 													{new Date(student.createdAt).toLocaleDateString()}
// 												</TableCell>
// 											</TableRow>
// 										))
// 									) : (
// 										<TableRow>
// 											<TableCell
// 												colSpan={user?.role === "superadmin" ? 5 : 4}
// 												className="h-24 text-center"
// 											>
// 												No approved students found for the selected criteria.
// 											</TableCell>
// 										</TableRow>
// 									)}
// 								</TableBody>
// 							</Table>
// 						</div>
// 					)}

// 					{/* Mobile Card View */}
// 					{isMobile && (
// 						<div className="space-y-4">
// 							{filteredStudents.length > 0 ? (
// 								filteredStudents.map((student) => (
// 									<Card key={student.id}>
// 										<CardHeader>
// 											<div className="flex items-center gap-4">
// 												<Avatar className="h-12 w-12">
// 													<AvatarImage src={student.avatar || undefined} />
// 													<AvatarFallback>
// 														{getInitials(student.name)}
// 													</AvatarFallback>
// 												</Avatar>
// 												<div>
// 													<CardTitle className="text-lg">
// 														{student.name}
// 													</CardTitle>
// 													<CardDescription className="flex items-center gap-2">
// 														<Mail className="h-3 w-3" /> {student.email}
// 													</CardDescription>
// 												</div>
// 											</div>
// 										</CardHeader>
// 										<CardContent className="space-y-2 text-sm">
// 											<div className="flex items-center gap-2 text-muted-foreground">
// 												<University className="h-4 w-4" />
// 												<span>{student.enrollmentNumber}</span>
// 											</div>
// 											<div className="flex items-center gap-2 text-muted-foreground">
// 												<Library className="h-4 w-4" />
// 												<span>{student.course}</span>
// 											</div>
// 											<div className="flex items-center gap-2 text-muted-foreground">
// 												<Home className="h-4 w-4" />
// 												<span>{student.hostel}</span>
// 											</div>
// 											<div className="flex items-center gap-2 text-muted-foreground">
// 												<Calendar className="h-4 w-4" />
// 												<span>
// 													Registered on{" "}
// 													{new Date(student.createdAt).toLocaleDateString()}
// 												</span>
// 											</div>
// 										</CardContent>
// 									</Card>
// 								))
// 							) : (
// 								<Card>
// 									<CardContent className="p-10 text-center text-muted-foreground">
// 										No approved students found for the selected criteria.
// 									</CardContent>
// 								</Card>
// 							)}
// 						</div>
// 					)}
// 				</>
// 			)}
// 		</div>
// 	);
// }

"use client";

import { useEffect, useMemo, useState } from "react";
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
import {
	Loader2,
	User,
	Mail,
	University,
	Library,
	Home,
	Calendar,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/auth-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { hostelNames } from "@/lib/hostels";

const superAdminHostelOptions = ["All Hostels", ...hostelNames];

type Student = {
	id: string;
	name: string;
	email: string;
	hostel: string;
	enrollmentNumber: string | null;
	course: string | null;
	createdAt: string;
	avatar: string | null;
};

export default function StudentDetailsPage() {
	const { user } = useAuth();
	const isMobile = useIsMobile();
	const { toast } = useToast();

	const [students, setStudents] = useState<Student[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedHostel, setSelectedHostel] = useState<string>(
		superAdminHostelOptions[0]
	);

	useEffect(() => {
		async function fetchStudents() {
			setIsLoading(true);
			try {
				const res = await fetch("/api/students");
				if (res.ok) {
					const data = await res.json();
					setStudents(data);
				} else {
					toast({ variant: "destructive", title: "Failed to fetch students" });
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
		fetchStudents();
	}, [toast]);

	const filteredStudents = useMemo(() => {
		if (user?.role !== "superadmin" || selectedHostel === "All Hostels") {
			return students;
		}
		return students.filter((s) => s.hostel === selectedHostel);
	}, [students, selectedHostel, user?.role]);

	const getInitials = (name: string) =>
		name
			.split(" ")
			.map((n) => n[0])
			.slice(0, 2)
			.join("");

	return (
		<div className="flex flex-col gap-6">
			<div className="text-center">
				<h1 className="text-2xl font-bold md:text-3xl lg:text-4xl">
					Student Details
				</h1>
				<p className="text-muted-foreground">
					A list of all approved students.
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>
						{user?.role === "superadmin"
							? "Filter Students"
							: `Students in ${user?.hostel} Hostel`}
					</CardTitle>
					<CardDescription>
						{user?.role === "superadmin"
							? "Select a hostel to view its students."
							: `Total approved students: ${filteredStudents.length}`}
					</CardDescription>
				</CardHeader>
				{user?.role === "superadmin" && (
					<CardContent>
						<div className="grid gap-4 md:grid-cols-3">
							<div className="grid gap-2">
								<Label htmlFor="hostel-filter">Hostel</Label>
								<Select
									value={selectedHostel}
									onValueChange={setSelectedHostel}
								>
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
							<div className="flex items-end">
								<p className="text-sm text-muted-foreground">
									Showing {filteredStudents.length} of {students.length}{" "}
									students.
								</p>
							</div>
						</div>
					</CardContent>
				)}
			</Card>

			{isLoading ? (
				<div className="flex items-center justify-center p-10">
					<Loader2 className="h-8 w-8 animate-spin text-primary" />
				</div>
			) : (
				<>
					{/* Desktop Table View */}
					{!isMobile && (
						<div className="rounded-lg border">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Student</TableHead>
										<TableHead>Enrollment No.</TableHead>
										<TableHead>Course</TableHead>
										{user?.role === "superadmin" && (
											<TableHead>Hostel</TableHead>
										)}
										<TableHead>Registered On</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredStudents.length > 0 ? (
										filteredStudents.map((student) => (
											<TableRow key={student.id}>
												<TableCell>
													<div className="flex items-center gap-3">
														<Avatar>
															<AvatarImage src={student.avatar || undefined} />
															<AvatarFallback>
																{getInitials(student.name)}
															</AvatarFallback>
														</Avatar>
														<div>
															<div className="font-medium">{student.name}</div>
															<div className="text-sm text-muted-foreground">
																{student.email}
															</div>
														</div>
													</div>
												</TableCell>
												<TableCell className="font-mono">
													{student.enrollmentNumber}
												</TableCell>
												<TableCell>{student.course}</TableCell>
												{user?.role === "superadmin" && (
													<TableCell>{student.hostel}</TableCell>
												)}
												<TableCell>
													{new Date(student.createdAt).toLocaleDateString()}
												</TableCell>
											</TableRow>
										))
									) : (
										<TableRow>
											<TableCell
												colSpan={user?.role === "superadmin" ? 5 : 4}
												className="h-24 text-center"
											>
												No approved students found for the selected criteria.
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</div>
					)}

					{/* Mobile Card View */}
					{isMobile && (
						<div className="space-y-4">
							{filteredStudents.length > 0 ? (
								filteredStudents.map((student) => (
									<Card key={student.id}>
										<CardHeader>
											<div className="flex items-center gap-4">
												<Avatar className="h-12 w-12">
													<AvatarImage src={student.avatar || undefined} />
													<AvatarFallback>
														{getInitials(student.name)}
													</AvatarFallback>
												</Avatar>
												<div>
													<CardTitle className="text-lg">
														{student.name}
													</CardTitle>
													<CardDescription className="flex items-center gap-2">
														<Mail className="h-3 w-3" /> {student.email}
													</CardDescription>
												</div>
											</div>
										</CardHeader>
										<CardContent className="space-y-2 text-sm">
											<div className="flex items-center gap-2 text-muted-foreground">
												<University className="h-4 w-4" />
												<span>{student.enrollmentNumber}</span>
											</div>
											<div className="flex items-center gap-2 text-muted-foreground">
												<Library className="h-4 w-4" />
												<span>{student.course}</span>
											</div>
											<div className="flex items-center gap-2 text-muted-foreground">
												<Home className="h-4 w-4" />
												<span>{student.hostel}</span>
											</div>
											<div className="flex items-center gap-2 text-muted-foreground">
												<Calendar className="h-4 w-4" />
												<span>
													Registered on{" "}
													{new Date(student.createdAt).toLocaleDateString()}
												</span>
											</div>
										</CardContent>
									</Card>
								))
							) : (
								<Card>
									<CardContent className="p-10 text-center text-muted-foreground">
										No approved students found for the selected criteria.
									</CardContent>
								</Card>
							)}
						</div>
					)}
				</>
			)}
		</div>
	);
}
