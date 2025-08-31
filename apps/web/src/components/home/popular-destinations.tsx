import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";

const destinations = [
  {
    id: 1,
    name: "BALI BEACHES",
    image:
      "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?auto=format&fit=crop&w=800&q=80",
    href: "/search?location=bali",
  },
  {
    id: 2,
    name: "JAKARTA CITY",
    image:
      "https://images.unsplash.com/photo-1555993539-1732b0258ff1?auto=format&fit=crop&w=800&q=80",
    href: "/search?location=jakarta",
  },
  {
    id: 3,
    name: "YOGYAKARTA CULTURE",
    image:
      "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=800&q=80",
    href: "/search?location=yogyakarta",
  },
  {
    id: 4,
    name: "LOMBOK ISLANDS",
    image:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
    href: "/search?location=lombok",
  },
];

export default function PopularDestinations() {
  return (
    <section className="w-full py-16 md:py-24 bg-white">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="">
          <h2 className="text-3xl font-bold sm:text-4xl mb-4 text-slate-900">
            Popular Destinations
          </h2>
          <p className="text-slate-600">
            Discover the most sought-after destinations across Indonesia
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((destination) => (
            <Card
              key={destination.id}
              className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
            >
              <Link href={destination.href} className="block">
                <div className="aspect-[4/5] relative overflow-hidden">
                  <Image
                    src={destination.image}
                    alt={destination.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300"></div>

                  <div className="absolute inset-0 flex items-center justify-center p-8">
                    <div className="border-2 border-white/80 p-6 text-center bg-black/10 backdrop-blur-sm">
                      <h3 className="text-2xl md:text-3xl font-bold text-white tracking-wider leading-tight">
                        {destination.name}
                      </h3>
                    </div>
                  </div>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
