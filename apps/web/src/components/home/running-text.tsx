"use client";

export default function RunningText() {
  const messages = [
    "Limited time: Save up to 30% on select stays",
    "24/7 support for guests",
    "Book early for exclusive perks",
  ];
  const separator = "    —    ";
  const track = messages.join(separator);

  return (
    <section className="w-full bg-slate-50 border-t border-b border-slate-100">
      <div className="overflow-hidden py-2">
        <div className="inline-flex whitespace-nowrap items-center w-[200%] marquee">
          <div className="inline-flex items-center pr-40">
            <span className="inline-block pr-40">{track}</span>
          </div>
          <div className="inline-flex items-center pr-40">
            <span className="inline-block pr-40">{track}</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .marquee {
          animation: marquee 22s linear infinite;
        }
      `}</style>
    </section>
  );
}
