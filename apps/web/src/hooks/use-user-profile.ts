"use client";

// ...existing code...
import { useSession } from "next-auth/react";
import { api } from "@/lib/axios";
import useAuthToken from "@/hooks/useAuthToken";
import useApiQuery from "@/hooks/useApiQuery";
import { getErrorMessage } from "@/lib/errors";

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName?: string | null;
  phone?: string | null;
  image?: string | null;
  role: string;
}

export function useUserProfile() {
  const { data: session, status } = useSession();

  useAuthToken(session);

  const { data, isPending, isFetching, error, refetch } = useApiQuery<
    UserProfile,
    Error
  >({
    queryKey: ["user-profile"],
    enabled: Boolean(session?.user?.accessToken),
    queryFn: async () => {
      const res = await api.get<{ message?: string; data: UserProfile }>(
        "/auth/profile"
      );
      return res.data.data;
    },
    errorMessage: "Failed to fetch profile",
  });

  return {
    profile: data ?? null,
    loading: status === "loading" ? true : isPending || isFetching,
    error: error ? getErrorMessage(error, "Failed to fetch profile") : null,
    refetch,
  } as const;
}
