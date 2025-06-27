"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useData } from "@/contexts/data-provider";
import type { DayOfWeek, WeeklyMenu } from "@/lib/types";
import { Coffee, Sun, Moon } from "lucide-react";
import { useIsMobile } from '@/hooks/use-mobile';
import { Skeleton } from '@/components/ui/skeleton';

const days: DayOfWeek[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function StudentMenuPage() {
  const { menu } = useData();
  const isMobile = useIsMobile();
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Monday');

  useEffect(() => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    if (days.includes(today as DayOfWeek)) {
      setSelectedDay(today as DayOfWeek);
    }
  }, []);

  if (isMobile === undefined) {
    return (
      <div className="flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold md:text-3xl lg:text-4xl">Weekly Menu</h1>
          <p className="text-muted-foreground">
            Here is the meal plan for the entire week.
          </p>
        </div>
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const dayMenu = menu[selectedDay];

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold md:text-3xl lg:text-4xl">Weekly Menu</h1>
        <p className="text-muted-foreground">
          Here is the meal plan for the entire week.
        </p>
      </div>

      {isMobile ? (
        <Select value={selectedDay} onValueChange={(day) => setSelectedDay(day as DayOfWeek)}>
          <SelectTrigger>
            <span className="flex-1 text-center">
              <SelectValue placeholder="Select a day" />
            </span>
          </SelectTrigger>
          <SelectContent>
            {days.map((day) => (
              <SelectItem key={day} value={day} className="justify-center">{day}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Tabs value={selectedDay} onValueChange={(day) => setSelectedDay(day as DayOfWeek)} className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            {days.map((day) => (
              <TabsTrigger key={day} value={day}>{day}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      {dayMenu && (
        <div className="mt-2">
            <DayMenu dayMenu={dayMenu} />
        </div>
      )}
    </div>
  );
}

function DayMenu({ dayMenu }: { dayMenu: WeeklyMenu[DayOfWeek] }) {
  return (
    <Card>
      <CardContent className="p-6 grid gap-6 md:grid-cols-3">
        <MealInfo title="Breakfast" icon={Coffee} item={dayMenu.Breakfast} />
        <MealInfo title="Lunch" icon={Sun} item={dayMenu.Lunch} />
        <MealInfo title="Dinner" icon={Moon} item={dayMenu.Dinner} />
      </CardContent>
    </Card>
  );
}

function MealInfo({ title, icon: Icon, item }: { title: string, icon: React.ElementType, item: WeeklyMenu[DayOfWeek][keyof WeeklyMenu[DayOfWeek]] }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-center gap-2">
        <Icon className="h-6 w-6 text-primary" />
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      {item?.available ? (
        <p className="text-muted-foreground text-center">{item.item}</p>
      ) : (
        <p className="pl-8 text-destructive font-medium">Not Available</p>
      )}
    </div>
  );
}