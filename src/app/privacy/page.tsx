import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
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
					<CardHeader>
						<CardTitle className="text-3xl">Privacy Policy</CardTitle>
						<p className="text-muted-foreground">Last updated: June 25, 2024</p>
					</CardHeader>
					<CardContent className="space-y-4 text-muted-foreground">
						<p className="font-semibold text-foreground">
							Your privacy is important to us.
						</p>
						<p>
							It is MyMess's policy to respect your privacy regarding any
							information we may collect from you across our website.
						</p>

						<h3 className="text-xl font-semibold text-foreground pt-4">
							1. Information We Collect
						</h3>
						<p>
							We only ask for personal information when we truly need it to
							provide a service to you. We collect it by fair and lawful means,
							with your knowledge and consent. We also let you know why we’re
							collecting it and how it will be used.
						</p>

						<h3 className="text-xl font-semibold text-foreground pt-4">
							2. Log Data
						</h3>
						<p>
							Like many site operators, we collect information that your browser
							sends whenever you visit our Service ("Log Data"). This Log Data
							may include information such as your computer's Internet Protocol
							("IP") address, browser type, browser version, the pages of our
							Service that you visit, the time and date of your visit, the time
							spent on those pages and other statistics.
						</p>

						<h3 className="text-xl font-semibold text-foreground pt-4">
							3. Use of Data
						</h3>
						<p>
							We use the collected data for various purposes: to provide and
							maintain the Service, to notify you about changes to our Service,
							to allow you to participate in interactive features of our Service
							when you choose to do so, to provide customer care and support,
							and to monitor the usage of the Service.
						</p>

						<h3 className="text-xl font-semibold text-foreground pt-4">
							4. Data Retention
						</h3>
						<p>
							We only retain collected information for as long as necessary to
							provide you with your requested service. What data we store, we’ll
							protect within commercially acceptable means to prevent loss and
							theft, as well as unauthorized access, disclosure, copying, use or
							modification.
						</p>

						<h3 className="text-xl font-semibold text-foreground pt-4">
							5. Sharing Data
						</h3>
						<p>
							We don’t share any personally identifying information publicly or
							with third-parties, except when required to by law.
						</p>

						<h3 className="text-xl font-semibold text-foreground pt-4">
							6. Links To Other Sites
						</h3>
						<p>
							Our Service may contain links to other sites that are not operated
							by us. If you click on a third party link, you will be directed to
							that third party's site. We strongly advise you to review the
							Privacy Policy of every site you visit.
						</p>

						<h3 className="text-xl font-semibold text-foreground pt-4">
							Contact Us
						</h3>
						<p>
							If you have any questions about this Privacy Policy, please
							contact us.
						</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
