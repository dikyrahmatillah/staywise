import { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Search Properties",
  description:
    "Find your perfect rental property. Search from thousands of verified listings including apartments, villas, and vacation homes.",
});

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
