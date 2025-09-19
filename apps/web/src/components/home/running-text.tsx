"use client";

export default function RunningText() {
  const messages = [
    "Limited time: Save up to 100% on select stays",
    "24/7 support for guests",
    "Book early for exclusive perks",
  ];
  const separator = "    —    ";
  const track = messages.join(separator);

  return (
    <section className="w-full bg-slate-50 border-t border-b border-slate-100">
      <div className="overflow-hidden py-2">
        <div className="marquee">
          <div className="marquee__inner">
            <div className="marquee__item">
              <span className="marquee__text">{track}</span>
            </div>
            <div className="marquee__item">
              <span className="marquee__text">{track}</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
<<<<<<< Updated upstream
=======
        /* Seamless marquee: use translate3d, flex layout and prevent flex items from shrinking */
        :root { --marquee-duration: 22s; --marquee-gap: 4rem; }

        .marquee {
          overflow: hidden;
        }

        .marquee__inner {
          display: flex;
          width: 200%; /* two copies side-by-side */
          align-items: center;
          animation: marquee var(--marquee-duration) linear infinite;
          will-change: transform;
        }

        /* Pause animation when the user hovers or focuses the marquee */
        .marquee:hover .marquee__inner,
        .marquee:focus-within .marquee__inner {
          animation-play-state: paused;
        }

        .marquee__item {
          display: inline-flex;
          flex: 0 0 50%; /* each item takes half of the inner width */
          align-items: center;
          padding-right: var(--marquee-gap);
        }

        .marquee__text {
          display: inline-block;
          white-space: nowrap;
          padding-right: var(--marquee-gap);
        }

>>>>>>> Stashed changes
        @keyframes marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }

        /* Respect user's reduced motion preference */
        @media (prefers-reduced-motion: reduce) {
          .marquee__inner {
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}
