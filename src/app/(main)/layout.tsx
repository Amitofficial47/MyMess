"use client";

import { MainHeader } from "@/components/layout/main-header";
import { MainSidebar } from "@/components/layout/main-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/auth-provider";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { VerificationStatusCard } from "./components/verification-status-card";

export default function MainLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { user, loading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!loading && !user) {
			router.push("/login");
		}
	}, [user, loading, router]);

	if (loading || !user) {
		return (
			<div className="flex h-screen items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin" />
			</div>
		);
	}

	const isStudent = user.role === "student";
	const isVerified = user.status === "APPROVED";

	// If a student is not yet verified, show them the status page instead of any other page.
	if (isStudent && !isVerified) {
		return (
			<SidebarProvider>
				<MainSidebar />
				<SidebarInset className="flex h-screen flex-col overflow-hidden pt-14 md:pt-0">
					<MainHeader />
					<main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
						<VerificationStatusCard status={user.status} />
					</main>
				</SidebarInset>
			</SidebarProvider>
		);
	}

	return (
		<SidebarProvider>
			<MainSidebar />
			<SidebarInset className="flex h-screen flex-col overflow-hidden pt-14 md:pt-0">
				<MainHeader />
				<main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
					{children}
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
