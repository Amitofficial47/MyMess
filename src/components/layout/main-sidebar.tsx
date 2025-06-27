"use client";

import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
	useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/auth-provider";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
	LayoutDashboard,
	BookOpenCheck,
	History,
	Receipt,
	Bell,
	MessageSquare,
	CreditCard,
	Users,
	Settings,
	Upload,
	User,
	ShieldCheck,
	UserCheck,
} from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

const studentNavItems = [
	{ href: "/student", icon: LayoutDashboard, label: "Dashboard" },
	{ href: "/profile", icon: User, label: "Profile" },
	{ href: "/student/menu", icon: BookOpenCheck, label: "Check Menu" },
	{ href: "/student/history", icon: History, label: "Meal History" },
	{ href: "/student/summary", icon: Receipt, label: "Monthly Summary" },
	{ href: "/student/notifications", icon: Bell, label: "Notifications" },
	{ href: "/student/bills", icon: Receipt, label: "Check Bill Status" },
	{ href: "/student/feedback", icon: MessageSquare, label: "Submit Feedback" },
	{ href: "/student/pay-bill", icon: CreditCard, label: "Pay Bill" },
];

const baseAdminNavItems = [
	{ href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
	{ href: "/profile", icon: User, label: "Profile" },
	{ href: "/admin/verify-students", icon: UserCheck, label: "Verify Students" },
	{ href: "/admin/student-details", icon: Users, label: "Student Details" },
	{ href: "/admin/menu", icon: Settings, label: "Edit Menu" },
	{ href: "/admin/history", icon: History, label: "Meal History" },
	{ href: "/admin/bills", icon: Upload, label: "Upload Bill" },
	{ href: "/admin/notifications", icon: Bell, label: "Add Notification" },
	{ href: "/admin/feedback", icon: MessageSquare, label: "View Feedback" },
];

export function MainSidebar() {
	const { user } = useAuth();
	const pathname = usePathname();
	const { isOpen, isMobile, setIsOpen } = useSidebar();

	let navItems = studentNavItems;
	if (user?.role === "admin") {
		navItems = baseAdminNavItems;
	} else if (user?.role === "superadmin") {
		navItems = [
			baseAdminNavItems[0], // Dashboard
			baseAdminNavItems[1], // Profile
			{
				href: "/admin/manage-admins",
				icon: ShieldCheck,
				label: "Manage Admins",
			},
			...baseAdminNavItems.slice(2),
		];
	}

	const bestMatchHref = navItems.reduce((acc, current) => {
		if (pathname.startsWith(current.href) && current.href.length > acc.length) {
			return current.href;
		}
		return acc;
	}, "");

	const showTooltip = !isOpen && !isMobile;

	const handleLinkClick = () => {
		if (isMobile) {
			setIsOpen(false);
		}
	};

	return (
		<Sidebar>
			<SidebarHeader>
				<div className="flex w-full items-center justify-between">
					<div className="flex items-center gap-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="h-8 w-8 text-primary"
						>
							<path d="M12 22a10 10 0 0 0 10-10H2a10 10 0 0 0 10 10Z" />
							<path d="M7 12a5 5 0 0 1 10 0" />
							<path d="M12 2v2" />
							<path d="m4.93 4.93 1.41 1.41" />
							<path d="m17.66 6.34 1.41-1.41" />
						</svg>
						<span className="text-xl font-semibold text-primary">MessMate</span>
					</div>
				</div>
			</SidebarHeader>
			<TooltipProvider delayDuration={0}>
				<SidebarContent className="p-2">
					<SidebarMenu>
						{navItems.map((item) => {
							const menuItemContent = (
								<Link
									href={item.href}
									className="w-full"
									onClick={handleLinkClick}
								>
									<SidebarMenuButton
										isActive={item.href === bestMatchHref}
										className="w-full"
									>
										<item.icon className="h-5 w-5" />
										<span>{item.label}</span>
									</SidebarMenuButton>
								</Link>
							);

							return (
								<SidebarMenuItem key={item.href}>
									{showTooltip ? (
										<Tooltip>
											<TooltipTrigger asChild>{menuItemContent}</TooltipTrigger>
											<TooltipContent side="right" sideOffset={5}>
												{item.label}
											</TooltipContent>
										</Tooltip>
									) : (
										menuItemContent
									)}
								</SidebarMenuItem>
							);
						})}
					</SidebarMenu>
				</SidebarContent>
			</TooltipProvider>
		</Sidebar>
	);
}
