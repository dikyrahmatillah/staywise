"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Users, Star } from "lucide-react";
import PagerControls from "@/components/ui/pager-controls";
import { useProperties } from "@/hooks/useProperties";
import type { Property } from "@/types/property";
import { useEffect, useState } from "react";

export default function FeaturedProperties() {
  const { data, isLoading, isError } = useProperties({ limit: 8 });
  const featuredProperties: Property[] = data?.data ?? [];

  const [current, setCurrent] = useState<number>(0);
  const [slidesPerView, setSlidesPerView] = useState<number>(1);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      let desired = 1;
      if (w >= 1024) desired = 4;
      else if (w >= 768) desired = 3;
      else if (w >= 640) desired = 2;

      setSlidesPerView(desired);
      setCurrent((c: number) =>
        Math.min(c, Math.max(0, featuredProperties.length - desired))
      );
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [featuredProperties.length]);

  const maxIndex = Math.max(0, featuredProperties.length - slidesPerView);
  const prev = () => setCurrent((c: number) => Math.max(0, c - 1));
  const next = () => setCurrent((c: number) => Math.min(maxIndex, c + 1));

  return (
    <section className="w-full py-6 md:py-12">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold sm:text-4xl text-slate-900">
                Featured Properties
              </h2>
              <p className="text-slate-600">Handpicked stays for you</p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500"
            style={{
              transform: `translateX(-${(current * 100) / slidesPerView}%)`,
            }}
          >
            {isLoading && (
              <div className="w-full text-center text-slate-500">
                Loading...
              </div>
            )}

            {isError && (
              <div className="w-full text-center text-red-500">
                Failed to load properties
              </div>
            )}

            {featuredProperties.map((property) => (
              <div
                key={property.id}
                style={{ flex: `0 0 ${100 / slidesPerView}%` }}
                className="px-2"
              >
                <Card className="overflow-hidden transition-shadow border-none shadow-none bg-transparent">
                  <div className="aspect-[4/3] bg-slate-200 relative rounded-xl overflow-hidden">
                    <Image
                      src={
                        property.imageUrl ||
                        `https://picsum.photos/400/300?random=${property.id}`
                      }
                      alt={property.name}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-1">
                    <div className="text-sm text-slate-500 mb-0.5">
                      {property.city}
                    </div>
                    <CardTitle className="text-lg mb-0.5 line-clamp-1">
                      <Link
                        href={`/properties/${property.slug}`}
                        className="hover:text-blue-600"
                      >
                        {property.name}
                      </Link>
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{property.maxGuests} Guests</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>{property.Rooms.length || 0} Rooms</span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 mb-1 line-clamp-2">
                      {property.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-bold">
                          ${property.Rooms[0]?.basePrice || 0}
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
              </div>
            ))}
          </div>
        </div>
        <PagerControls
          current={current}
          maxIndex={maxIndex}
          onPrev={prev}
          onNext={next}
        />
      </div>
    </section>
  );
}
