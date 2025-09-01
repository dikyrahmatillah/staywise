"use client";

import { Bed } from "lucide-react";
import type { SleepingArrangement } from "./types";

export function SleepingArrangements({
  data,
}: {
  data: SleepingArrangement[];
}) {
  return (
    <section id="sleeping">
      <h3 className="text-xl font-semibold mb-4">Sleeping Arrangements</h3>
      <div className="space-y-4">
        {data.map((arrangement, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div className="flex items-center gap-3">
              <Bed className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">{arrangement.room}</span>
            </div>
            <span className="text-muted-foreground">{arrangement.beds}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
