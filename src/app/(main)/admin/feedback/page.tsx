"use client";

import { useState, useEffect } from "react";
import { useData } from "@/contexts/data-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

export default function ViewFeedbackPage() {
  const { feedback } = useData();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const sortedFeedback = [...feedback].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).slice(0, 2).join('');

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold md:text-3xl lg:text-4xl">View Feedback</h1>
        <p className="text-muted-foreground">
          All feedback submitted by students.
        </p>
      </div>
      <div className="space-y-4">
        {sortedFeedback.length > 0 ? (
          sortedFeedback.map((f) => (
            <Card key={f.id}>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarFallback>{getInitials(f.userName)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle>{f.subject}</CardTitle>
                    <CardDescription>
                      From: {f.userName} on {isClient ? new Date(f.timestamp).toLocaleString() : <Skeleton className="inline-block h-4 w-32" />}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="pl-14">{f.message}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-10 text-center text-muted-foreground">
              <p>No feedback has been submitted yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
