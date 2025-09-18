import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { EditPropertyForm } from "@/components/tenant/edit-property-form";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function EditPropertyPage({ params: { id } }: PageProps) {
  const session = await auth();

  if (!session?.user || session.user.role !== "TENANT") {
    redirect("/auth/signin");
  }

  return <EditPropertyForm propertyId={id} />;
}
