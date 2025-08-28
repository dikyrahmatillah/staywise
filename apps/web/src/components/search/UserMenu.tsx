"use client";

import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="h-10 px-3 rounded-full border-gray-300 hover:shadow-md transition-shadow"
        >
          Login
          <User className="h-6 w-6 bg-gray-500 rounded-full p-1 text-white" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-20">
        <DropdownMenuItem className="cursor-pointer">
          <span>Guest</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <span>Tenant</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
