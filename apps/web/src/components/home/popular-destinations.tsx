"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";
import PagerControls from "@/components/ui/pager-controls";

const destinations = [
  {
    id: 1,
    name: "BALI BEACHES",
    image:
      "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?auto=format&fit=crop&w=800&q=80",
    href: "/properties?location=bali",
  },
  {
    id: 2,
    name: "JAKARTA CITY",
    image:
      "https://images.unsplash.com/photo-1555993539-1732b0258ff1?auto=format&fit=crop&w=800&q=80",
    href: "/properties?location=jakarta",
  },
  {
    id: 3,
    name: "YOGYAKARTA CULTURE",
    image:
      "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=800&q=80",
    href: "/properties?location=yogyakarta",
  },
  {
    id: 4,
    name: "BANDUNG HILLS",
    image:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
    href: "/properties?location=bandung",
  },
];

export default function PopularDestinations() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [current, setCurrent] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(1);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;

      let desired = 1;
      if (w >= 1024) desired = 4;
      else if (w >= 768) desired = 2;

      setSlidesPerView(desired);

      setCurrent((c) =>
        Math.min(c, Math.max(0, destinations.length - desired))
      );
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const maxIndex = Math.max(0, destinations.length - slidesPerView);

  const prev = () => setCurrent((c) => Math.max(0, c - 1));
  const next = () => setCurrent((c) => Math.min(maxIndex, c + 1));

  useEffect(() => {
    setCurrent((c) =>
      Math.min(c, Math.max(0, destinations.length - slidesPerView))
    );
  }, [slidesPerView]);

  return (
    <section className="w-full py-16 md:py-8 bg-white">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold sm:text-4xl text-slate-900">
                Popular Destinations
              </h2>
              <p className="text-slate-600">
                Discover the most sought-after destinations across Indonesia
              </p>
            </div>
          </div>

          {slidesPerView === 2 ? (
            <div className="grid grid-cols-2 gap-4 md:gap-0">
              {destinations.map((destination) => (
                <div key={destination.id}>
                  <Card className="overflow-hidden transition-all duration-300 group cursor-pointer shadow-none border-0 bg-transparent my-0 !p-0">
                    <Link href={destination.href} className="block">
                      <div className="relative overflow-hidden aspect-[2/3] md:aspect-[16/9] lg:aspect-[2/3]">
                        <Image
                          src={destination.image}
                          alt={destination.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />

                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300"></div>

                        <div className="absolute inset-0 flex items-center justify-center p-8">
                          <div className="border-2 border-white/80 p-6 text-center bg-black/10 backdrop-blur-sm">
                            <h3 className="text-2xl md:text-2xl sm:text-xl font-bold text-white tracking-wider leading-tight">
                              {destination.name}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </Card>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-hidden">
              <div
                ref={trackRef}
                className="flex flex-nowrap transition-transform duration-500"
                style={{
                  transform: `translateX(-${(current * 100) / slidesPerView}%)`,
                }}
              >
                {destinations.map((destination) => (
                  <div
                    key={destination.id}
                    style={{ flex: `0 0 ${100 / slidesPerView}%` }}
                    className="px-2 py-0 shrink-0"
                  >
                    <Card className="overflow-hidden transition-all duration-300 group cursor-pointer shadow-none border-0 bg-transparent my-0 !p-0">
                      <Link href={destination.href} className="block">
                        <div className="relative overflow-hidden aspect-[2/3] md:aspect-[3/4] lg:aspect-[2/3]">
                          <Image
                            src={destination.image}
                            alt={destination.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />

                          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300"></div>

                          <div className="absolute inset-0 flex items-center justify-center p-8">
                            <div className="border-2 border-white/80 p-6 text-center bg-black/10 backdrop-blur-sm">
                              <h3 className="text-2xl md:text-2xl sm:text-xl font-bold text-white tracking-wider leading-tight">
                                {destination.name}
                              </h3>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Mobile controls + progress bar (matches FeaturedProperties) */}
          {slidesPerView === 1 && (
            <PagerControls
              current={current}
              maxIndex={maxIndex}
              onPrev={prev}
              onNext={next}
            />
          )}
        </div>
      </div>
    </section>
  );
}
