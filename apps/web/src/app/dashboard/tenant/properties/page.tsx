import { auth } from "@/auth";
import { TenantPropertiesList } from "@/components/tenant/tenant-properties-list";
import { PropertyStats } from "@/components/tenant/property-stats";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function TenantPropertiesPage() {
  const session = await auth();

  return (
    <div className="min-h-screen">
      <div className="p-6 border-l ">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight ">
                My Properties
              </h1>
              <p className="text-lg text-muted-foreground max-w-md">
                Manage and view all your property listings in one place
              </p>
            </div>
            <Button
              asChild
              size="lg"
              className="shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <Link href="/dashboard/tenant/properties/add">
                <Plus className="h-5 w-5 mr-2" />
                Add New Property
              </Link>
            </Button>
          </div>

          <PropertyStats tenantId={session!.user.id} />

          <TenantPropertiesList tenantId={session!.user.id} />
        </div>
      </div>
    </div>
  );
}
