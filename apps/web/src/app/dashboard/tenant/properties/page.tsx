import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { TenantPropertiesList } from "@/components/tenant/tenant-properties-list";
import { PropertyStats } from "@/components/tenant/property-stats";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function TenantPropertiesPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "TENANT") {
    redirect("/auth/signin");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">My Properties</h1>
          <p className="text-muted-foreground">
            Manage and view all your property listings
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/tenant/properties/add">
            <Plus className="h-4 w-4 mr-2" />
            Add New Property
          </Link>
        </Button>
      </div>

      <PropertyStats tenantId={session.user.id} />

      <TenantPropertiesList tenantId={session.user.id} />
    </div>
  );
}
