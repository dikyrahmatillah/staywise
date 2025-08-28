"use client";

import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchButtonProps {
  isSearchOpen: boolean;
  onToggle: () => void;
}

export function SearchButton({ isSearchOpen, onToggle }: SearchButtonProps) {
  return (
    <Button
      onClick={onToggle}
      variant="outline"
      className="search-button h-10 px-3 py-2 rounded-full border border-gray-300 shadow-sm hover:shadow-md transition-shadow justify-start text-left font-normal"
      aria-expanded={isSearchOpen}
      aria-controls="expanded-search"
      aria-label={isSearchOpen ? "Close search" : "Open search"}
    >
      <Search className="ml-auto h-4 w-4 font-sans text-rose-500" />
      Search
    </Button>
  );
}
