import { PropertyCreationWizard } from "@/components/tenant/property-creation/property-creation-wizard";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function AddPropertyPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/login");
  }

  if (session.user?.role !== "TENANT") {
    redirect("/dashboard");
  }

  return <PropertyCreationWizard />;
}
