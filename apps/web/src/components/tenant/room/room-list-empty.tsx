"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Bed } from "lucide-react";

export function RoomListEmpty() {
  return (
    <Card>
      <CardContent className="text-center py-12">
        <Bed className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No rooms yet</h3>
        <p className="text-muted-foreground mb-4">
          Create your first room to start managing your property.
        </p>
      </CardContent>
    </Card>
  );
}
