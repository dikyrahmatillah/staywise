import { Metadata } from "next";
import { cache } from "react";
import PropertyDetails from "./PropertyDetails";
import { constructMetadata } from "@/lib/metadata";
import type { DetailResponse } from "@/types/property-detail";

interface PropertyDetailPageProps {
  params: { slug: string } | Promise<{ slug: string }>;
}

const fetchPropertyDetails = cache(
  async (slug: string): Promise<DetailResponse | null> => {
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
      const response = await fetch(`${baseUrl}/properties/${slug}`, {
        next: { revalidate: 3600 },
      });

      if (!response.ok) {
        console.error(
          `Failed to fetch property: ${response.status} ${response.statusText}`
        );
        return null;
      }

      const result = await response.json();
      return result.data as DetailResponse;
    } catch (error) {
      console.error("Error fetching property details:", error);
      return null;
    }
  }
);

export async function generateMetadata({
  params,
}: PropertyDetailPageProps): Promise<Metadata> {
  const { slug } = await params;

  const property = await fetchPropertyDetails(slug);

  console.log("[generateMetadata] Slug:", slug);
  console.log("[generateMetadata] Property:", property ? "Found" : "Not found");
  console.log(
    "[generateMetadata] Property data:",
    property ? { name: property.name, city: property.city } : "No property data"
  );

  if (!property) {
    return constructMetadata({
      title: "Property Details",
      description:
        "View property details and book your perfect stay on StayWise",
    });
  }

  const firstImage = property.Pictures?.[0]?.imageUrl || "/images/og-image.jpg";

  const reviewCount = Number(property.reviewCount) || 0;
  const avgRating =
    reviewCount > 0
      ? property.Reviews?.reduce(
          (sum: number, r: { rating?: number }) => sum + (r.rating || 0),
          0
        ) / reviewCount
      : 0;

  const ratingText =
    avgRating > 0 ? `${avgRating.toFixed(1)}⭐ (${reviewCount} reviews)` : "";

  console.log(
    "[generateMetadata] Generated title:",
    `${property.name} - ${property.city}`
  );

  return constructMetadata({
    title: `${property.name} - ${property.city}`,
    description: `${
      property.description?.slice(0, 155) || "Discover this amazing property"
    }... ${ratingText} | Book now on StayWise`,
    image: firstImage,
  });
}

export default async function PropertyDetailPage({
  params,
}: PropertyDetailPageProps) {
  const { slug } = await params;

  const initialPropertyData = await fetchPropertyDetails(slug);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-2">
        <PropertyDetails slug={slug} initialData={initialPropertyData} />
      </div>
    </div>
  );
}
