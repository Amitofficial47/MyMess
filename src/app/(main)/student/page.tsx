"use client";

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useData } from '@/contexts/data-provider';
import { useAuth } from '@/contexts/auth-provider';
import type { MealType } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Coffee, Sun, Moon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { addMealSelection, menu } = useData();
  const { toast } = useToast();
  const [showTokenDialog, setShowTokenDialog] = useState(false);
  const [generatedToken, setGeneratedToken] = useState('');
  const [today, setToday] = useState<string | null>(null);
  const [dayOfWeek, setDayOfWeek] = useState<keyof typeof menu | null>(null);

  useEffect(() => {
    const now = new Date();
    setToday(now.toISOString().split('T')[0]);
    setDayOfWeek(now.toLocaleDateString('en-US', { weekday: 'long' }) as keyof typeof menu);
  }, []);

  const handleMealSelection = (mealType: MealType) => {
    if (!user || !today || !dayOfWeek) return;
    
    if (!menu[dayOfWeek]?.[mealType]?.available) {
        toast({
            variant: "destructive",
            title: "Meal Unavailable",
            description: `${mealType} is not available today.`,
        });
        return;
    }

    const result = addMealSelection(user.id, mealType, today);
    if (result) {
      setGeneratedToken(result.token);
      setShowTokenDialog(true);
    } else {
      toast({
        variant: "destructive",
        title: "Already Selected",
        description: `You have already selected ${mealType} for today.`,
      });
    }
  };

  const MealCard = ({ mealType, icon: Icon }: { mealType: MealType, icon: React.ElementType }) => {
    if (!dayOfWeek) {
      return (
        <Card className="flex flex-col w-full sm:max-w-xs">
          <CardHeader className="flex-row items-center justify-center gap-4 space-y-0">
              <Icon className="h-8 w-8 text-primary"/>
              <CardTitle>{mealType}</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow text-center">
              <Skeleton className="h-5 w-32 mx-auto" />
          </CardContent>
          <CardFooter>
              <Button className="w-full" disabled>Select Meal</Button>
          </CardFooter>
        </Card>
      );
    }
    
    const menuItem = menu[dayOfWeek]?.[mealType];

    return (
      <Card className="flex flex-col w-full sm:max-w-xs">
        <CardHeader className="flex-row items-center justify-center gap-4 space-y-0">
            <Icon className="h-8 w-8 text-primary"/>
            <CardTitle>{mealType}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow text-center">
            {menuItem?.available ? (
                <p className="text-muted-foreground">{menuItem?.item}</p>
            ) : (
                <p className="text-destructive font-semibold">Not Available</p>
            )}
        </CardContent>
        <CardFooter>
            <Button className="w-full" onClick={() => handleMealSelection(mealType)} disabled={!menuItem?.available}>Select Meal</Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold md:text-3xl lg:text-4xl">Welcome, {user?.name.split(' ')[0]}!</h1>
        <p className="text-muted-foreground">Select your meal for today and get your token.</p>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <MealCard mealType="Breakfast" icon={Coffee} />
        <MealCard mealType="Lunch" icon={Sun} />
        <MealCard mealType="Dinner" icon={Moon} />
      </div>

      <AlertDialog open={showTokenDialog} onOpenChange={setShowTokenDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Your Meal Token is Ready!</AlertDialogTitle>
            <AlertDialogDescription>
              Show this token at the mess counter to get your meal.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-6 flex items-center justify-center bg-muted p-4 rounded-md">
            <p className="text-4xl font-bold tracking-widest text-primary">{generatedToken}</p>
          </div>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowTokenDialog(false)}>Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}