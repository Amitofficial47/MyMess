"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useData } from "@/contexts/data-provider";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Loader2, Trash2, Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const notificationSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

export default function AdminNotificationsPage() {
  const { notifications, addNotification, deleteNotification } = useData();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const form = useForm<z.infer<typeof notificationSchema>>({
    resolver: zodResolver(notificationSchema),
    defaultValues: { title: "", message: "" },
  });

  function onSubmit(values: z.infer<typeof notificationSchema>) {
    setIsSubmitting(true);
    addNotification(values.title, values.message);
    toast({
      title: "Notification Sent",
      description: "The new notification has been posted.",
    });
    form.reset();
    setIsSubmitting(false);
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold md:text-3xl lg:text-4xl">Add Notification</h1>
          <p className="text-muted-foreground">
            Send announcements to all students.
          </p>
        </div>
        <Card>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Mess Closure Notice" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter the notification details here..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Send Notification
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-6">
        <div className="text-center md:text-left">
          <h2 className="text-xl font-bold md:text-2xl lg:text-3xl">Sent Notifications</h2>
          <p className="text-muted-foreground">Manage previously sent notifications.</p>
        </div>
        <Card className="flex-1">
          <CardContent className="p-6 space-y-4">
            {notifications.length > 0 ? (
              notifications.map((n, index) => (
                <div key={n.id}>
                  <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-semibold">{n.title}</h3>
                        <p className="text-sm text-muted-foreground">{n.message}</p>
                        <p className="text-xs text-muted-foreground mt-2">{isClient ? new Date(n.timestamp).toLocaleString() : <Skeleton className="h-3 w-32" />}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => deleteNotification(n.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  {index < notifications.length - 1 && <Separator className="my-4" />}
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground pt-10">No notifications sent yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
