import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Briefcase, Linkedin, Mail } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AboutPage() {
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
						<CardTitle className="text-3xl">About MyMess</CardTitle>
						<CardDescription className="text-lg">
							Simplifying Hostel Life, One Meal at a Time
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-8 text-muted-foreground">
						<p className="text-center max-w-2xl mx-auto">
							MyMess was born from a simple idea: hostel mess management
							shouldn't be a hassle. We believe in leveraging technology to
							create seamless, efficient, and user-friendly experiences for both
							students and administrators. Our mission is to eliminate queues,
							streamline record-keeping, and bring transparency to the entire
							process.
						</p>

						<div className="text-center">
							<h3 className="text-2xl font-semibold text-foreground pt-4 mb-6">
								Meet the Creator
							</h3>
							<div className="flex justify-center">
								<Card className="max-w-sm">
									<CardContent className="p-6 flex flex-col items-center gap-4">
										<Avatar className="w-24 h-24 border-2 border-primary">
											<AvatarImage
												src="https://placehold.co/100x100.png"
												data-ai-hint="male developer portrait"
												alt="Amit Malhotra"
											/>
											<AvatarFallback>AM</AvatarFallback>
										</Avatar>
										<div className="text-center">
											<h4 className="text-xl font-bold text-foreground">
												Amit Malhotra
											</h4>
											<p className="text-primary font-medium">
												Founder & Lead Developer
											</p>
										</div>
										<p className="text-sm">
											Amit is a passionate developer dedicated to solving
											real-world problems with elegant code. MyMess is his
											vision for a smarter, more connected campus experience.
										</p>
										<div className="flex gap-4 pt-2">
											<Link
												href="#"
												className="text-muted-foreground hover:text-primary"
											>
												<Mail className="h-5 w-5" />
											</Link>
											<Link
												href="#"
												className="text-muted-foreground hover:text-primary"
											>
												<Linkedin className="h-5 w-5" />
											</Link>
											<Link
												href="#"
												className="text-muted-foreground hover:text-primary"
											>
												<Briefcase className="h-5 w-5" />
											</Link>
										</div>
									</CardContent>
								</Card>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
