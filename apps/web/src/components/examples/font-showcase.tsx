/**
 * Font Showcase Component
 *
 * This component demonstrates the typography system for StayWise.
 * Use this as a reference for implementing consistent typography.
 *
 * You can temporarily add this to a page to preview the fonts.
 */

export function FontShowcase() {
  return (
    <div className="container mx-auto max-w-4xl p-8 space-y-12">
      {/* Display Font Examples */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 border-b pb-2">
          Playfair Display (Display Font)
        </h2>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-slate-600 mb-2">
              Hero Heading (7xl, Bold)
            </p>
            <h1 className="font-display text-7xl font-bold text-slate-900">
              Find Your Perfect Stay
            </h1>
          </div>

          <div>
            <p className="text-sm text-slate-600 mb-2">
              Section Heading (4xl, SemiBold)
            </p>
            <h2 className="font-display text-4xl font-semibold text-slate-900">
              Luxury Villas & Resorts
            </h2>
          </div>

          <div>
            <p className="text-sm text-slate-600 mb-2">
              Card Title (3xl, SemiBold)
            </p>
            <h3 className="font-display text-3xl font-semibold text-slate-900">
              The Grand Heritage Hotel
            </h3>
          </div>

          <div>
            <p className="text-sm text-slate-600 mb-2">
              Subheading (2xl, Medium)
            </p>
            <h4 className="font-display text-2xl font-medium text-slate-900">
              Discover Extraordinary Places
            </h4>
          </div>
        </div>
      </section>

      {/* Sans-Serif Font Examples */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 border-b pb-2">
          Plus Jakarta Sans (Body Font)
        </h2>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-slate-600 mb-2">Heading (3xl, Bold)</p>
            <h2 className="text-3xl font-bold text-slate-900">
              Featured Properties
            </h2>
          </div>

          <div>
            <p className="text-sm text-slate-600 mb-2">
              Subheading (xl, SemiBold)
            </p>
            <h3 className="text-xl font-semibold text-slate-900">
              Popular Destinations
            </h3>
          </div>

          <div>
            <p className="text-sm text-slate-600 mb-2">
              Body Text (base, Regular)
            </p>
            <p className="text-base text-slate-700">
              Browse thousands of verified properties with transparent pricing.
              Find apartments, villas, hotels, and unique stays worldwide. Book
              with confidence knowing all prices include taxes and fees.
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-600 mb-2">
              Small Text (sm, Medium)
            </p>
            <p className="text-sm font-medium text-slate-600">
              Starting from $120 per night • 4.8 ⭐ (124 reviews)
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-600 mb-2">
              Button Text (base, SemiBold)
            </p>
            <button className="px-6 py-3 bg-rose-500 text-white font-semibold rounded-lg hover:bg-rose-600 transition-colors">
              Book Now
            </button>
          </div>
        </div>
      </section>

      {/* Weight Comparison */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 border-b pb-2">
          Font Weights - Plus Jakarta Sans
        </h2>

        <div className="space-y-2">
          <p className="text-lg font-light text-slate-700">
            Light (300) - Subtle secondary text
          </p>
          <p className="text-lg font-normal text-slate-700">
            Regular (400) - Default body text
          </p>
          <p className="text-lg font-medium text-slate-700">
            Medium (500) - Labels and emphasis
          </p>
          <p className="text-lg font-semibold text-slate-700">
            SemiBold (600) - Subheadings
          </p>
          <p className="text-lg font-bold text-slate-700">
            Bold (700) - Headings and buttons
          </p>
          <p className="text-lg font-extrabold text-slate-700">
            ExtraBold (800) - Hero text
          </p>
        </div>
      </section>

      {/* Usage Examples */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 border-b pb-2">
          Real-World Examples
        </h2>

        {/* Property Card Example */}
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <div className="aspect-video bg-slate-200" />
          <div className="p-4 space-y-2">
            <h3 className="font-display text-xl font-semibold text-slate-900">
              Sunset Beach Villa
            </h3>
            <p className="text-sm text-slate-600">Bali, Indonesia</p>
            <p className="text-base text-slate-700">
              Stunning beachfront villa with private pool and panoramic ocean
              views. Perfect for couples or small families.
            </p>
            <div className="flex items-center justify-between pt-2">
              <span className="text-lg font-bold text-slate-900">
                $250/night
              </span>
              <span className="text-sm font-medium text-slate-600">
                4.9 ⭐ (87)
              </span>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg p-8 text-center space-y-4">
          <h2 className="font-display text-3xl font-bold text-slate-900">
            Ready for Your Next Adventure?
          </h2>
          <p className="text-lg text-slate-700 max-w-2xl mx-auto">
            Join thousands of travelers who trust StayWise for their
            accommodation needs
          </p>
          <button className="px-8 py-3 bg-rose-500 text-white font-semibold rounded-lg hover:bg-rose-600 transition-colors">
            Start Exploring
          </button>
        </div>
      </section>

      {/* Best Practices */}
      <section className="space-y-4 bg-blue-50 rounded-lg p-6">
        <h2 className="text-xl font-bold text-blue-900">
          Typography Best Practices
        </h2>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>
            ✅ Use{" "}
            <code className="bg-blue-100 px-2 py-1 rounded">font-display</code>{" "}
            for hero headings and premium property names
          </li>
          <li>
            ✅ Use Plus Jakarta Sans (default) for all UI elements and body text
          </li>
          <li>✅ Maintain clear hierarchy with font sizes and weights</li>
          <li>✅ Keep display font usage to ~10-20% for maximum impact</li>
          <li>❌ Don&apos;t use Playfair Display for small text (&lt;16px)</li>
          <li>❌ Don&apos;t mix too many font weights on one screen</li>
        </ul>
      </section>
    </div>
  );
}
