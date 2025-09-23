"use client";

import { useCallback } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { CreatePropertyInput } from "@repo/schemas";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import useAuthToken from "@/hooks/useAuthToken";

type CreatePropertyResponse = { message?: string; data: unknown };

export function usePropertyCreation() {
  const { data: session } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();

  useAuthToken(session);

  const mutation = useMutation<
    CreatePropertyResponse,
    unknown,
    CreatePropertyInput | FormData
  >({
    mutationFn: async (data) => {
      const config =
        data instanceof FormData
          ? { headers: { "Content-Type": "multipart/form-data" } }
          : {};

      const res = await api.post<CreatePropertyResponse>(
        "/properties",
        data,
        config
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Property created successfully!");
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      router.push("/dashboard/tenant/properties");
    },
    onError: (err: unknown) => {
      console.error("Error creating property:", err);
      toast.error("Failed to create property. Please try again.");
    },
  });

  const createProperty = useCallback(
    async (data: CreatePropertyInput | FormData) => {
      if (!session?.user?.accessToken) {
        toast.error("You must be logged in to create a property");
        return null;
      }

      return mutation.mutateAsync(data);
    },
    [mutation, session?.user?.accessToken]
  );

  return {
    createProperty,
    isCreating: mutation.status === "pending",
  };
}
