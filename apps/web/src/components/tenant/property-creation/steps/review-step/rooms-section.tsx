import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Bed, DollarSign, Users } from "lucide-react";

interface Room {
  name: string;
  basePrice: number;
  capacity?: number;
  bedCount?: number;
  bedType?: string;
  description?: string;
}

interface RoomsSectionProps {
  rooms?: Room[];
  onEdit: () => void;
}

export const RoomsSection = ({ rooms, onEdit }: RoomsSectionProps) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2">
      <Bed className="w-5 h-5 text-gray-500" />
      <Label className="text-base font-medium">
        Rooms ({rooms?.length || 0})
      </Label>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="ml-auto"
        onClick={onEdit}
      >
        Edit
      </Button>
    </div>
    <div className="ml-7 space-y-3">
      {rooms && rooms.length > 0 ? (
        rooms.map((room, index) => (
          <div key={index} className="p-3 border rounded-lg">
            <div className="flex items-center justify-between">
              <p className="font-medium">{room.name}</p>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                <span>${room.basePrice}/night</span>
              </div>
            </div>
            <div className="text-sm text-gray-600 mt-1">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {room.capacity} guests
                </span>
                <span>
                  {room.bedCount} {room.bedType?.toLowerCase()} bed(s)
                </span>
              </div>
              {room.description && <p className="mt-1">{room.description}</p>}
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No rooms added</p>
      )}
    </div>
  </div>
);
