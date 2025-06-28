import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function CareersPage() {
	return (
		<div className="flex min-h-screen w-full flex-col items-center bg-background p-4 sm:p-8">
			<div className="w-full max-w-4xl space-y-6">
				<div className="flex justify-start">
					<Link href="/">
						<Button variant="outline">
							<ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
						</Button>
					</Link>
				</div>
				<Card>
					<CardHeader className="text-center">
						<CardTitle className="text-3xl">Join Our Team</CardTitle>
						<CardDescription>
							We're passionate about building the future of campus technology.{" "}
							<br />
							Explore our open positions and find your next opportunity.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-8 pt-6">
						<h3 className="text-2xl font-semibold text-foreground text-center">
							Current Openings
						</h3>

						<div className="space-y-4">
							<Card>
								<CardHeader>
									<CardTitle className="flex justify-between items-center">
										<span>Lead Software Engineer</span>
										<Button>Apply Now</Button>
									</CardTitle>
									<CardDescription>
										Full-time &middot; Bangalore, India &middot; Engineering
									</CardDescription>
								</CardHeader>
								<CardContent>
									<p className="text-muted-foreground">
										We are looking for an experienced software engineer to lead
										our development team. You will be responsible for the
										architecture, design, and implementation of new features, as
										well as mentoring junior developers.
									</p>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="flex justify-between items-center">
										<span>Product Designer</span>
										<Button>Apply Now</Button>
									</CardTitle>
									<CardDescription>
										Full-time &middot; Remote &middot; Design
									</CardDescription>
								</CardHeader>
								<CardContent>
									<p className="text-muted-foreground">
										As a Product Designer at MyMess, you will own the user
										experience and visual design of our platform. You will work
										closely with engineering to create intuitive and beautiful
										interfaces for our users.
									</p>
								</CardContent>
							</Card>
						</div>

						<div className="text-center text-muted-foreground pt-4">
							<p>
								Don't see a role that fits? We're always looking for talented
								people.
							</p>
							<p>
								Send your resume to{" "}
								<a
									href="mailto:careers@mymess.com"
									className="text-primary hover:underline"
								>
									careers@mymess.com
								</a>
								.
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
