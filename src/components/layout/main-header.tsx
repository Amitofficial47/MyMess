"use client";

import { ThemeToggle } from "./theme-toggle";
import { UserNav } from "./user-nav";

export function MainHeader() {
  return (
    <header className="hidden h-14 items-center justify-end gap-4 border-b bg-background px-4 md:flex">
      <ThemeToggle />
      <UserNav variant="header" />
    </header>
  );
}
