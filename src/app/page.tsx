"use client";

import { useAuth } from "@/contexts/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2, Utensils, Zap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Footer } from "@/components/layout/footer";

export default function LandingPage() {
	const { user, loading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!loading && user) {
			if (user.role === "admin" || user.role === "superadmin") {
				router.push("/admin");
			} else {
				router.push("/student");
			}
		}
	}, [user, loading, router]);

	if (loading || user) {
		return (
			<div className="flex h-screen w-full items-center justify-center bg-background">
				<Loader2 className="h-12 w-12 animate-spin text-primary" />
			</div>
		);
	}

	return (
		<div className="flex flex-col min-h-screen bg-background">
			<header className="px-4 lg:px-6 h-16 flex items-center border-b">
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
				<nav className="ml-auto flex items-center gap-1">
					<div className="hidden items-center gap-1 sm:flex">
						<Link href="/login">
							<Button variant="ghost">Login</Button>
						</Link>
						<Link href="/signup">
							<Button>Sign Up</Button>
						</Link>
					</div>
					<ThemeToggle />
				</nav>
			</header>

			<main className="flex-1">
				<section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
					<div className="container px-4 md:px-6">
						<div className="grid items-center gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
							<div className="flex flex-col justify-center space-y-4 text-center lg:text-left">
								<div className="space-y-2">
									<h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
										Streamline Your Hostel Mess Experience
									</h1>
									<p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl lg:mx-0">
										MessMate is the all-in-one solution for managing hostel
										meals, tracking consumption, and simplifying billing for
										both students and administrators.
									</p>
								</div>
								<div className="flex flex-col gap-2 min-[400px]:flex-row justify-center lg:justify-start">
									<Link href="/signup">
										<Button size="lg">Get Started</Button>
									</Link>
									<Link href="/login">
										<Button variant="outline" size="lg">
											I have an account
										</Button>
									</Link>
								</div>
							</div>
							<Image
								src="/images/hero.png"
								width="600"
								height="400"
								alt="Hero image placeholder"
								className="mx-auto aspect-video overflow-hidden rounded-xl object-contain sm:w-full lg:order-last"
								data-ai-hint="communal meal"
							/>
						</div>
					</div>
				</section>

				<section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
					<div className="container px-4 md:px-6">
						<div className="flex flex-col items-center justify-center space-y-4 text-center">
							<div className="space-y-2">
								<div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">
									Key Features
								</div>
								<h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
									Everything You Need, Nothing You Don't
								</h2>
								<p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
									MessMate is packed with features designed to make mess
									management effortless for everyone involved.
								</p>
							</div>
						</div>
						<div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:gap-16 mt-12">
							<div className="grid gap-1 text-center items-center justify-items-center">
								<Utensils className="h-8 w-8 text-primary" />
								<h3 className="text-lg font-bold">Daily Meal Selection</h3>
								<p className="text-sm text-muted-foreground">
									Students can easily view the menu and select their meals for
									the day, generating a unique token for collection.
								</p>
							</div>
							<div className="grid gap-1 text-center items-center justify-items-center">
								<Zap className="h-8 w-8 text-primary" />
								<h3 className="text-lg font-bold">
									Instant Token Verification
								</h3>
								<p className="text-sm text-muted-foreground">
									Admins can instantly verify meal tokens at the counter,
									ensuring a smooth and quick process.
								</p>
							</div>
							<div className="grid gap-1 text-center items-center justify-items-center">
								<Users className="h-8 w-8 text-primary" />
								<h3 className="text-lg font-bold">Admin Management</h3>
								<p className="text-sm text-muted-foreground">
									A powerful dashboard for admins to manage menus, track
									consumption, upload bills, and send notifications.
								</p>
							</div>
						</div>
					</div>
				</section>
			</main>

			<Footer />
		</div>
	);
}
