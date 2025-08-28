"use client";

import { forwardRef } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onFocus?: () => void;
}

export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(
  (
    { value, onChange, placeholder, label, isOpen, onOpenChange, onFocus },
    ref
  ) => {
    return (
      <Popover open={isOpen} onOpenChange={onOpenChange} modal={false}>
        <PopoverTrigger asChild>
          <div
            role="button"
            tabIndex={0}
            className={cn(
              "flex-1 py-2 px-6 text-left h-14 items-center",
              isOpen ? "bg-gray-100" : "bg-transparent"
            )}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex-1">
                <div className="font-semibold text-xs text-gray-700 uppercase tracking-wide mb-1">
                  {label}
                </div>
                <Input
                  ref={ref}
                  placeholder={placeholder}
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  onFocus={onFocus}
                  className="rounded-none border-0 bg-transparent p-0 text-sm placeholder:text-gray-400 focus-visible:ring-0 h-auto w-full"
                />
              </div>
              {value && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange("");
                  }}
                  className="h-6 w-6"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </PopoverTrigger>
      </Popover>
    );
  }
);

SearchField.displayName = "SearchField";
