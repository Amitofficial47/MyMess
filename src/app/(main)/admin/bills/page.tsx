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
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { useData } from "@/contexts/data-provider";
// import { useToast } from "@/hooks/use-toast";
// import { useState } from "react";
// import { Loader2, Trash2 } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// const billSchema = z.object({
//   month: z.string().min(1, "Please select a month."),
//   file: z.any().refine((files) => files?.length === 1, "File is required."),
// });

// const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// export default function UploadBillPage() {
//   const { bills, addBill, deleteBill } = useData();
//   const { toast } = useToast();
//   const [isUploading, setIsUploading] = useState(false);

//   const form = useForm<z.infer<typeof billSchema>>({
//     resolver: zodResolver(billSchema),
//   });

//   function onSubmit(values: z.infer<typeof billSchema>) {
//     setIsUploading(true);
//     const fileName = values.file[0].name;
//     addBill(fileName, values.month);
//     toast({
//       title: "Bill Uploaded",
//       description: `${fileName} for ${values.month} has been uploaded.`,
//     });
//     form.reset();
//     setIsUploading(false);
//   }

//   return (
//     <div className="grid gap-8 md:grid-cols-2">
//       <div className="flex flex-col gap-6">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold md:text-3xl">Upload Monthly Bill</h1>
//           <p className="text-muted-foreground">
//             Upload PDF/CSV files for student bills.
//           </p>
//         </div>
//         <Card>
//           <CardContent className="p-6">
//             <Form {...form}>
//               <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//                 <FormField
//                   control={form.control}
//                   name="month"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Month</FormLabel>
//                       <Select onValueChange={field.onChange} defaultValue={field.value}>
//                         <FormControl>
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select a month" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           {months.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="file"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Bill File</FormLabel>
//                       <FormControl>
//                         <Input type="file" accept=".pdf,.csv" onChange={e => field.onChange(e.target.files)} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <Button type="submit" disabled={isUploading}>
//                   {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//                   Upload Bill
//                 </Button>
//               </form>
//             </Form>
//           </CardContent>
//         </Card>
//       </div>

//       <div className="flex flex-col gap-6">
//         <div className="text-center md:text-left">
//           <h2 className="text-xl font-bold md:text-2xl">Uploaded Bills</h2>
//           <p className="text-muted-foreground">Manage previously uploaded bills.</p>
//         </div>
//         <Card className="flex-1">
//           <CardContent className="p-0">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Month</TableHead>
//                   <TableHead>File Name</TableHead>
//                   <TableHead className="text-right">Action</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {bills.length > 0 ? bills.map(bill => (
//                   <TableRow key={bill.id}>
//                     <TableCell className="font-medium">{bill.month}</TableCell>
//                     <TableCell>{bill.fileName}</TableCell>
//                     <TableCell className="text-right">
//                       <Button variant="ghost" size="icon" onClick={() => deleteBill(bill.id)}>
//                         <Trash2 className="h-4 w-4 text-destructive" />
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 )) : (
//                   <TableRow>
//                     <TableCell colSpan={3} className="h-24 text-center">No bills uploaded yet.</TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useData } from "@/contexts/data-provider";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

const billSchema = z.object({
	month: z.string().min(1, "Please select a month."),
	file: z.any().refine((files) => files?.length === 1, "File is required."),
});

const months = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

export default function UploadBillPage() {
	const { bills, addBill, deleteBill } = useData();
	const { toast } = useToast();
	const [isUploading, setIsUploading] = useState(false);

	const form = useForm<z.infer<typeof billSchema>>({
		resolver: zodResolver(billSchema),
	});

	async function onSubmit(values: z.infer<typeof billSchema>) {
		setIsUploading(true);
		const fileName = values.file[0].name;
		const success = await addBill(fileName, values.month);

		if (success) {
			toast({
				title: "Bill Uploaded",
				description: `${fileName} for ${values.month} has been uploaded.`,
			});
			form.reset({ month: "", file: null });
		} else {
			toast({
				variant: "destructive",
				title: "Upload Failed",
				description: "Could not upload the bill. Please try again.",
			});
		}
		setIsUploading(false);
	}

	async function handleDelete(id: string) {
		const success = await deleteBill(id);
		if (success) {
			toast({ title: "Bill Deleted" });
		} else {
			toast({ variant: "destructive", title: "Deletion Failed" });
		}
	}

	return (
		<div className="grid gap-8 md:grid-cols-2">
			<div className="flex flex-col gap-6">
				<div className="text-center">
					<h1 className="text-2xl font-bold md:text-3xl">
						Upload Monthly Bill
					</h1>
					<p className="text-muted-foreground">
						Upload PDF/CSV files for student bills.
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
									name="month"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Month</FormLabel>
											<Select
												onValueChange={field.onChange}
												value={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select a month" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{months.map((m) => (
														<SelectItem key={m} value={m}>
															{m}
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
									name="file"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Bill File</FormLabel>
											<FormControl>
												<Input
													type="file"
													accept=".pdf,.csv"
													onChange={(e) => field.onChange(e.target.files)}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button type="submit" disabled={isUploading}>
									{isUploading && (
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									)}
									Upload Bill
								</Button>
							</form>
						</Form>
					</CardContent>
				</Card>
			</div>

			<div className="flex flex-col gap-6">
				<div className="text-center md:text-left">
					<h2 className="text-xl font-bold md:text-2xl">Uploaded Bills</h2>
					<p className="text-muted-foreground">
						Manage previously uploaded bills.
					</p>
				</div>
				<Card className="flex-1">
					<CardContent className="p-0">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Month</TableHead>
									<TableHead>File Name</TableHead>
									<TableHead className="text-right">Action</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{bills.length > 0 ? (
									bills.map((bill) => (
										<TableRow key={bill.id}>
											<TableCell className="font-medium">
												{bill.month}
											</TableCell>
											<TableCell>{bill.fileName}</TableCell>
											<TableCell className="text-right">
												<Button
													variant="ghost"
													size="icon"
													onClick={() => handleDelete(bill.id)}
												>
													<Trash2 className="h-4 w-4 text-destructive" />
												</Button>
											</TableCell>
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell colSpan={3} className="h-24 text-center">
											No bills uploaded yet.
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
