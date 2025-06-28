// "use client";

// import { useAuth } from "@/contexts/auth-provider";
// import { useRouter } from "next/navigation";
// import React, { useEffect } from "react";
// import {
// 	Loader2,
// 	Utensils,
// 	Zap,
// 	Users,
// 	UserCheck,
// 	KeyRound,
// 	ListChecks,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";
// import Image from "next/image";
// import { ThemeToggle } from "@/components/layout/theme-toggle";
// import { Footer } from "@/components/layout/footer";
// import { cn } from "@/lib/utils";
// import { Card, CardContent } from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// export default function LandingPage() {
// 	const { user, loading } = useAuth();
// 	const router = useRouter();

// 	useEffect(() => {
// 		if (!loading && user) {
// 			if (
// 				user.role === "admin" ||
// 				user.role === "superadmin" ||
// 				user.role === "messadmin"
// 			) {
// 				router.push("/admin");
// 			} else {
// 				router.push("/student");
// 			}
// 		}
// 	}, [user, loading, router]);

// 	if (loading || user) {
// 		return (
// 			<div className="flex h-screen w-full items-center justify-center bg-background">
// 				<Loader2 className="h-12 w-12 animate-spin text-primary" />
// 			</div>
// 		);
// 	}

// 	return (
// 		<div className="flex min-h-dvh flex-col bg-background">
// 			<header className="px-4 lg:px-6 h-16 flex items-center border-b sticky top-0 z-50 bg-background/95 backdrop-blur-sm">
// 				<div className="flex items-center gap-2">
// 					<svg
// 						xmlns="http://www.w3.org/2000/svg"
// 						viewBox="0 0 24 24"
// 						fill="none"
// 						stroke="currentColor"
// 						strokeWidth="2"
// 						strokeLinecap="round"
// 						strokeLinejoin="round"
// 						className="h-8 w-8 text-primary"
// 					>
// 						<path d="M12 22a10 10 0 0 0 10-10H2a10 10 0 0 0 10 10Z" />
// 						<path d="M7 12a5 5 0 0 1 10 0" />
// 						<path d="M12 2v2" />
// 						<path d="m4.93 4.93 1.41 1.41" />
// 						<path d="m17.66 6.34 1.41-1.41" />
// 					</svg>
// 					<span className="text-xl font-semibold text-primary">MyMess</span>
// 				</div>
// 				<nav className="ml-auto flex items-center gap-4">
// 					<div className="hidden items-center gap-1 sm:flex">
// 						<Link href="/login">
// 							<Button variant="ghost">Login</Button>
// 						</Link>
// 						<Link href="/signup">
// 							<Button>Sign Up</Button>
// 						</Link>
// 					</div>
// 					<ThemeToggle />
// 				</nav>
// 			</header>

// 			<main className="flex-1">
// 				<section className="w-full py-20 md:py-32 lg:py-40">
// 					<div className="container px-4 md:px-6 grid lg:grid-cols-2 gap-12 items-center">
// 						<div className="flex flex-col items-center lg:items-start space-y-6 text-center lg:text-left">
// 							<div className="space-y-4">
// 								<h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-green-400 to-primary">
// 									The Future of Hostel Dining is Here.
// 								</h1>
// 								<p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
// 									MyMess is the all-in-one digital platform for managing hostel
// 									meals, tracking consumption, and simplifying billing.
// 									Effortless for students, powerful for admins.
// 								</p>
// 							</div>
// 							<div className="flex flex-col gap-2 min-[400px]:flex-row">
// 								<Link href="/signup">
// 									<Button
// 										size="lg"
// 										className="bg-primary/90 hover:bg-primary shadow-lg shadow-primary/20"
// 									>
// 										Get Started for Free
// 									</Button>
// 								</Link>
// 								<Link href="/login">
// 									<Button variant="outline" size="lg">
// 										I have an account
// 									</Button>
// 								</Link>
// 							</div>
// 						</div>
// 						<div className="mx-auto overflow-hidden rounded-xl">
// 							<Image
// 								src="/images/hero2.png"
// 								width="1202"
// 								height="780"
// 								alt="MyMess Dashboard Showcase"
// 								className="h-auto w-full rounded-md"
// 								data-ai-hint="hostel mess management dashboard"
// 							/>
// 						</div>
// 					</div>
// 				</section>

