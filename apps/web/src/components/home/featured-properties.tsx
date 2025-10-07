"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import PagerControls from "@/components/ui/pager-controls";
import { useProperties } from "@/hooks/useProperties";
import type { Property } from "@/types/property";
import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/booking-formatters";

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
    <section className="w-full py-8 md:py-12">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-xl font-bold sm:text-3xl text-slate-900">
                Featured Properties
              </h2>
              <p className="text-sm md:text-base text-slate-600">
                Handpicked stays for you
              </p>
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
                <Link
                  href={`/properties/${property.slug}`}
                  aria-label={`View details for ${property.name}`}
                  className="block"
                >
                  <Card className="overflow-hidden py-0 transition-shadow border bg-white shadow-sm">
                    <div className="aspect-[4/3] bg-slate-200 relative overflow-hidden">
                      <Image
                        src={property.Pictures[0]?.imageUrl}
                        alt={property.name}
                        width={400}
                        height={300}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="px-3 py-3">
                      <CardTitle className="text-md mb-1 line-clamp-1">
                        {property.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                        <span>
                          {property.city}, {property.country}
                        </span>
                      </div>

                      <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                        {property.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-md font-bold">
                            {formatCurrency(property.priceFrom ?? 0)}
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
                </Link>
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
