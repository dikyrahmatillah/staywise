"use client";

import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "sonner";
import { CreatePropertyInput } from "@repo/schemas";
import { useRouter } from "next/navigation";

const createApiInstance = (accessToken?: string) => {
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1",
  });

  if (accessToken) {
    api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  }

  return api;
};

export function usePropertyCreation() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const createProperty = useCallback(
    async (data: CreatePropertyInput | FormData) => {
      if (!session?.user?.accessToken) {
        toast.error("You must be logged in to create a property");
        return null;
      }

      try {
        setIsCreating(true);
        const api = createApiInstance(session.user.accessToken);

        // Debug the data being sent
        if (data instanceof FormData) {
          console.log("Sending FormData with files");
          // Log FormData entries for debugging
          for (const [key, value] of data.entries()) {
            if (value instanceof File) {
              console.log(`${key}: File(${value.name}, ${value.size} bytes)`);
            } else {
              console.log(`${key}: ${value}`);
            }
          }
        } else {
          console.log("Sending property data:", JSON.stringify(data, null, 2));
        }

        const config =
          data instanceof FormData
            ? {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            : {};

        const response = await api.post("/properties", data, config);

        toast.success("Property created successfully!");

        router.push("/dashboard/tenant/properties");

        return response.data.data;
      } catch (error: unknown) {
        console.error("Error creating property:", error);

        if (error && typeof error === "object" && "response" in error) {
          const axiosError = error as {
            response?: { data?: { message?: string }; status?: number };
          };
          console.error("Error response:", axiosError.response?.data);

          if (axiosError.response?.data?.message) {
            toast.error(axiosError.response.data.message);
          } else if (axiosError.response?.status === 401) {
            toast.error("You are not authorized to create properties");
          } else if (axiosError.response?.status === 400) {
            toast.error(
              `Invalid property data: ${
                axiosError.response?.data?.message ||
                "Please check your inputs."
              }`
            );
          } else {
            toast.error("Failed to create property. Please try again.");
          }
        } else {
          toast.error("Failed to create property. Please try again.");
        }

        return null;
      } finally {
        setIsCreating(false);
      }
    },
    [session?.user?.accessToken, router]
  );

  return {
    createProperty,
    isCreating,
  };
}
