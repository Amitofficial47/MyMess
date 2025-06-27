import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

export default function PayBillPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold md:text-3xl">Pay Your Bill</h1>
        <p className="text-muted-foreground">
          This feature is coming soon.
        </p>
      </div>
      <Card>
        <CardContent className="p-10 flex flex-col items-center justify-center text-center gap-4">
          <CreditCard className="h-12 w-12 md:h-16 md:w-16 text-muted-foreground" />
          <h2 className="text-xl font-semibold md:text-2xl">Online Payments</h2>
          <p className="text-muted-foreground max-w-md">
            We are working on integrating a secure payment gateway to allow you to pay your mess bills directly from here. Stay tuned!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
