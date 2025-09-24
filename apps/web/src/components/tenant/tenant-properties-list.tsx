"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";
import { useTenantProperties } from "@/hooks/useTenantProperties";
import PropertyCard from "@/components/ui/property-card";
import { Ellipsis } from "@/components/ui/ellipsis";

interface TenantPropertiesListProps {
  tenantId: string;
}

export function TenantPropertiesList({ tenantId }: TenantPropertiesListProps) {
  const { properties, loading, error, deleteProperty, refetch } =
    useTenantProperties(tenantId);

  const handleDeleteProperty = async (propertyId: string) => {
    if (!confirm("Are you sure you want to delete this property?")) {
      return;
    }
    await deleteProperty(propertyId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Ellipsis className="text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-red-500 mb-2">{error}</div>
          <Button onClick={() => void refetch()} variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (properties.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Properties Yet</h3>
          <p className="text-muted-foreground mb-4">
            You haven&apos;t added any properties to your portfolio yet.
          </p>
          <Button asChild>
            <Link href="/dashboard/tenant/properties/add">
              Add Your First Property
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          onDelete={handleDeleteProperty}
        />
      ))}
    </div>
  );
}
