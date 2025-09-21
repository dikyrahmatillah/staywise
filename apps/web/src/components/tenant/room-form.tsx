"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { Room } from "@/types/room";
import type { CreateRoomInput, UpdateRoomInput } from "@repo/schemas";
import { useRoomForm } from "./room-form/use-room-form";
import { RoomFields } from "./room-form/room-fields";
import { ImageField } from "./room-form/image-field";

interface RoomFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (
    data: CreateRoomInput | UpdateRoomInput | FormData
  ) => Promise<void>;
  room?: Room;
  title: string;
  description: string;
}

export function RoomForm({
  open,
  onOpenChange,
  onSubmit,
  room,
  title,
  description,
}: RoomFormProps) {
  const {
    isSubmitting,
    formData,
    errors,
    handleInputChange,
    handleSelectChange,
    submit,
    fileInputRef,
    previewUrl,
    imageFile,
    chooseFileClick,
    pickImage,
    handleFileChange,
    truncateFileName,
  } = useRoomForm({ open, onOpenChange, onSubmit, room });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <Tabs defaultValue="room">
            <TabsList className="w-full">
              <TabsTrigger value="room" className="cursor-pointer">
                Room
              </TabsTrigger>
              <TabsTrigger value="image" className="cursor-pointer">
                Image
              </TabsTrigger>
            </TabsList>

            <TabsContent value="room">
              <RoomFields
                values={formData}
                errors={errors}
                disabled={isSubmitting}
                onChange={handleInputChange}
                onSelectChange={handleSelectChange}
              />
            </TabsContent>

            <TabsContent value="image">
              <ImageField
                isSubmitting={isSubmitting}
                fileInputRef={fileInputRef}
                previewUrl={previewUrl}
                imageFile={imageFile}
                onChooseFile={chooseFileClick}
                onPickImage={pickImage}
                onFileChange={handleFileChange}
                truncateFileName={truncateFileName}
                errors={errors}
              />
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {room ? "Update Room" : "Create Room"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
