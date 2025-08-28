export default function Home() {
  return (
    <main className="flex-1">
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-sans font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Find Your Perfect Rental Property
              </h1>
              <p className="mx-auto max-w-[700px] font-sans text-gray-500 md:text-xl dark:text-gray-400">
                Discover amazing properties for rent. From cozy apartments to
                luxurious houses, we have the perfect place for your next stay.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
