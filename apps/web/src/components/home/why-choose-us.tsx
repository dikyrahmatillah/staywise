import { Calendar, Users, Star, Search } from "lucide-react";

export default function WhyChooseUs() {
  return (
    <section className="w-full py-16 md:py-24">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Why choose us for your stay?
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            We make it simple to find and book the right property for your
            needs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Curated Properties</h3>
            <p className="text-slate-600">
              Every property is personally selected — from modern apartments to
              luxury villas — so you know it&apos;s special before you book.
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Instant Booking</h3>
            <p className="text-slate-600">
              Book directly with property owners and get fast, personal
              responses. No call centers, no middlemen.
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Trusted Hosts</h3>
            <p className="text-slate-600">
              Our hosts know their properties inside out and offer local tips to
              make your stay memorable.
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
            <p className="text-slate-600">
              Pay the property owner directly. No agency fees, no added extras —
              just the best price for the property you want.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
