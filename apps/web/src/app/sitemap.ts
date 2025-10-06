import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://staywise.com";
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  try {
    const response = await fetch(`${apiUrl}/api/properties?limit=100`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      console.error("Failed to fetch properties for sitemap");
      return staticRoutes;
    }

    const { data } = await response.json();
    const properties = data.properties || [];

    const propertyRoutes: MetadataRoute.Sitemap = properties.map(
      (property: { slug: string; updatedAt?: string }) => ({
        url: `${baseUrl}/properties/${property.slug}`,
        lastModified: property.updatedAt
          ? new Date(property.updatedAt)
          : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })
    );

    return [...staticRoutes, ...propertyRoutes];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return staticRoutes;
  }
}
