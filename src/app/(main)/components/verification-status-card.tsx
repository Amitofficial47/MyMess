"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hourglass, XCircle } from "lucide-react";
import type { VerificationStatus } from "@/lib/types";

interface VerificationStatusCardProps {
	status: VerificationStatus;
}

export function VerificationStatusCard({
	status,
}: VerificationStatusCardProps) {
	const isPending = status === "PENDING";

	return (
		<div className="flex flex-col items-center justify-center h-full">
			<Card className="w-full max-w-lg">
				<CardHeader className="items-center text-center">
					{isPending ? (
						<Hourglass className="h-12 w-12 text-primary" />
					) : (
						<XCircle className="h-12 w-12 text-destructive" />
					)}
					<CardTitle className="text-2xl pt-4">
						{isPending ? "Verification Pending" : "Registration Rejected"}
					</CardTitle>
				</CardHeader>
				<CardContent className="text-center text-muted-foreground">
					{isPending ? (
						<p>
							Your account registration is currently being reviewed by your
							hostel admin. You will be able to access all features once your
							account is approved.
						</p>
					) : (
						<p>
							Your registration request has been rejected. If you believe this
							is a mistake, please contact your hostel administration for
							further assistance.
						</p>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
