"use client";

import { useData } from "@/contexts/data-provider";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
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
import {
	Loader2,
	Trash2,
	Edit,
	PlusCircle,
	ToggleLeft,
	ToggleRight,
} from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogFooter,
	DialogClose,
} from "@/components/ui/dialog";
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
import type { Addon } from "@/lib/types";

const addonSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters."),
	price: z.coerce.number().min(0, "Price cannot be negative."),
});

export default function ManageAddonsPage() {
	const { addons, addAddon, updateAddon, deleteAddon } = useData();
	const { toast } = useToast();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [editingAddon, setEditingAddon] = useState<Addon | null>(null);

	const form = useForm<z.infer<typeof addonSchema>>({
		resolver: zodResolver(addonSchema),
	});

	const handleOpenDialog = (addon: Addon | null = null) => {
		setEditingAddon(addon);
		if (addon) {
			form.reset({ name: addon.name, price: addon.price });
		} else {
			form.reset({ name: "", price: 0 });
		}
		setIsDialogOpen(true);
	};

	async function onSubmit(values: z.infer<typeof addonSchema>) {
		setIsSubmitting(true);
		let success = false;
		if (editingAddon) {
			const result = await updateAddon(editingAddon.id, values);
			if (result) {
				toast({ title: "Add-on Updated" });
				success = true;
			}
		} else {
			const result = await addAddon(values.name, values.price);
			if (result) {
				toast({ title: "Add-on Created" });
				success = true;
			}
		}

		if (!success) {
			toast({ variant: "destructive", title: "Operation Failed" });
		}
		setIsSubmitting(false);
		setIsDialogOpen(false);
	}

	async function handleDelete(id: string) {
		const success = await deleteAddon(id);
		if (success) {
			toast({ title: "Add-on Deleted" });
		} else {
			toast({ variant: "destructive", title: "Deletion Failed" });
		}
	}

	async function handleToggleAvailability(addon: Addon) {
		const success = await updateAddon(addon.id, {
			available: !addon.available,
		});
		if (success) {
			toast({ title: "Availability Updated" });
		} else {
			toast({ variant: "destructive", title: "Update Failed" });
		}
	}

	return (
		<div className="flex flex-col gap-6">
			<div className="text-center">
				<h1 className="text-2xl font-bold md:text-3xl lg:text-4xl">
					Manage Add-ons
				</h1>
				<p className="text-muted-foreground">
					Add, edit, or remove extra items students can order.
				</p>
			</div>

			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<Card>
					<CardHeader className="flex-row items-center justify-between">
						<div>
							<CardTitle>Available Add-on Items</CardTitle>
							<CardDescription>
								Items available for students to purchase.
							</CardDescription>
						</div>
						<DialogTrigger asChild>
							<Button onClick={() => handleOpenDialog()}>
								<PlusCircle className="mr-2 h-4 w-4" />
								Add New
							</Button>
						</DialogTrigger>
					</CardHeader>
					<CardContent>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Name</TableHead>
									<TableHead>Price</TableHead>
									<TableHead>Available</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{addons.length > 0 ? (
									addons.map((addon) => (
										<TableRow key={addon.id}>
											<TableCell className="font-medium">
												{addon.name}
											</TableCell>
											<TableCell>₹{addon.price.toFixed(2)}</TableCell>
											<TableCell>
												<Button
													variant="ghost"
													size="icon"
													onClick={() => handleToggleAvailability(addon)}
												>
													{addon.available ? (
														<ToggleRight className="h-6 w-6 text-primary" />
													) : (
														<ToggleLeft className="h-6 w-6 text-muted-foreground" />
													)}
												</Button>
											</TableCell>
											<TableCell className="text-right">
												<Button
													variant="ghost"
													size="icon"
													onClick={() => handleOpenDialog(addon)}
												>
													<Edit className="h-4 w-4" />
												</Button>
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
																This will permanently delete the "{addon.name}"
																add-on.
															</AlertDialogDescription>
														</AlertDialogHeader>
														<AlertDialogFooter>
															<AlertDialogCancel>Cancel</AlertDialogCancel>
															<AlertDialogAction
																onClick={() => handleDelete(addon.id)}
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
										<TableCell colSpan={4} className="h-24 text-center">
											No add-ons created yet.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</CardContent>
				</Card>

				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{editingAddon ? "Edit Add-on" : "Create New Add-on"}
						</DialogTitle>
					</DialogHeader>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-4 pt-4"
						>
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input placeholder="e.g., Curd" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="price"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Price</FormLabel>
										<FormControl>
											<Input
												type="number"
												step="0.5"
												placeholder="e.g., 10.00"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<DialogFooter>
								<DialogClose asChild>
									<Button variant="ghost">Cancel</Button>
								</DialogClose>
								<Button type="submit" disabled={isSubmitting}>
									{isSubmitting && (
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									)}
									{editingAddon ? "Save Changes" : "Create Add-on"}
								</Button>
							</DialogFooter>
						</form>
					</Form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
