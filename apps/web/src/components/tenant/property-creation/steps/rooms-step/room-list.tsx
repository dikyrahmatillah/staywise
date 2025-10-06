"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bed, Trash2, DollarSign, Users } from "lucide-react";
import Image from "next/image";
import { RoomFormData } from "./types";
import formatRupiah from "@/lib/formatters";

type RoomListProps = {
  rooms: RoomFormData[];
  roomPreviews: Record<number, string>;
  onEdit: (index: number) => void;
  onRemove: (index: number) => void;
};

export function RoomList({
  rooms,
  roomPreviews,
  onEdit,
  onRemove,
}: RoomListProps) {
  if (rooms.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <Bed className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No rooms added yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
              Start by adding your first room with details and pricing above.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="mb-4 sm:mb-6 px-4 sm:px-6">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Bed className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          Added Rooms ({rooms.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {rooms.map((room, index) => {
            const previewSrc = roomPreviews[index] || room.imagePreview;
            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-xl border bg-white dark:bg-gray-900 p-4 sm:p-6 transition-all hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-2 justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start sm:items-center gap-3">
                      {previewSrc ? (
                        <div className="w-20 h-20 sm:w-20 sm:h-14 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800 flex-shrink-0">
                          <Image
                            src={previewSrc}
                            alt={room.name || "room image"}
                            width={80}
                            height={56}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="p-2 sm:p-2.5 bg-primary/10 dark:bg-primary/20 rounded-lg">
                          <Bed className="w-4 h-4 text-primary dark:text-primary" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100 truncate max-w-[200px] sm:max-w-none">
                          {room.name}
                        </h3>
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                          <Badge variant="secondary" className="text-xs">
                            <DollarSign className="w-3 h-3 mr-1" />
                            {formatRupiah(room.basePrice)} / night
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <Users className="w-3 h-3 mr-1" />
                            {room.capacity} guests
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {room.bedCount} {room.bedType?.toLowerCase()} bed(s)
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {room.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {room.description}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 mt-2 sm:mt-0 sm:ml-4 flex-shrink-0 w-full sm:w-auto">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(index)}
                      className="h-8 w-full sm:w-auto"
                    >
                      Edit
                    </Button>

                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => onRemove(index)}
                      className="h-8 w-full sm:w-auto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
