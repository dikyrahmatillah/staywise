"use client";

import React, { useRef, useMemo } from "react";
import { usePropertyCreation } from "../property-creation-context";
import { RoomForm } from "./rooms-step/room-form";
import { RoomList } from "./rooms-step/room-list";
import { useRoomForm, useRoomPreviews } from "./rooms-step/use-room";
import { RoomFormData } from "./rooms-step/types";

export function RoomsStep() {
  const { formData, updateFormData } = usePropertyCreation();
  const formRef = useRef<HTMLDivElement>(null);

  const {
    formData: roomFormData,
    editingIndex,
    handleFieldChange,
    handleImageSelect,
    handleImageRemove,
    resetForm,
    loadRoom,
    isFormValid,
  } = useRoomForm();

  const rooms = useMemo(() => formData.rooms || [], [formData.rooms]);
  const roomPreviews = useRoomPreviews(rooms);

  const handleAddOrUpdateRoom = () => {
    if (!isFormValid()) return;

    const savedPreview = roomFormData.imageFile
      ? URL.createObjectURL(roomFormData.imageFile)
      : roomFormData.imagePreview;

    const roomToAdd: RoomFormData = {
      name: roomFormData.name,
      description: roomFormData.description || undefined,
      basePrice: roomFormData.basePrice,
      capacity: roomFormData.capacity || 1,
      bedType: roomFormData.bedType,
      bedCount: roomFormData.bedCount || 1,
      imageFile: roomFormData.imageFile,
      imagePreview: savedPreview,
    };

    if (editingIndex !== null && typeof editingIndex === "number") {
      const updatedRooms = rooms.map((r: RoomFormData, i: number) =>
        i === editingIndex ? roomToAdd : r
      );
      updateFormData({ rooms: updatedRooms });
    } else {
      updateFormData({ rooms: [...rooms, roomToAdd] });
    }

    resetForm();
  };

  const handleEditRoom = (index: number) => {
    const room = rooms[index] as RoomFormData;
    if (!room) return;

    loadRoom(room, index);

    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      const el = formRef.current?.querySelector<HTMLInputElement>("#roomName");
      el?.focus();
    }, 50);
  };

  const handleRemoveRoom = (index: number) => {
    const updatedRooms = rooms.filter(
      (_: RoomFormData, i: number) => i !== index
    );
    updateFormData({ rooms: updatedRooms });
  };

  return (
    <div className="space-y-6">
      <RoomForm
        formData={roomFormData}
        isEditing={editingIndex !== null}
        isValid={isFormValid()}
        onFieldChange={handleFieldChange}
        onImageSelect={handleImageSelect}
        onImageRemove={handleImageRemove}
        onSubmit={handleAddOrUpdateRoom}
        onCancel={resetForm}
      />

      <RoomList
        rooms={rooms}
        roomPreviews={roomPreviews}
        onEdit={handleEditRoom}
        onRemove={handleRemoveRoom}
      />
    </div>
  );
}
