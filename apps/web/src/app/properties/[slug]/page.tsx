import PropertyDetailClient from "./PropertyDetailClient";

interface PropertyDetailPageProps {
  params: { slug: string } | Promise<{ slug: string }>;
}

export default async function PropertyDetailPage({
  params,
}: PropertyDetailPageProps) {
  const { slug } = await params;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-2">
        <PropertyDetailClient slug={slug} />
      </div>
    </div>
  );
}
