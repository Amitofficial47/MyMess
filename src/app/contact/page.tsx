import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, MapPin, Phone } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
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
						<CardTitle className="text-3xl">Get in Touch</CardTitle>
						<CardDescription>
							We'd love to hear from you. Here's how you can reach us.
						</CardDescription>
					</CardHeader>
					<CardContent className="grid md:grid-cols-2 gap-8 pt-6">
						<div className="space-y-6">
							<h3 className="text-xl font-semibold text-foreground">
								Contact Information
							</h3>
							<div className="flex items-center gap-4">
								<Mail className="h-6 w-6 text-primary" />
								<div>
									<p className="font-semibold">Email</p>
									<a
										href="mailto:support@mymess.com"
										className="text-muted-foreground hover:text-primary"
									>
										support@mymess.com
									</a>
								</div>
							</div>
							<div className="flex items-center gap-4">
								<Phone className="h-6 w-6 text-primary" />
								<div>
									<p className="font-semibold">Phone</p>
									<p className="text-muted-foreground">(+91) 123-456-7890</p>
								</div>
							</div>
							<div className="flex items-center gap-4">
								<MapPin className="h-6 w-6 text-primary" />
								<div>
									<p className="font-semibold">Office</p>
									<p className="text-muted-foreground">
										123 Tech Park, Innovation Drive, Bangalore, India
									</p>
								</div>
							</div>
						</div>
						<div className="space-y-6">
							<h3 className="text-xl font-semibold text-foreground">
								Send us a Message
							</h3>
							<div className="space-y-4">
								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="first-name">First Name</Label>
										<Input id="first-name" placeholder="John" />
									</div>
									<div className="space-y-2">
										<Label htmlFor="last-name">Last Name</Label>
										<Input id="last-name" placeholder="Doe" />
									</div>
								</div>
								<div className="space-y-2">
									<Label htmlFor="email">Email</Label>
									<Input
										id="email"
										type="email"
										placeholder="john@example.com"
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="message">Message</Label>
									<Textarea
										id="message"
										placeholder="Your message here..."
										className="min-h-[100px]"
									/>
								</div>
								<Button className="w-full">Send Message</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
