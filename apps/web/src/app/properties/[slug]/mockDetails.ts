export enum Amenities {
  WIFI = "WIFI",
  KITCHEN = "KITCHEN",
  SEA_VIEW = "SEA_VIEW",
  BALCONY = "BALCONY",
  AIR_CONDITIONER = "AIR_CONDITIONER",
}

export type Room = { id?: string; name: string; basePrice?: number };

export type Property = {
  id: string;
  name: string;
  city: string;
  province: string;
  address: string;
  description?: string;
  maxGuests?: number;
  rooms?: Room[];
  facilities?: { id: string; propertyId: string; facility: Amenities }[];
  pictureUrl?: string | null;
};

export const mockPropertyDetails = {
  prop_1: {
    images: ["https://source.unsplash.com/1600x900/?beach"],
    rating: 4.8,
    reviewCount: 139,
    pricePerNight: 120,
    sleepingArrangements: [
      { room: "Master Bedroom", beds: "1 King Bed" },
      { room: "Living Room", beds: "1 Sofa Bed" },
      { room: "Guest Bedroom", beds: "2 Twin Beds" },
    ],
    location: { landmarks: [{ name: "Kuta Beach", distance: "2 min walk" }] },
    reviews: [
      {
        id: "1",
        author: "Sarah",
        avatar: "/avatars/sarah.jpg",
        rating: 5,
        date: "2024-10-15",
        comment: "Great place.",
      },
      {
        id: "2",
        author: "John",
        avatar: "/avatars/john.jpg",
        rating: 4,
        date: "2024-10-14",
        comment: "Very nice stay.",
      },
    ],
    nearbyProperties: [
      {
        id: "prop_2",
        name: "Ocean View Villa",
        image: "https://source.unsplash.com/800x600/?ocean,villa",
        guests: 8,
        bedrooms: 4,
        bathrooms: 3,
        priceFrom: 280,
      },
      {
        id: "prop_3",
        name: "Mountain Retreat",
        image: "https://source.unsplash.com/800x600/?mountain,retreat",
        guests: 4,
        bedrooms: 2,
        bathrooms: 1,
        priceFrom: 180,
      },
      {
        id: "prop_4",
        name: "City Center Loft",
        image: "https://source.unsplash.com/800x600/?city,loft",
        guests: 2,
        bedrooms: 1,
        bathrooms: 1,
        priceFrom: 150,
      },
    ],
  },
};

// Minimal properties for listing and detail lookup.
export const mockProperties: Property[] = [
  {
    id: "prop_1",
    name: "Beachside Apartment",
    city: "Kuta",
    province: "Bali",
    address: "Jl. Pantai Kuta No.1",
    description: "A lovely beachside apartment with sea views.",
    maxGuests: 6,
    rooms: [{ name: "Master Bedroom", basePrice: 120 }],
    pictureUrl: "/images/properties/sea-breeze.jpg",
    facilities: [
      { id: "fac_1", propertyId: "prop_1", facility: Amenities.WIFI },
      { id: "fac_2", propertyId: "prop_1", facility: Amenities.KITCHEN },
      { id: "fac_3", propertyId: "prop_1", facility: Amenities.SEA_VIEW },
      { id: "fac_4", propertyId: "prop_1", facility: Amenities.BALCONY },
      {
        id: "fac_5",
        propertyId: "prop_1",
        facility: Amenities.AIR_CONDITIONER,
      },
    ],
  },
];
