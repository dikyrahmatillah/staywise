"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";

const categories = [
  {
    id: 1,
    name: "Hotels",
    image:
      "https://images.unsplash.com/photo-1468824357306-a439d58ccb1c?auto=format&fit=crop&w=1200&q=80",
    href: "/properties?category=hotels",
  },
  {
    id: 2,
    name: "Apartments",
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
    href: "/properties?category=apartments",
  },
  {
    id: 3,
    name: "Villas",
    image:
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
    href: "/properties?category=villas",
  },
  {
    id: 4,
    name: "Resorts",
    image:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
    href: "/properties?category=resorts",
  },
  {
    id: 5,
    name: "Cabins",
    image:
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80",
    href: "/properties?category=cabins",
  },
  {
    id: 6,
    name: "Cottages",
    image:
      "https://images.unsplash.com/photo-1478689373814-b2f9a1150a4c?auto=format&fit=crop&w=1200&q=80",
    href: "/properties?category=cottages",
  },
  {
    id: 8,
    name: "Hostels",
    image:
      "https://images.unsplash.com/photo-1709805619372-40de3f158e83?auto=format&fit=crop&w=1200&q=80",
    href: "/properties?category=hostels",
  },
  {
    id: 9,
    name: "House",
    image:
      "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?auto=format&fit=crop&w=1200&q=80",
    href: "/properties?category=house",
  },
];

export default function PropertyCategories() {
  return (
    <section className="w-full py-8 md:py-12">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-xl font-bold sm:text-3xl text-slate-900">
                Property Categories
              </h2>
              <p className="text-sm md:text-base text-slate-600">
                Browse properties by popular categories
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 items-stretch">
          {categories.map((c) => (
            <Card
              key={c.id}
              className="overflow-hidden transition-all duration-300 group cursor-pointer shadow-none border-0 bg-transparent my-0 !p-0"
            >
              <Link href={c.href} className="block">
                <div className="relative overflow-hidden rounded-md h-36 md:h-40 lg:h-40">
                  <Image
                    src={c.image}
                    alt={c.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300"></div>

                  <div className="absolute left-3 bottom-3 pr-2">
                    <h3 className="text-base md:text-lg font-semibold text-white leading-tight">
                      {c.name}
                    </h3>
                  </div>
                </div>
              </Link>
            </Card>
          ))}
          <div className="col-span-2 sm:col-span-1 lg:col-span-2 ">
            <div className="h-36 md:h-40 rounded-md border border-slate-200 flex items-center justify-center p-4">
              <Link
                href="/properties"
                className="w-full h-full flex items-center justify-center"
              >
                <span className="text-lg md:text-xl font-semibold text-slate-900">
                  Browse all
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