// 				<section
// 					id="features"
// 					className="w-full py-12 md:py-24 lg:py-32 bg-muted"
// 				>
// 					<div className="container px-4 md:px-6">
// 						<div className="flex flex-col items-center justify-center space-y-4 text-center">
// 							<div className="space-y-2">
// 								<div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm font-semibold text-primary">
// 									Key Features
// 								</div>
// 								<h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
// 									Why MyMess?
// 								</h2>
// 								<p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
// 									MyMess is packed with features designed to make mess
// 									management effortless for everyone involved.
// 								</p>
// 							</div>
// 						</div>
// 						<div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:gap-16 mt-12">
// 							<FeatureCard
// 								icon={ListChecks}
// 								title="Daily Meal Selection"
// 								description="Students easily view the menu and select their meals for the day, generating a unique token for collection."
// 							/>
// 							<FeatureCard
// 								icon={Zap}
// 								title="Instant Token Verification"
// 								description="Mess admins instantly verify meal tokens at the counter with a quick code entry, ensuring a smooth and queue-free process."
// 							/>
// 							<FeatureCard
// 								icon={Users}
// 								title="Powerful Admin Controls"
// 								description="A comprehensive dashboard for admins to manage menus, verify students, track meal history, upload bills, and send notifications."
// 							/>
// 						</div>
// 					</div>
// 				</section>

// 				<section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
// 					<div className="container px-4 md:px-6">
// 						<div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
// 							<h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
// 								How It Works
// 							</h2>
// 							<p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
// 								A seamless experience from start to finish.
// 							</p>
// 						</div>
// 						<div className="relative">
// 							<div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2"></div>
// 							<div className="grid gap-12 md:grid-cols-4 md:gap-8 relative">
// 								<HowItWorksStep
// 									number="1"
// 									icon={UserCheck}
// 									title="Sign Up & Verification"
// 									description="Students create an account. Hostel admins quickly verify and approve new registrations."
// 								/>
// 								<HowItWorksStep
// 									number="2"
// 									icon={ListChecks}
// 									title="Select Your Meal"
// 									description="Browse the daily menu and select your breakfast, lunch, or dinner with a single click."
// 								/>
// 								<HowItWorksStep
// 									number="3"
// 									icon={KeyRound}
// 									title="Get Your Token"
// 									description="Instantly receive a unique, non-transferable token for your selected meal."
// 								/>
// 								<HowItWorksStep
// 									number="4"
// 									icon={Utensils}
// 									title="Enjoy Your Meal"
// 									description="Show your token to the mess admin for verification and enjoy your hassle-free meal."
// 								/>
// 							</div>
// 						</div>
// 					</div>
// 				</section>

// 				<section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
// 					<div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
// 						<div className="space-y-3">
// 							<h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
// 								Loved by Students and Admins Alike
// 							</h2>
// 							<p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
// 								See what people are saying about how MyMess has transformed
// 								their hostel experience.
// 							</p>
// 						</div>
// 						<div className="grid w-full grid-cols-1 md:grid-cols-3 gap-6 pt-8">
// 							<TestimonialCard
// 								quote="Finally, no more morning rush to sign a register. I can choose my meal from my room. MyMess is a game-changer!"
// 								name="Priya Sharma"
// 								role="Student, Gargi Girls Hostel"
// 								avatarSrc="https://placehold.co/100x100.png"
// 								data-ai-hint="female student"
// 							/>
// 							<TestimonialCard
// 								quote="Managing student verification and meal history used to be a nightmare of paperwork. Now it's all just a few clicks away. I have so much more time for other tasks."
// 								name="Rajesh Kumar"
// 								role="Admin, Tagore Boys Hostel"
// 								avatarSrc="https://placehold.co/100x100.png"
// 								data-ai-hint="male admin"
// 							/>
// 							<TestimonialCard
// 								quote="Verifying tokens is so fast! The queue at the counter has practically disappeared. The students are happier, and so are we."
// 								name="Sunita Devi"
// 								role="Mess Admin, Iravati Hostel"
// 								avatarSrc="https://placehold.co/100x100.png"
// 								data-ai-hint="female mess staff"
// 							/>
// 						</div>
// 					</div>
// 				</section>

