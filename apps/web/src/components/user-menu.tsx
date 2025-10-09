"use client";

import {
  HiOutlineUserCircle,
  HiOutlineLogout,
  HiOutlineCog,
  HiOutlineHome,
  HiOutlineViewGrid,
  HiOutlineArrowRight,
  HiOutlineUsers,
} from "react-icons/hi";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export function UserMenu() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="h-10 w-24 rounded-full border border-gray-200 bg-gray-100 animate-pulse" />
    );
  }

  const user = session?.user;
  const role = user?.role?.toLowerCase();
  const isTenant = role === "tenant";
  const accountHref = isTenant
    ? "/dashboard/tenant/account"
    : "/dashboard/guest/account";

  if (!user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="h-10 px-3 py-2 rounded-full border border-gray-300 shadow-sm hover:shadow-md transition-shadow text-sm focus-visible:outline-none focus-visible:border-primary focus-visible:shadow-2xl focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:text-primary cursor-pointer"
          >
            <span className="hidden sm:inline">Sign in</span>
            <HiOutlineUserCircle />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-48 p-0 overflow-hidden shadow-2xl border-2 border-gray-200/50 bg-white/95 backdrop-blur-lg dark:bg-gray-900/95 dark:border-gray-700/50 rounded-xl"
        >
          <DropdownMenuItem asChild>
            <Link
              href="/signin"
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-accent/60 hover:shadow-sm transition-all duration-200 group rounded-lg"
            >
              <HiOutlineArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="font-medium">Sign in</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href="/guest-signup"
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-accent/60 hover:shadow-sm transition-all duration-200 group rounded-lg"
            >
              <HiOutlineUsers className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="font-medium">Sign up</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link
              href="/tenant-signup"
              className="w-full flex items-center gap-3 px-4 py-2.5 bg-accent/10 hover:bg-accent/30 hover:shadow-sm transition-all duration-200 group rounded-lg"
            >
              <HiOutlineHome className="h-4 w-4 text-primary" />
              <span className="font-medium group-hover:text-destructive transition-colors">
                Become a Host
              </span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  const firstInitial =
    user.name?.charAt(0)?.toUpperCase() ||
    user.email?.charAt(0)?.toUpperCase() ||
    "U";
  const userImage =
    (user as { image?: string; avatarUrl?: string } | undefined)?.image ||
    (user as { image?: string; avatarUrl?: string } | undefined)?.avatarUrl ||
    undefined;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-2 rounded-full border border-gray-200 bg-white pl-2 pr-3 py-1 shadow-sm hover:shadow-md transition-shadow cursor-pointer",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:border-primary"
          )}
        >
          <Avatar className="size-8">
            <AvatarImage
              src={userImage || undefined}
              alt={user.name || "User"}
            />
            <AvatarFallback className="text-sm bg-rose-500 text-white">
              {firstInitial}
            </AvatarFallback>
          </Avatar>
          <span className="hidden sm:inline text-sm font-medium max-w-[120px] truncate">
            {user.name || user.email}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-64 p-0 overflow-hidden shadow-2xl border-2 border-gray-200/50 bg-white/95 backdrop-blur-lg dark:bg-gray-900/95 dark:border-gray-700/50 rounded-xl"
      >
        <div className="px-4 py-3 border-b border-border/50">
          <p className="text-sm font-semibold leading-tight truncate text-foreground">
            {user.name || user.email}
          </p>
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {user.email}
          </p>
        </div>
        <div className="py-2">
          <DropdownMenuItem asChild>
            <Link
              href="/dashboard"
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-accent/60 hover:shadow-sm transition-all duration-200 group rounded-lg"
            >
              <HiOutlineHome className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="font-medium">Dashboard</span>
            </Link>
          </DropdownMenuItem>
          {isTenant && (
            <DropdownMenuItem asChild>
              <Link
                href="/dashboard/tenant/properties"
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-accent/60 hover:shadow-sm transition-all duration-200 group rounded-lg"
              >
                <HiOutlineViewGrid className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="font-medium">My Listings</span>
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem asChild>
            <Link
              href={accountHref}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-accent/60 hover:shadow-sm transition-all duration-200 group rounded-lg"
            >
              <HiOutlineCog className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="font-medium">Account Settings</span>
            </Link>
          </DropdownMenuItem>
        </div>
        <div className="border-t border-border/50">
          <DropdownMenuItem
            className="text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer flex items-center gap-3 px-4 py-2.5 mx-2 my-1 rounded-lg transition-all duration-200 group"
            onSelect={(e) => {
              e.preventDefault();
              toast.success("Signed out");
              signOut({ callbackUrl: "/" });
            }}
          >
            <HiOutlineLogout className="h-4 w-4 group-hover:text-destructive transition-colors" />
            <span className="font-medium">Sign out</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
