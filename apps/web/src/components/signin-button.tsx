"use client";

import { User } from "lucide-react";
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
          <User className="h-5 w-5 sm:h-6 sm:w-6 bg-gray-500 rounded-full p-1 text-white" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
        <DropdownMenuItem asChild>
          <Link
            href="/auth/guest-signin"
            className="w-full h-full block cursor-pointer"
          >
            Guest
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/auth/tenant-signin"
            className="w-full h-full block cursor-pointer"
          >
            Tenant
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