// 				<section className="w-full py-12 md:py-24 lg:py-32">
// 					<div className="container px-4 md:px-6">
// 						<div className="mx-auto max-w-3xl text-center">
// 							<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
// 								Ready to Get Started?
// 							</h2>
// 							<p className="mt-4 text-muted-foreground md:text-xl">
// 								Join the MyMess revolution and bring your hostel's dining
// 								management into the 21st century.
// 							</p>
// 							<div className="mt-6">
// 								<Link href="/signup">
// 									<Button
// 										size="lg"
// 										className="bg-primary/90 hover:bg-primary shadow-lg shadow-primary/20"
// 									>
// 										Create Your Student Account
// 									</Button>
// 								</Link>
// 							</div>
// 						</div>
// 					</div>
// 				</section>
// 			</main>

// 			<Footer />
// 		</div>
// 	);
// }

// const FeatureCard = ({
// 	icon: Icon,
// 	title,
// 	description,
// }: {
// 	icon: React.ElementType;
// 	title: string;
// 	description: string;
// }) => (
// 	<div className="grid gap-2 text-center items-center justify-items-center p-4 rounded-lg transition-all duration-300 hover:bg-card hover:shadow-lg">
// 		<div className="bg-primary/10 p-3 rounded-full">
// 			<Icon className="h-8 w-8 text-primary" />
// 		</div>
// 		<h3 className="text-xl font-bold">{title}</h3>
// 		<p className="text-sm text-muted-foreground">{description}</p>
// 	</div>
// );

// const HowItWorksStep = ({
// 	number,
// 	icon: Icon,
// 	title,
// 	description,
// }: {
// 	number: string;
// 	icon: React.ElementType;
// 	title: string;
// 	description: string;
// }) => (
// 	<div className="flex flex-col items-center text-center gap-4 bg-card p-6 rounded-lg shadow-sm">
// 		<div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-xl mb-4">
// 			{number}
// 		</div>
// 		<Icon className="h-10 w-10 text-primary" />
// 		<h3 className="text-lg font-semibold">{title}</h3>
// 		<p className="text-sm text-muted-foreground">{description}</p>
// 	</div>
// );

// const TestimonialCard = ({
// 	quote,
// 	name,
// 	role,
// 	avatarSrc,
// 	...props
// }: {
// 	quote: string;
// 	name: string;
// 	role: string;
// 	avatarSrc: string;
// 	"data-ai-hint": string;
// }) => (
// 	<Card className="p-6 text-center">
// 		<CardContent className="p-0 flex flex-col items-center gap-4">
// 			<p className="text-muted-foreground italic">&ldquo;{quote}&rdquo;</p>
// 			<div className="flex flex-col items-center gap-2">
// 				<Avatar>
// 					<AvatarImage src={avatarSrc} alt={name} {...props} />
// 					<AvatarFallback>
// 						{name
// 							.split(" ")
// 							.map((n) => n[0])
// 							.join("")}
// 					</AvatarFallback>
// 				</Avatar>
// 				<div>
// 					<p className="font-semibold">{name}</p>
// 					<p className="text-sm text-muted-foreground">{role}</p>
// 				</div>
// 			</div>
// 		</CardContent>
// 	</Card>
// );

"use client";

