
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/auth-provider";
import { LogOut, User as UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface UserNavProps {
  variant?: 'sidebar' | 'header';
}

export function UserNav({ variant = 'sidebar' }: UserNavProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!user) {
    return null;
  }
  
  const fallbackInitials = user.name
  .split(' ')
  .map(n => n[0])
  .slice(0, 2)
  .join('');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {variant === 'sidebar' ? (
          <Button variant="ghost" className="relative h-10 w-full justify-start gap-2 px-2 group hover:bg-primary hover:text-primary-foreground">
              <Avatar className="h-8 w-8">
                  {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
                  <AvatarFallback>{fallbackInitials}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start text-left truncate">
                  <span className="text-sm font-medium group-hover:text-primary-foreground">{user.name}</span>
                  <span className="text-xs text-muted-foreground group-hover:text-primary-foreground/80">{user.email}</span>
              </div>
          </Button>
        ) : (
          <Button
            variant="ghost"
            className="relative h-10 w-10 rounded-full hover:bg-accent focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            <Avatar className="h-8 w-8">
                {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
                <AvatarFallback>{fallbackInitials}</AvatarFallback>
            </Avatar>
            <span className="sr-only">Open user menu</span>
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push('/profile')} className="cursor-pointer">
            <UserIcon className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
