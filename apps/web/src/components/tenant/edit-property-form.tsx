"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LocationPicker } from "@/components/ui/location-picker";
import { Label } from "@/components/ui/label";
import { Save, MapPin, Users, Building2, Camera } from "lucide-react";
import { api } from "@/lib/axios";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import Image from "next/image";
import type { PropertyResponse } from "@repo/schemas";

type Property = PropertyResponse & {
  Pictures?: Array<{ id: string; imageUrl: string; note?: string | null }>;
  Facilities?: Array<{ id: string; facility: string; note?: string | null }>;
};

interface EditPropertyFormProps {
  propertyId: string;
}

export function EditPropertyForm({ propertyId }: EditPropertyFormProps) {
  const { data: session } = useSession();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedImagePreviews, setSelectedImagePreviews] = useState<string[]>(
    []
  );
  const hiddenFileInput = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    country: "",
    city: "",
    address: "",
    maxGuests: 1,
    latitude: "",
    longitude: "",
  });

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const handleLocationSelect = (location: {
    lat: number;
    lng: number;
    address: string;
    city: string;
    country: string;
  }) => {
    setFormData((prev) => ({
      ...prev,
      latitude: location.lat.toString(),
      longitude: location.lng.toString(),
      address: location.address || prev.address,
      city: location.city || prev.city,
      country: location.country || prev.country,
    }));
  };

  // Fetch property data
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/properties/${propertyId}`, {
          headers: {
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
        });

        const propertyData = response.data.data;
        setProperty(propertyData);
        setFormData({
          name: propertyData.name || "",
          description: propertyData.description || "",
          country: propertyData.country || "",
          city: propertyData.city || "",
          address: propertyData.address || "",
          maxGuests: propertyData.maxGuests || 1,
          latitude: propertyData.latitude?.toString() || "",
          longitude: propertyData.longitude?.toString() || "",
        });
      } catch (error: unknown) {
        console.error("Error fetching property:", error);
        const errorMessage =
          error && typeof error === "object" && "response" in error
            ? (error as { response?: { data?: { message?: string } } }).response
                ?.data?.message
            : "Failed to update property";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.accessToken && propertyId) {
      fetchProperty();
    }
  }, [propertyId, session?.user?.accessToken]);

  useEffect(() => {
    if (selectedImages.length === 0) {
      setSelectedImagePreviews([]);
      return;
    }

    const previews = selectedImages.map((file) => URL.createObjectURL(file));
    setSelectedImagePreviews(previews);

    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [selectedImages]);

  const removeExistingPicture = (id: string) => {
    setProperty((prev: Property | null) => {
      if (!prev) return prev;
      const updatedPictures = (prev.Pictures || []).filter(
        (p: { id: string }) => p.id !== id
      );
      return {
        ...prev,
        Pictures: updatedPictures,
      } as Property;
    });
  };

  const removeSelectedImage = (index: number) => {
    setSelectedImagePreviews((prev) => {
      const url = prev[index];
      if (url) URL.revokeObjectURL(url);
      return prev.filter((_, i) => i !== index);
    });

    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "maxGuests" ? parseInt(value) || 1 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.accessToken) {
      toast.error("Please login to continue");
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("country", formData.country);
      formDataToSend.append("city", formData.city);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("maxGuests", formData.maxGuests.toString());

      if (formData.latitude) {
        formDataToSend.append("latitude", formData.latitude);
      }
      if (formData.longitude) {
        formDataToSend.append("longitude", formData.longitude);
      }

      if (property?.Pictures) {
        formDataToSend.append(
          "existingPictures",
          JSON.stringify(
            property.Pictures.map(
              (pic: {
                id: string;
                imageUrl: string;
                note?: string | null;
              }) => ({
                id: pic.id,
                imageUrl: pic.imageUrl,
                note: pic.note ?? null,
              })
            )
          )
        );
      }

      selectedImages.forEach((image) => {
        formDataToSend.append("propertyImages", image);
      });

      if (selectedImages.length > 0) {
        const picturesData = selectedImages.map((_, index) => ({
          fileIndex: index,
          note: null,
        }));
        formDataToSend.append("propertyPictures", JSON.stringify(picturesData));
      }

      const response = await api.put(
        `/properties/${propertyId}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Property updated successfully!");

      // Refresh property data
      const updatedProperty = response.data.data;
      setProperty(updatedProperty);
      setSelectedImages([]);
    } catch (error: unknown) {
      console.error("Error updating property:", error);
      const errorMessage =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : "Failed to update property";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">Property not found</h3>
        <p className="text-muted-foreground">
          The property you&apos;re looking for doesn&apos;t exist or you
          don&apos;t have permission to access it.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Edit Property</h1>
          <p className="text-muted-foreground">
            Update your property information and details
          </p>
        </div>
        <Button form="edit-property-form" type="submit" disabled={isSubmitting}>
          <Save className="h-4 w-4 mr-2" />
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <form
        id="edit-property-form"
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Property Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter property name"
                  maxLength={100}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your property..."
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxGuests">Maximum Guests</Label>
                <Input
                  id="maxGuests"
                  name="maxGuests"
                  type="number"
                  min="1"
                  value={formData.maxGuests}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Location Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {apiKey && (
                <div className="space-y-4">
                  <div>
                    <LocationPicker
                      onLocationSelect={handleLocationSelect}
                      apiKey={apiKey}
                      initialLocation={
                        formData.latitude && formData.longitude
                          ? {
                              lat: parseFloat(formData.latitude),
                              lng: parseFloat(formData.longitude),
                            }
                          : undefined
                      }
                      className="border rounded-lg p-4"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {" "}
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    placeholder="Enter country"
                    maxLength={60}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Enter city"
                    maxLength={100}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter full address"
                  required
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Property Images Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Property Images
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Display existing images */}
              {property.Pictures && property.Pictures.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Current Images</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-64 overflow-y-auto py-1">
                    {property.Pictures.map(
                      (picture: {
                        id: string;
                        imageUrl: string;
                        note?: string | null;
                      }) => (
                        <div
                          key={picture.id}
                          className="relative w-full h-40 overflow-hidden rounded-md"
                        >
                          <Image
                            src={picture.imageUrl}
                            alt="Property"
                            width={320}
                            height={200}
                            className="w-full h-full object-cover rounded-md"
                          />

                          {/* Remove existing picture button */}
                          <button
                            type="button"
                            onClick={() => removeExistingPicture(picture.id)}
                            className="absolute top-2 right-2 z-10 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/80 text-sm text-red-600 hover:bg-white"
                            aria-label="Remove image"
                          >
                            ×
                          </button>

                          {picture.note && (
                            <p className="text-xs text-muted-foreground mt-1 truncate">
                              {picture.note}
                            </p>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* File upload for new images */}
              <div>
                <Label htmlFor="images">Add New Images</Label>
                {/* Hidden actual file input */}
                <input
                  id="images-hidden"
                  ref={hiddenFileInput}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setSelectedImages((prev) => [...prev, ...files]);
                  }}
                  className="hidden"
                />

                {/* Visible button that summarizes selected filenames and triggers hidden input */}
                <button
                  type="button"
                  onClick={() => hiddenFileInput.current?.click()}
                  className="mt-1 w-full rounded-md border border-input px-3 py-2 text-left text-sm hover:bg-muted/50"
                >
                  {selectedImages.length === 0 ? (
                    <span className="text-muted-foreground">
                      Click to select images
                    </span>
                  ) : (
                    <span>
                      {selectedImages
                        .slice(0, 3)
                        .map((f) => f.name)
                        .join(", ")}
                      {selectedImages.length > 3 && (
                        <span className="ml-2 text-muted-foreground">
                          +{selectedImages.length - 3} more
                        </span>
                      )}
                    </span>
                  )}
                </button>
                {selectedImages.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground">
                      {selectedImages.length} new image(s) selected
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-64 overflow-y-auto py-1 mt-2">
                      {selectedImagePreviews.map((src, idx) => (
                        <div
                          key={idx}
                          className="relative w-full h-40 overflow-hidden rounded-md"
                        >
                          <Image
                            src={src}
                            alt={`preview-${idx}`}
                            width={320}
                            height={200}
                            className="w-full h-full object-cover rounded-md"
                          />

                          <button
                            type="button"
                            onClick={() => removeSelectedImage(idx)}
                            className="absolute top-2 right-2 z-10 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/80 text-sm text-red-600 hover:bg-white"
                            aria-label="Remove selected image"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Management Links */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Additional Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2"
                asChild
              >
                <a href={`/dashboard/tenant/properties/${propertyId}/rooms`}>
                  <Users className="h-6 w-6" />
                  <div className="text-center">
                    <div className="font-medium">Room Management</div>
                    <div className="text-xs text-muted-foreground">
                      Manage rooms
                    </div>
                  </div>
                </a>
              </Button>

              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2"
                asChild
              >
                <a
                  href={`/dashboard/tenant/properties/${propertyId}/availability`}
                >
                  <Users className="h-6 w-6" />
                  <div className="text-center">
                    <div className="font-medium">Availability</div>
                    <div className="text-xs text-muted-foreground">
                      Manage availability
                    </div>
                  </div>
                </a>
              </Button>

              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2"
                asChild
              >
                <a href={`/dashboard/tenant/properties/${propertyId}/category`}>
                  <Users className="h-6 w-6" />
                  <div className="text-center">
                    <div className="font-medium">Categories</div>
                    <div className="text-xs text-muted-foreground">
                      Manage categories
                    </div>
                  </div>
                </a>
              </Button>

              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2"
                asChild
              >
                <a href={`/dashboard/tenant/properties/${propertyId}/pricing`}>
                  <Users className="h-6 w-6" />
                  <div className="text-center">
                    <div className="font-medium">Pricing</div>
                    <div className="text-xs text-muted-foreground">
                      Adjust pricing
                    </div>
                  </div>
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
