"use client";

import { useId } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Plus, X } from "lucide-react";
import { format } from "date-fns";
import type { FormData } from "./types";
import { addDateIfValid, removeDate, today } from "./utils";

interface Props {
  data: FormData;
  onChange: (patch: Partial<FormData>) => void;
}

export default function DateSelection({ data, onChange }: Props) {
  const idRange = useId();

  return (
    <div className="space-y-4">
      <div>
        <Label className="mb-1">Date Selection Mode</Label>
        <div className="flex gap-4 mt-2">
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id={`dateMode-range-${idRange}`}
              name="dateMode"
              checked={data.dateMode === "range"}
              onChange={() => onChange({ dateMode: "range" })}
              className="h-4 w-4 text-primary focus:ring-primary"
            />
            <div className="flex flex-col">
              <Label htmlFor={`dateMode-range-${idRange}`}>Date Range</Label>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id={`dateMode-specific-${idRange}`}
              name="dateMode"
              checked={data.dateMode === "specific"}
              onChange={() => onChange({ dateMode: "specific" })}
              className="h-4 w-4 text-primary focus:ring-primary"
            />
            <div className="flex flex-col">
              <Label htmlFor={`dateMode-specific-${idRange}`}>
                Specific Dates
              </Label>
            </div>
          </div>
        </div>
      </div>

      {data.dateMode === "range" && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="mb-1">Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {data.startDate
                    ? format(data.startDate, "PPP")
                    : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={data.startDate}
                  onSelect={(date) => onChange({ startDate: date })}
                  disabled={{ before: today }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label className="mb-1">End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {data.endDate ? format(data.endDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={data.endDate}
                  onSelect={(date) => onChange({ endDate: date })}
                  disabled={{ before: today }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}

      {data.dateMode === "specific" && (
        <div className="space-y-2">
          <div className="flex gap-2 flex-wrap">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Date
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  onSelect={(date) =>
                    date &&
                    onChange({
                      specificDates: addDateIfValid(data.specificDates, date),
                    })
                  }
                  disabled={{ before: today }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex flex-wrap gap-2">
            {data.specificDates.map((date, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {format(date, "MMM dd")}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-red-500"
                  onClick={() =>
                    onChange({
                      specificDates: removeDate(data.specificDates, date),
                    })
                  }
                />
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
