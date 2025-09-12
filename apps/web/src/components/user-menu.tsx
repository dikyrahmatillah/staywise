"use client";

import {
  HiOutlineUserCircle,
  HiOutlineLogout,
  HiOutlineCog,
  HiOutlineHome,
  HiOutlineViewGrid,
} from "react-icons/hi";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
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

  if (!user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="h-10 px-3 py-2 rounded-full border border-gray-300 shadow-sm hover:shadow-md transition-shadow text-sm cursor-pointer"
          >
            <span className="hidden sm:inline">Sign in</span>
            <HiOutlineUserCircle />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem asChild>
            <Link
              href="/guest-signin"
              className="w-full h-full block cursor-pointer"
            >
              Sign in as Guest
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href="/tenant-signin"
              className="w-full h-full block cursor-pointer"
            >
              Sign in as Tenant
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link
              href="/guest-signup"
              className="w-full h-full block cursor-pointer"
            >
              Sign up as Guest
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href="/tenant-signup"
              className="w-full h-full block cursor-pointer"
            >
              Sign up as Tenant
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
  // Prefer `user.image` (NextAuth), then `user.avatarUrl` (app profile), fallback to initials
  const userImage =
    (user as { image?: string; avatarUrl?: string } | undefined)?.image ||
    (user as { image?: string; avatarUrl?: string } | undefined)?.avatarUrl ||
    undefined;

  console.log("userImage", user);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-2 rounded-full border border-gray-200 bg-white pl-2 pr-3 py-1 shadow-sm hover:shadow-md transition-shadow cursor-pointer",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
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
      <DropdownMenuContent align="end" className="w-56 p-0 overflow-hidden">
        <div className="px-3 py-2">
          <p className="text-sm font-medium leading-tight truncate">
            {user.name || user.email}
          </p>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="w-full flex items-center gap-2">
            <HiOutlineHome className="h-4 w-4" /> Dashboard
          </Link>
        </DropdownMenuItem>
        {isTenant && (
          <DropdownMenuItem asChild>
            <Link
              href="/dashboard/tenant/properties"
              className="w-full flex items-center gap-2"
            >
              <HiOutlineViewGrid className="h-4 w-4" /> My Listings
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <Link href="/account" className="w-full flex items-center gap-2">
            <HiOutlineCog className="h-4 w-4" /> Account
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600 focus:text-red-600 cursor-pointer flex items-center gap-2"
          onSelect={(e) => {
            e.preventDefault();
            signOut({ callbackUrl: "/" });
          }}
        >
          <HiOutlineLogout className="h-4 w-4" /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
