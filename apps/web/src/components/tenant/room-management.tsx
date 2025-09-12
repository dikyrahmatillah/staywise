"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bed, Plus } from "lucide-react";

export function RoomManagement() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Room Management</h1>
          <p className="text-muted-foreground">
            Manage rooms for this property
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add New Room
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bed className="h-5 w-5" />
            Rooms
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Bed className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
            <p className="text-muted-foreground">
              Room management features are being developed and will be available
              soon.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
