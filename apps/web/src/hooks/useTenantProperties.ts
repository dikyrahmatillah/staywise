"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "sonner";
import type { PropertyResponse, RoomResponse } from "@repo/schemas";

type TenantProperty = PropertyResponse & {
  Pictures?: { imageUrl: string; note?: string }[];
  Rooms?: RoomResponse[];
  _count?: { Bookings?: number; Reviews?: number };
};

const createApiInstance = (accessToken?: string) => {
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1",
  });

  if (accessToken) {
    api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  }

  return api;
};

export function useTenantProperties(tenantId: string) {
  const { data: session } = useSession();
  const [properties, setProperties] = useState<TenantProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = useCallback(async () => {
    if (!session?.user?.accessToken) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const api = createApiInstance(session.user.accessToken);
      const response = await api.get(`/properties/tenant/${tenantId}`);
      setProperties(response.data.data || []);
    } catch (err) {
      console.error("Error fetching properties:", err);
      setError("Failed to load properties");
      toast.error("Failed to load properties");
    } finally {
      setLoading(false);
    }
  }, [tenantId, session?.user?.accessToken]);

  const deleteProperty = useCallback(
    async (propertyId: string) => {
      if (!session?.user?.accessToken) return;

      try {
        const api = createApiInstance(session.user.accessToken);
        await api.delete(`/properties/id/${propertyId}`);
        setProperties((props) => props.filter((p) => p.id !== propertyId));
        toast.success("Property deleted successfully");
      } catch (err) {
        console.error("Error deleting property:", err);
        toast.error("Failed to delete property");
      }
    },
    [session?.user?.accessToken]
  );

  useEffect(() => {
    if (session?.user?.accessToken) {
      fetchProperties();
    }
  }, [fetchProperties, session?.user?.accessToken]);

  return {
    properties,
    loading,
    error,
    refetch: fetchProperties,
    deleteProperty,
  };
}
