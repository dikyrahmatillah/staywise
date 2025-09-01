import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PropertyTypes() {
  return (
    <section className="w-full py-16 md:py-24 bg-slate-50">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Properties for every occasion
          </h2>
        </div>

        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-30">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-12 h-12 border-2 border-slate-300 bg-white"
              aria-label="Previous"
            >
              <span className="text-lg">←</span>
            </Button>
          </div>

          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 max-w-6xl w-full">
              <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer">
                <Link href="/search?type=summer" className="block">
                  <div className="aspect-[4/3] bg-gradient-to-br from-red-600 to-red-700 relative overflow-hidden">
                    <div className="absolute inset-0">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-red-400/30 rounded-full -translate-y-16 translate-x-16"></div>
                      <div className="absolute bottom-0 left-0 w-48 h-48 bg-red-800/20 rounded-full translate-y-24 -translate-x-24"></div>
                    </div>

                    <div className="relative z-10 p-8 h-full flex flex-col justify-center">
                      <h3 className="text-5xl md:text-6xl font-black text-white leading-none mb-2">
                        SUMMER
                      </h3>
                      <h4 className="text-4xl md:text-5xl font-black text-blue-100 leading-none">
                        STAY
                      </h4>
                    </div>
                  </div>
                </Link>
              </Card>

              <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer">
                <Link href="/search?type=romantic" className="block">
                  <div className="aspect-[4/3] bg-gradient-to-br from-red-600 to-red-700 relative overflow-hidden">
                    <div className="absolute inset-0">
                      <div className="absolute top-1/4 left-1/4 w-24 h-24 bg-red-400/30 rounded-full"></div>
                      <div className="absolute bottom-1/3 right-1/3 w-16 h-16 bg-red-800/20 rounded-full"></div>
                    </div>

                    <div className="relative z-10 p-8 h-full flex flex-col justify-center">
                      <h3 className="text-4xl md:text-5xl font-black text-blue-100 leading-none mb-2">
                        FOR
                      </h3>
                      <h4 className="text-4xl md:text-5xl font-black text-blue-100 leading-none">
                        LOVERS
                      </h4>
                    </div>
                  </div>
                </Link>
              </Card>

              <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer">
                <Link href="/search?type=longterm" className="block">
                  <div className="aspect-[4/3] bg-gradient-to-br from-blue-400 to-blue-500 relative overflow-hidden">
                    <div className="absolute inset-0">
                      <div className="absolute top-0 left-0 w-40 h-40 bg-blue-300/30 rounded-full -translate-y-20 -translate-x-20"></div>
                      <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full translate-y-16 translate-x-16"></div>
                    </div>

                    <div className="relative z-10 p-8 h-full flex flex-col justify-center">
                      <h3 className="text-4xl md:text-5xl font-black text-red-600 leading-none mb-2">
                        SLOW
                      </h3>
                      <h4 className="text-4xl md:text-5xl font-black text-red-600 leading-none">
                        TRAVEL
                      </h4>
                    </div>
                  </div>
                </Link>
              </Card>
            </div>
          </div>

          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-30">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-12 h-12 border-2 border-slate-300 bg-white"
              aria-label="Next"
            >
              <span className="text-lg">→</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
