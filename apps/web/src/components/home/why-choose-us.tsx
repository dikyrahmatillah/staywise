import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { CalendarCheck, Gift, Headphones } from "lucide-react";

export default function WhyChooseUs() {
  const items = [
    {
      id: "flexible",
      title: "Flexible bookings",
      desc: "Change or cancel your reservation with minimal fuss and clear policies.",
      img: "https://images.unsplash.com/photo-1505691723518-36a2f6f3a8b7?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "perks",
      title: "Perks & savings",
      desc: "Unlock exclusive discounts, bundled extras, and member-only offers.",
      img: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "support",
      title: "24/7 customer support",
      desc: "Get help any time, from booking to check-out — we're always available.",
      img: "https://images.unsplash.com/photo-1496412705862-e0088f16f791?auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <section className="w-full py-8 md:py-12">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <div className=" mb-8">
          <h2 className="text-xl md:text-3xl font-bold mb-2">Why choose us?</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {items.map((it) => (
            <Card key={it.id} className="flex flex-row items-center gap-2 p-0">
              <div
                className="flex items-center justify-center w-16 h-16 border-r border-slate-100"
                aria-hidden
              >
                {it.id === "flexible" && (
                  <CalendarCheck className="w-6 h-6 text-sky-600" />
                )}
                {it.id === "perks" && (
                  <Gift className="w-6 h-6 text-purple-600" />
                )}
                {it.id === "support" && (
                  <Headphones className="w-6 h-6 text-orange-600" />
                )}
              </div>

              <CardContent className="flex-1 py-3 px-3">
                <CardTitle className="text-lg text-left">{it.title}</CardTitle>
                <p className="text-sm text-slate-600 mt-1 text-left">
                  {it.desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
