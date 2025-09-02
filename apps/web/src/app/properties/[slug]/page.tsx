import PropertyDetailClient from "./PropertyDetailClient";

interface PropertyDetailPageProps {
  params: { slug: string };
}

export default function PropertyDetailPage({
  params,
}: PropertyDetailPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-24 py-8">
        <PropertyDetailClient slug={params.slug} />
      </div>
    </div>
  );
}
