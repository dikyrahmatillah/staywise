import Script from "next/script";
import { siteConfig } from "@/lib/metadata";

interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <Script
      id="json-ld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    description: siteConfig.description,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      availableLanguage: ["English"],
    },
    sameAs: [],
  };

  return <JsonLd data={jsonLd} />;
}

export function WebsiteJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/search?location={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return <JsonLd data={jsonLd} />;
}

interface PropertyJsonLdProps {
  property: {
    name: string;
    description: string;
    address: string;
    city: string;
    image?: string;
    rating?: number;
    reviewCount?: number;
    priceRange?: string;
  };
}

export function PropertyJsonLd({ property }: PropertyJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: property.name,
    description: property.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: property.address,
      addressLocality: property.city,
    },
    ...(property.image && { image: property.image }),
    ...(property.rating &&
      property.reviewCount && {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: property.rating,
          reviewCount: property.reviewCount,
        },
      }),
    ...(property.priceRange && { priceRange: property.priceRange }),
  };

  return <JsonLd data={jsonLd} />;
}
