import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Users, Star } from "lucide-react";
import { mockProperties } from "@/app/properties/[slug]/mockDetails";

export default function FeaturedProperties() {
  const featuredProperties = mockProperties.slice(0, 4);

  return (
    <section className="w-full py-6 md:py-12 bg-slate-50">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProperties.map((property) => (
            <Card
              key={property.id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-[4/3] bg-slate-200 relative overflow-hidden">
                <Image
                  src={`https://picsum.photos/400/300?random=${property.id}`}
                  alt={property.name}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <div className="text-sm text-slate-500 mb-2">
                  {property.city}
                </div>
                <CardTitle className="text-lg mb-2 line-clamp-1">
                  <Link
                    href={`/property-detail?id=${property.id}`}
                    className="hover:text-blue-600"
                  >
                    {property.name}
                  </Link>
                </CardTitle>

                <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{property.maxGuests} Guests</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>{property.rooms?.length || 0} Rooms</span>
                  </div>
                </div>

                <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                  {property.description}
                </p>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold">
                      ${property.rooms?.[0]?.basePrice || 0}
                      <span className="text-sm font-normal text-slate-600">
                        /night
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">4.8</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/search" className="inline-flex">
            <span className="inline-flex items-center justify-center h-10 px-8 rounded-md border text-sm font-medium hover:bg-slate-50">
              View All Properties
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
