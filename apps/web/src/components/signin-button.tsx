"use client";

import { HiOutlineUserCircle } from "react-icons/hi";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LoginButton() {
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
      <DropdownMenuContent align="end" className="w-32">
        <DropdownMenuItem asChild>
          <Link
            href="/guest-signin"
            className="w-full h-full block cursor-pointer"
          >
            Guest
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/tenant-signin"
            className="w-full h-full block cursor-pointer"
          >
            Tenant
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
