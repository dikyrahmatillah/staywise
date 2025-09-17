"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

const BACKGROUNDS = [
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2000&q=80",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=2000&q=80",
  "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=2000&q=80",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=2000&q=80",
  "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=2000&q=80",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=2000&q=80",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=2000&q=80",
];

export default function HeroSection() {
  const [bg, setBg] = useState<string>(BACKGROUNDS[0]);

  useEffect(() => {
    const idx = Math.floor(Math.random() * BACKGROUNDS.length);
    setBg(BACKGROUNDS[idx]);
  }, []);

  return (
    <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-transparent">
      <div className="absolute inset-0 w-full h-full -z-10">
        <Image
          src={bg}
          alt="Hero background"
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="container mx-auto max-w-7xl relative px-4 md:px-6 z-10">
        <div className="flex flex-col items-center space-y-8 text-center text-white">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Find Your Perfect Rental Property
            </h1>
            <p className="mx-auto max-w-[700px] text-xl text-slate-200 md:text-2xl">
              for{" "}
              <Link
                href="/search?type=holidays"
                className="text-blue-400 hover:underline"
              >
                holidays
              </Link>
              ,{" "}
              <Link
                href="/search?type=business"
                className="text-blue-400 hover:underline"
              >
                business trips
              </Link>{" "}
              and{" "}
              <Link
                href="/search?type=family"
                className="text-blue-400 hover:underline"
              >
                family stays
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
