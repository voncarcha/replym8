"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef } from "react";
import {
  Home,
  Folder,
  MessageSquare,
  Sparkles,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { useThemeStore } from "@/lib/store";

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard/profiles", label: "Profiles", icon: Folder },
  { href: "/dashboard/conversations", label: "Conversations", icon: MessageSquare },
  { href: "/dashboard/generator", label: "Generator", icon: Sparkles },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const userButtonRef = useRef<HTMLDivElement>(null);
  const theme = useThemeStore((state) => state.theme);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleMyAccountClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Trigger click on the UserButton
    const userButton = userButtonRef.current?.querySelector('button');
    if (userButton) {
      userButton.click();
    }
  };

  return (
    <aside className="w-full lg:w-52 xl:w-60 border-b lg:border-b-0 lg:border-r border-border bg-card/95">
      <div className="flex items-center justify-between gap-2 p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-card border border-border flex items-center justify-center">
            <span className="text-sm font-semibold tracking-tight text-foreground">R8</span>
          </div>
          <div className="hidden lg:flex flex-col">
            <span className="text-sm font-medium tracking-tight text-foreground">
              ReplyM8
            </span>
            <span className="text-[0.8125rem] text-muted-foreground">Dashboard</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={toggleMenu}
            className="inline-flex lg:hidden items-center gap-1.5 rounded-lg border border-border bg-card text-[0.8125rem] text-foreground px-2 py-1 hover:bg-muted transition-colors"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <>
                <X className="h-4 w-4" />
                <span>Close</span>
              </>
            ) : (
              <>
                <Menu className="h-4 w-4" />
                <span>Menu</span>
              </>
            )}
          </button>
        </div>
      </div>

      <nav className={cn(
        "p-2 space-y-1 text-sm",
        "lg:block",
        isMenuOpen ? "block" : "hidden"
      )}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMenu}
              className={cn(
                "w-full flex items-center justify-between gap-2 rounded-lg px-3 py-2 transition-colors",
                isActive
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              <div className="flex items-center gap-2">
                <Icon
                  className={cn(
                    "h-3.5 w-3.5",
                    isActive ? "text-foreground" : "text-muted-foreground"
                  )}
                />
                <span>{item.label}</span>
              </div>
              {item.href === "/dashboard" && (
                <span className="text-[0.75rem] text-muted-foreground">Today</span>
              )}
              {item.href === "/dashboard/profiles" && (
                <span className="text-[0.75rem] text-muted-foreground">12</span>
              )}
              {item.href === "/dashboard/conversations" && (
                <span className="text-[0.75rem] text-muted-foreground">+ Upload</span>
              )}
              {item.href === "/dashboard/generator" && (
                <span className="text-[0.75rem] text-muted-foreground">Active</span>
              )}
              {item.href === "/dashboard/settings" && (
                <span className="text-[0.75rem] text-muted-foreground">Plan</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className={cn(
        "mt-auto p-3 border-t border-border text-sm space-y-2",
        "lg:block",
        isMenuOpen ? "block" : "hidden"
      )}>
        <div className="flex items-center justify-between text-foreground">
          <span>Daily credits</span>
          <span>38 / 50</span>
        </div>
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <div className="h-full w-3/4 bg-gradient-to-r from-sky-500 to-emerald-400" />
        </div>
        <Button
          variant="outline"
          className="w-full mt-2 inline-flex items-center justify-center gap-1 rounded-lg border-border bg-card text-sm text-foreground px-2.5 py-1.5 hover:bg-muted h-auto"
        >
          Upgrade plan
        </Button>
        <div className="relative w-full mt-2">
          <Button
            variant="outline"
            onClick={handleMyAccountClick}
            className="w-full inline-flex items-center justify-center gap-1 rounded-lg border-border bg-card text-sm text-foreground px-2.5 py-1.5 hover:bg-muted h-auto"
          >
            My Account
          </Button>
          <div ref={userButtonRef} className="absolute top-0 left-0 w-full h-full opacity-0 pointer-events-none overflow-visible">
            <UserButton
              appearance={{
                theme: theme === "dark" ? dark : undefined,
                elements: {
                  rootBox: "w-full h-full",
                  userButtonTrigger: "w-full h-full",
                  avatarBox: "h-0 w-0 ",
                  userButtonAvatarBox: "h-0 w-0 ",
                  userButtonPopoverCard: "bg-card border-border",
                  userButtonPopoverActionButton: "text-foreground hover:bg-muted",
                  userButtonPopoverActionButtonText: "text-muted-foreground",
                  userButtonPopoverFooter: "hidden",
                },
              }}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}

