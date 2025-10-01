import { auth } from "@/auth";
import { TenantPropertiesList } from "@/components/tenant/tenant-properties-list";
import { PropertyStats } from "@/components/tenant/property-stats";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";

export default async function TenantPropertiesPage() {
  const session = await auth();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div className="space-y-8">
        <DashboardPageHeader
          title="My Properties"
          description="Manage and view all your property listings in one place"
          action={
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
          }
        />

        <PropertyStats tenantId={session!.user.id} />

        <TenantPropertiesList tenantId={session!.user.id} />
      </div>
    </div>
  );
}
