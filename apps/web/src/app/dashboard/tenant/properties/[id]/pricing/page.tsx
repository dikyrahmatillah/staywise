import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PriceAdjustment } from "@/components/tenant/price-adjustment";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function PricingPage({ params: { id } }: PageProps) {
  const session = await auth();

  if (!session?.user || session.user.role !== "TENANT") {
    redirect("/auth/signin");
  }

  // TODO: Use property id to fetch and manage specific property pricing
  console.log("Property ID:", id);

  return <PriceAdjustment />;
}
