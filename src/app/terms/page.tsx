import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-background p-4 sm:p-8">
       <div className="w-full max-w-4xl space-y-6">
        <div className="flex justify-start">
            <Link href="/">
                <Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Home</Button>
            </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Terms of Service</CardTitle>
            <p className="text-muted-foreground">Last updated: June 25, 2024</p>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p className="font-semibold text-foreground">Welcome to MessMate!</p>
            <p>
              These terms and conditions outline the rules and regulations for the
              use of MessMate's Website, located at this application's domain.
            </p>
            <p>
              By accessing this website we assume you accept these terms and
              conditions. Do not continue to use MessMate if you do not agree to
              take all of the terms and conditions stated on this page.
            </p>
            <h3 className="text-xl font-semibold text-foreground pt-4">1. The Service</h3>
            <p>
              MessMate provides a platform for hostel mess management, including meal selection, token generation, and administrative tools. The service is provided "as is" and we make no guarantees about its availability or functionality.
            </p>
            <h3 className="text-xl font-semibold text-foreground pt-4">2. User Accounts</h3>
            <p>
              When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
            </p>
            <h3 className="text-xl font-semibold text-foreground pt-4">3. Intellectual Property</h3>
            <p>
              The Service and its original content, features and functionality are and will remain the exclusive property of MessMate and its licensors.
            </p>
            <h3 className="text-xl font-semibold text-foreground pt-4">4. Termination</h3>
            <p>
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>
            <h3 className="text-xl font-semibold text-foreground pt-4">5. Governing Law</h3>
            <p>
              These Terms shall be governed and construed in accordance with the laws of the jurisdiction, without regard to its conflict of law provisions.
            </p>
            <h3 className="text-xl font-semibold text-foreground pt-4">6. Changes to Terms</h3>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
            </p>
            <h3 className="text-xl font-semibold text-foreground pt-4">Contact Us</h3>
            <p>
              If you have any questions about these Terms, please contact us.
            </p>
          </CardContent>
        </Card>
       </div>
    </div>
  );
}
