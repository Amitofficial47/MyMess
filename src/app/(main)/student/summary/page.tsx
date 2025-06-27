"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-provider";
import { useData } from "@/contexts/data-provider";
import { Utensils, Banknote } from "lucide-react";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function MonthlySummaryPage() {
  const { user } = useAuth();
  const { mealSelections } = useData();
  const [currentDate, setCurrentDate] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentDate(new Date());
  }, []);

  if (!currentDate) {
    return (
      <div className="flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold md:text-3xl lg:text-4xl">Monthly Summary</h1>
          <p className="text-muted-foreground">
            Your meal consumption and estimated bill for the current month.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-col items-center justify-center space-y-2 pb-2">
              <Utensils className="h-8 w-8 text-primary" />
              <CardTitle className="text-base font-semibold">
                Total Meals Consumed
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <Skeleton className="h-8 w-16 mx-auto" />
              <Skeleton className="h-4 w-24 mx-auto mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-col items-center justify-center space-y-2 pb-2">
              <Banknote className="h-8 w-8 text-primary" />
              <CardTitle className="text-base font-semibold">Estimated Bill</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <Skeleton className="h-8 w-24 mx-auto" />
              <Skeleton className="h-4 w-20 mx-auto mt-2" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const monthlyMeals = mealSelections.filter((sel) => {
    const selDate = new Date(sel.date);
    return (
      sel.userId === user?.id &&
      selDate.getMonth() === currentMonth &&
      selDate.getFullYear() === currentYear &&
      sel.consumed
    );
  });

  const totalMealsConsumed = monthlyMeals.length;
  // Assuming a dummy price per meal
  const pricePerMeal = 50;
  const estimatedBill = totalMealsConsumed * pricePerMeal;

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold md:text-3xl lg:text-4xl">Monthly Summary</h1>
        <p className="text-muted-foreground">
          Your meal consumption and estimated bill for the current month.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-col items-center justify-center space-y-2 pb-2">
            <Utensils className="h-8 w-8 text-primary" />
            <CardTitle className="text-base font-semibold">
              Total Meals Consumed
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold">{totalMealsConsumed}</div>
            <p className="text-xs text-muted-foreground">
              in {currentDate.toLocaleString('default', { month: 'long' })}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-col items-center justify-center space-y-2 pb-2">
            <Banknote className="h-8 w-8 text-primary" />
            <CardTitle className="text-base font-semibold">Estimated Bill</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold">₹{estimatedBill.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Based on ₹{pricePerMeal}/meal
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}