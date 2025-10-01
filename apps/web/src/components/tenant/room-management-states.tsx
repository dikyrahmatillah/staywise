"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bed, Plus } from "lucide-react";

interface NoRoomsStateProps {
  onAddRoom: () => void;
}

interface ErrorStateProps {
  error: string;
}

export const NoRoomsState = ({ onAddRoom }: NoRoomsStateProps) => {
  return (
    <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
      <CardContent className="p-12 text-center">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <Bed className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No Rooms Yet</h3>
        <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
          You haven&apos;t added any rooms to this property yet. Start by
          creating your first room to begin accepting bookings.
        </p>
        <Button
          onClick={onAddRoom}
          size="lg"
          className="shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Your First Room
        </Button>
      </CardContent>
    </Card>
  );
};

export const ErrorState = ({ error }: ErrorStateProps) => {
  return (
    <Card className="border-red-200 bg-red-50">
      <CardContent className="pt-6">
        <p className="text-red-600">Error: {error}</p>
      </CardContent>
    </Card>
  );
};

export const InvalidPropertyState = () => {
  return (
    <div className="text-center py-12">
      <p className="text-muted-foreground">Property ID not found</p>
    </div>
  );
};
