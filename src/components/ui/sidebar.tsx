"use client"

import * as React from "react"
import { ChevronsLeft, Menu } from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { buttonVariants } from "@/components/ui/button"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { UserNav } from "@/components/layout/user-nav"

interface SidebarContextProps {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  isMobile: boolean
}

const SidebarContext = React.createContext<SidebarContextProps | undefined>(
  undefined
)

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile()
  const [isOpen, setIsOpen] = React.useState(!isMobile)

  React.useEffect(() => {
    if (typeof isMobile === "boolean") {
      setIsOpen(!isMobile)
    }
  }, [isMobile])

  // Prevent hydration mismatch by returning null on the server.
  if (typeof isMobile === "undefined") {
    return null
  }

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen, isMobile }}>
      <div
        className={cn(
          "h-screen w-full",
          isMobile && "flex flex-col"
        )}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  )
}

const MobileSheet = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const { isOpen, setIsOpen } = useSidebar()
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b bg-background px-2 md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetTitle className="sr-only">Sidebar Menu</SheetTitle>
            <div className={cn("flex h-full flex-col", className)} {...props}>
              {children}
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <UserNav variant="header" />
        </div>
      </header>
    </>
  )
}

export const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { isOpen, isMobile } = useSidebar()

  if (isMobile) {
    return <MobileSheet {...props} className={className}>{children}</MobileSheet>
  }

  return (
    <aside
      ref={ref}
      className={cn(
        "fixed left-0 top-0 z-40 hidden h-screen flex-col border-r bg-background transition-all duration-300 ease-in-out md:flex",
        isOpen ? "w-64" : "w-[68px]",
        className
      )}
      {...props}
    >
      {children}
    </aside>
  )
})
Sidebar.displayName = "Sidebar"

export const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { isOpen, isMobile } = useSidebar()

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-300 ease-in-out",
        !isMobile && (isOpen ? "md:ml-64" : "md:ml-[68px]"),
        className
      )}
      {...props}
    />
  )
})
SidebarInset.displayName = "SidebarInset"

export const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { isOpen, setIsOpen, isMobile } = useSidebar();

  if (isMobile) {
    return (
      <div
        ref={ref}
        className={cn("flex h-14 items-center border-b p-4", className)}
        {...props}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={cn(
        "flex h-14 items-center justify-between border-b p-3",
        className
      )}
      {...props}
    >
      <div className={cn("flex-1 overflow-hidden", !isOpen && "hidden")}>
        {children}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0"
        onClick={() => setIsOpen(!isOpen)}
      >
        <ChevronsLeft
          className={cn("h-5 w-5 transition-transform", !isOpen && "rotate-180")}
        />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>
    </div>
  );
})
SidebarHeader.displayName = "SidebarHeader"

export const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex-1 overflow-y-auto", className)}
    {...props}
  />
))
SidebarContent.displayName = "SidebarContent"

export const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mt-auto shrink-0 border-t", className)}
    {...props}
  />
))
SidebarFooter.displayName = "SidebarFooter"

export const SidebarMenu = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <nav ref={ref} className={cn("flex flex-col", className)} {...props} />
))
SidebarMenu.displayName = "SidebarMenu"

export const SidebarMenuItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
))
SidebarMenuItem.displayName = "SidebarMenuItem"

export const SidebarMenuButton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { isActive?: boolean }
>(({ className, isActive, children, ...props }, ref) => {
  const { isOpen, isMobile } = useSidebar()

  return (
    <div
      ref={ref}
      className={cn(
        buttonVariants({
          variant: isActive ? "secondary" : "ghost",
          size: "default",
        }),
        "flex h-10 cursor-pointer items-center gap-2",
        isOpen || isMobile ? "justify-start" : "justify-center",
        className
      )}
      {...props}
    >
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child) && child.type === "span") {
          if (isOpen || isMobile) {
            return child
          }
          return null
        }
        return child
      })}
    </div>
  )
})
SidebarMenuButton.displayName = "SidebarMenuButton"
