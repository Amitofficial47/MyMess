"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-provider";
import { useData } from "@/contexts/data-provider";
import { Badge } from "@/components/ui/badge";
import { Calendar, KeyRound, CheckCircle, XCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function MealHistoryPage() {
  const { user } = useAuth();
  const { mealSelections } = useData();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const userMealSelections = mealSelections
    .filter((sel) => sel.userId === user?.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold md:text-3xl lg:text-4xl">Meal History</h1>
        <p className="text-muted-foreground">
          A record of all your past meal selections.
        </p>
      </div>

      {/* Desktop View: Table */}
      <div className="hidden rounded-lg border md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Meal Type</TableHead>
              <TableHead>Token</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userMealSelections.length > 0 ? (
              userMealSelections.map((selection) => (
                <TableRow key={selection.id}>
                  <TableCell>{isClient ? new Date(selection.date).toLocaleDateString() : <Skeleton className="h-4 w-20" />}</TableCell>
                  <TableCell>{selection.mealType}</TableCell>
                  <TableCell className="font-mono">{selection.token}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={selection.consumed ? "default" : "secondary"} className={selection.consumed ? "bg-green-600 hover:bg-green-700" : ""}>
                      {selection.consumed ? <CheckCircle className="mr-1 h-4 w-4" /> : <XCircle className="mr-1 h-4 w-4" />}
                      {selection.consumed ? "Consumed" : "Not Consumed"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No meal history found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile View: Cards */}
      <div className="space-y-4 md:hidden">
        {userMealSelections.length > 0 ? (
          userMealSelections.map((selection) => (
            <Card key={selection.id}>
              <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                      <span>{selection.mealType}</span>
                      <Badge variant={selection.consumed ? "default" : "secondary"} className={selection.consumed ? "bg-green-600 hover:bg-green-700" : ""}>
                         {selection.consumed ? <CheckCircle className="mr-1 h-4 w-4" /> : <XCircle className="mr-1 h-4 w-4" />}
                         {selection.consumed ? "Consumed" : "Not Consumed"}
                      </Badge>
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 pt-1">
                      <Calendar className="h-4 w-4" />
                      {isClient ? new Date(selection.date).toLocaleDateString() : <Skeleton className="h-4 w-20" />}
                  </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm">
                    <KeyRound className="h-4 w-4 text-muted-foreground"/>
                    <span className="font-mono text-muted-foreground">{selection.token}</span>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-10 text-center text-muted-foreground">
              No meal history found.
            </CardContent>
          </Card>
        )}
      </div>

    </div>
  );
}