import { useAuth } from "@/contexts/auth-provider";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import {
	Loader2,
	Utensils,
	Zap,
	Users,
	UserCheck,
	KeyRound,
	ListChecks,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Footer } from "@/components/layout/footer";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function LandingPage() {
	const { user, loading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!loading && user) {
			if (
				user.role === "admin" ||
				user.role === "superadmin" ||
				user.role === "messadmin"
			) {
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
		<div className="flex min-h-dvh flex-col bg-background">
			<header className="px-4 lg:px-6 h-16 flex items-center border-b sticky top-0 z-50 bg-background/95 backdrop-blur-sm">
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
					<span className="text-xl font-semibold text-primary">MyMess</span>
				</div>
				<nav className="ml-auto flex items-center gap-4">
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
				<section className="w-full py-20 md:py-32 lg:py-40">
					<div className="container px-4 md:px-6 grid lg:grid-cols-2 gap-12 items-center">
						<div className="flex flex-col items-center lg:items-start space-y-6 text-center lg:text-left">
							<div className="space-y-4">
								<h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/tight bg-clip-text text-transparent bg-primary-gradient">
									The Future of Hostel Dining is Here.
								</h1>
								<p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
									MyMess is the all-in-one digital platform for managing hostel
									meals, tracking consumption, and simplifying billing.
									Effortless for students, powerful for admins.
								</p>
							</div>
							<div className="flex flex-col gap-2 min-[400px]:flex-row">
								<Link href="/signup">
									<Button size="lg" className="shadow-lg shadow-primary/20">
										Get Started for Free
									</Button>
								</Link>
								<Link href="/login">
									<Button variant="outline" size="lg">
										I have an account
									</Button>
								</Link>
							</div>
						</div>
						<div className="relative mx-auto overflow-hidden rounded-xl">
							<Image
								src="/images/hero2.png"
								width={1202}
								height={780}
								alt="MyMess Dashboard Showcase"
								className="h-auto w-full rounded-md object-cover"
								data-ai-hint="hostel mess management dashboard"
							/>
						</div>
					</div>
				</section>

				<section
					id="features"
					className="w-full py-12 md:py-24 lg:py-32 bg-muted"
				>
					<div className="container px-4 md:px-6">
						<div className="flex flex-col items-center justify-center space-y-4 text-center">
							<div className="space-y-2">
								<div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm font-semibold text-primary">
									Key Features
								</div>
								<h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
									Why MyMess?
								</h2>
								<p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
									MyMess is packed with features designed to make mess
									management effortless for everyone involved.
								</p>
							</div>
						</div>
						<div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:gap-16 mt-12">
							<FeatureCard
								icon={ListChecks}
								title="Daily Meal Selection"
								description="Students easily view the menu and select their meals for the day, generating a unique token for collection."
							/>
							<FeatureCard
								icon={Zap}
								title="Instant Token Verification"
								description="Mess admins instantly verify meal tokens at the counter with a quick code entry, ensuring a smooth and queue-free process."
							/>
							<FeatureCard
								icon={Users}
								title="Powerful Admin Controls"
								description="A comprehensive dashboard for admins to manage menus, verify students, track meal history, upload bills, and send notifications."
							/>
						</div>
					</div>
				</section>

				<section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
					<div className="container px-4 md:px-6">
						<div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
							<h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
								How It Works
							</h2>
							<p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
								A seamless experience from start to finish.
							</p>
						</div>
						<div className="relative">
							<div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2"></div>
							<div className="grid gap-12 md:grid-cols-4 md:gap-8 relative">
								<HowItWorksStep
									number="1"
									icon={UserCheck}
									title="Sign Up & Verification"
									description="Students create an account. Hostel admins quickly verify and approve new registrations."
								/>
								<HowItWorksStep
									number="2"
									icon={ListChecks}
									title="Select Your Meal"
									description="Browse the daily menu and select your breakfast, lunch, or dinner with a single click."
								/>
								<HowItWorksStep
									number="3"
									icon={KeyRound}
									title="Get Your Token"
									description="Instantly receive a unique, non-transferable token for your selected meal."
								/>
								<HowItWorksStep
									number="4"
									icon={Utensils}
									title="Enjoy Your Meal"
									description="Show your token to the mess admin for verification and enjoy your hassle-free meal."
								/>
							</div>
						</div>
					</div>
				</section>

				<section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
					<div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
						<div className="space-y-3">
							<h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
								Loved by Students and Admins Alike
							</h2>
							<p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
								See what people are saying about how MyMess has transformed
								their hostel experience.
							</p>
						</div>
						<div className="grid w-full grid-cols-1 md:grid-cols-3 gap-6 pt-8">
							<TestimonialCard
								quote="Finally, no more morning rush to sign a register. I can choose my meal from my room. MyMess is a game-changer!"
								name="Priya Sharma"
								role="Student, Gargi Girls Hostel"
								avatarSrc="https://placehold.co/100x100.png"
								data-ai-hint="female student"
							/>
							<TestimonialCard
								quote="Managing student verification and meal history used to be a nightmare of paperwork. Now it's all just a few clicks away. I have so much more time for other tasks."
								name="Rajesh Kumar"
								role="Admin, Tagore Boys Hostel"
								avatarSrc="https://placehold.co/100x100.png"
								data-ai-hint="male admin"
							/>
							<TestimonialCard
								quote="Verifying tokens is so fast! The queue at the counter has practically disappeared. The students are happier, and so are we."
								name="Sunita Devi"
								role="Mess Admin, Iravati Hostel"
								avatarSrc="https://placehold.co/100x100.png"
								data-ai-hint="female mess staff"
							/>
						</div>
					</div>
				</section>

				<section className="w-full py-12 md:py-24 lg:py-32">
					<div className="container px-4 md:px-6">
						<div className="mx-auto max-w-3xl text-center">
							<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
								Ready to Get Started?
							</h2>
							<p className="mt-4 text-muted-foreground md:text-xl">
								Join the MyMess revolution and bring your hostel's dining
								management into the 21st century.
							</p>
							<div className="mt-6">
								<Link href="/signup">
									<Button size="lg" className="shadow-lg shadow-primary/20">
										Create Your Student Account
									</Button>
								</Link>
							</div>
						</div>
					</div>
				</section>
			</main>

			<Footer />
		</div>
	);
}

const FeatureCard = ({
	icon: Icon,
	title,
	description,
}: {
	icon: React.ElementType;
	title: string;
	description: string;
}) => (
	<div className="grid gap-2 text-center items-center justify-items-center p-4 rounded-lg transition-all duration-300 hover:bg-card hover:shadow-lg">
		<div className="bg-primary/10 p-3 rounded-full">
			<Icon className="h-8 w-8 text-primary" />
		</div>
		<h3 className="text-xl font-bold">{title}</h3>
		<p className="text-sm text-muted-foreground">{description}</p>
	</div>
);

const HowItWorksStep = ({
	number,
	icon: Icon,
	title,
	description,
}: {
	number: string;
	icon: React.ElementType;
	title: string;
	description: string;
}) => (
	<div className="flex flex-col items-center text-center gap-4 bg-card p-6 rounded-lg shadow-sm">
		<div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-xl mb-4">
			{number}
		</div>
		<Icon className="h-10 w-10 text-primary" />
		<h3 className="text-lg font-semibold">{title}</h3>
		<p className="text-sm text-muted-foreground">{description}</p>
	</div>
);

const TestimonialCard = ({
	quote,
	name,
	role,
	avatarSrc,
	...props
}: {
	quote: string;
	name: string;
	role: string;
	avatarSrc: string;
	"data-ai-hint": string;
}) => (
	<Card className="p-6 text-center">
		<CardContent className="p-0 flex flex-col items-center gap-4">
			<p className="text-muted-foreground italic">&ldquo;{quote}&rdquo;</p>
			<div className="flex flex-col items-center gap-2">
				<Avatar>
					<AvatarImage src={avatarSrc} alt={name} {...props} />
					<AvatarFallback>
						{name
							.split(" ")
							.map((n) => n[0])
							.join("")}
					</AvatarFallback>
				</Avatar>
				<div>
					<p className="font-semibold">{name}</p>
					<p className="text-sm text-muted-foreground">{role}</p>
				</div>
			</div>
		</CardContent>
	</Card>
);
