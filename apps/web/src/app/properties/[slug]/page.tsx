import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
// import { mockProperties } from "@/data/property.data";
import { HeaderBlock } from "./components/HeaderBlock";
import { ImageGallery } from "./components/ImageGallery";
import { StatsHeader } from "./components/StatsHeader";
import { AmenitiesSection } from "./components/AmenitiesSection";
import { SleepingArrangements } from "./components/SleepingArrangements";
import { LocationSection } from "./components/LocationSection";
import { Reviews } from "./components/Reviews";
import { BookingSidebar } from "./components/BookingSidebar";
import { mockPropertyDetails, mockProperties } from "./mockDetails";

interface PropertyDetailPageProps {
  params: { slug: string };
}

export default function PropertyDetailPage({
  params,
}: PropertyDetailPageProps) {
  const property = mockProperties.find(
    (p) => p.name.toLowerCase().replace(/\s+/g, "-") === params.slug
  );
  if (!property) notFound();

  const details = mockPropertyDetails.prop_1;
  const totalBedrooms = property.rooms?.length || 1;
  const totalBathrooms = property.rooms?.length || 1;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <HeaderBlock name={property.name} />

        <ImageGallery name={property.name} images={details.images} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <StatsHeader
              city={property.city}
              province={property.province}
              address={property.address}
              description={property.description}
              rating={details.rating}
              reviewCount={details.reviewCount}
              maxGuests={property.maxGuests}
              bedrooms={totalBedrooms}
              bathrooms={totalBathrooms}
            />
            <Separator className="my-6" />

            <section id="about" className="mb-8">
              <h3 className="text-xl font-semibold mb-3">
                About this property
              </h3>
              <div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {property.description}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  This beautiful property offers the perfect blend of comfort
                  and convenience. Whether you&apos;re here for business or
                  leisure, you&apos;ll find everything you need for a memorable
                  stay. The property features modern amenities and thoughtful
                  touches throughout.
                </p>
              </div>
            </section>
            <Separator className="my-6" />

            <div className="space-y-8">
              <AmenitiesSection property={property} />
              <Separator />

              <SleepingArrangements data={details.sleepingArrangements} />
              <Separator />

              <LocationSection
                address={property.address}
                city={property.city}
                landmarks={details.location.landmarks}
              />
              <Separator />

              <Reviews reviews={details.reviews} total={details.reviewCount} />
            </div>
          </div>

          <div className="lg:col-span-1">
            <BookingSidebar
              pricePerNight={details.pricePerNight}
              maxGuests={property.maxGuests}
            />
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Similar Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {details.nearbyProperties.map((p) => (
              <Card key={p.id} className="overflow-hidden">
                <div className="relative aspect-[16/9]">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    className="object-cover"
                  />
                  <Badge className="absolute top-3 left-3">
                    DATES AVAILABLE
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{p.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      {/* users icon intentionally omitted to reduce imports; can re-add */}
                      <span>{p.guests} Guests</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>{p.bedrooms} Bedrooms</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>{p.bathrooms} Bathrooms</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      From ${p.priceFrom}/night
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
