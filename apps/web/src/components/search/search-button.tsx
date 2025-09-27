"use client";

import { Button } from "@/components/ui/button";
import { IoSearch } from "react-icons/io5";

interface SearchButtonProps {
  isSearchOpen: boolean;
  onToggle: () => void;
}

export function SearchButton({ isSearchOpen, onToggle }: SearchButtonProps) {
  return (
    <Button
      onClick={onToggle}
      variant="outline"
      className={`search-button group h-10 px-3 py-2 rounded-full border transition-all duration-300 ease-in-out justify-start text-left font-normal cursor-pointer transform ${
        isSearchOpen
          ? "border-primary shadow-2xl hover:scale-102 ring-2 ring-primary/50"
          : "border-border shadow-sm hover:shadow-md hover:scale-102 hover:border-border/80"
      }`}
      aria-expanded={isSearchOpen}
      aria-controls="expanded-search"
      aria-label={isSearchOpen ? "Close search" : "Open search"}
    >
      <IoSearch
        className={`h-4 w-4 transition-transform duration-300 ${
          isSearchOpen ? "rotate-90 text-primary" : undefined
        } group-hover:text-foreground`}
      />
      <span
        className={`hidden sm:inline transition-colors duration-300 ${
          isSearchOpen ? "text-primary" : "text-foreground"
        } group-hover:text-foreground`}
      >
        Search
      </span>
    </Button>
  );
}
