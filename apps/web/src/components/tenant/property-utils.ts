import type { RoomResponse, PropertyResponse } from "@repo/schemas";

export function getTotalRooms(property: PropertyResponse) {
  return property.Rooms?.length || 0;
}

export function getPriceRange(property: PropertyResponse) {
  if (!property.Rooms || property.Rooms.length === 0) return { min: 0, max: 0 };
  const prices = property.Rooms.map((room: RoomResponse) => room.basePrice);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

export function formatPriceDisplay(property: PropertyResponse) {
  const { min, max } = getPriceRange(property);
  if (min === max) return `$${min}`;
  return `$${min} - $${max}`;
}

export function getGuestRange(property: PropertyResponse) {
  if (!property.Rooms || property.Rooms.length === 0) {
    return { min: property.maxGuests ?? 0, max: property.maxGuests ?? 0 };
  }
  const guests = property.Rooms.map((room: RoomResponse) => room.capacity ?? 1);
  return { min: Math.min(...guests), max: Math.max(...guests) };
}

export function formatGuestDisplay(property: PropertyResponse) {
  const { min, max } = getGuestRange(property);
  return min === max ? `${min}` : `${min} - ${max}`;
}
