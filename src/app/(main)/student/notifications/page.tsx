"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { useData } from "@/contexts/data-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function StudentNotificationsPage() {
  const { notifications } = useData();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold md:text-3xl lg:text-4xl">Notifications</h1>
        <p className="text-muted-foreground">
          Important announcements and updates from the admin.
        </p>
      </div>
      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <Card key={notification.id}>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Bell className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>{notification.title}</CardTitle>
                    <CardDescription>
                      {isClient ? new Date(notification.timestamp).toLocaleString() : <Skeleton className="h-4 w-32" />}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p>{notification.message}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-10 text-center text-muted-foreground">
              <p>No notifications yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
