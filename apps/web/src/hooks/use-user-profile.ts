"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useSession } from "next-auth/react";

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName?: string | null;
  phone?: string | null;
  avatarUrl?: string | null;
  role: string;
}

export function useUserProfile() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!session?.user?.accessToken) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await api.get("/auth/profile", {
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
        },
      });

      setProfile(response.data.data);
      setError(null);
    } catch (err: unknown) {
      console.error("Error fetching profile:", err);
      let errorMessage = "Failed to fetch profile";

      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as {
          response?: { data?: { message?: string } };
        };
        errorMessage =
          axiosError.response?.data?.message || "Failed to fetch profile";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!session?.user?.accessToken) {
      setLoading(false);
      return;
    }

    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/auth/profile", {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        });

        setProfile(response.data.data);
        setError(null);
      } catch (err: unknown) {
        console.error("Error fetching profile:", err);
        let errorMessage = "Failed to fetch profile";

        if (err && typeof err === "object" && "response" in err) {
          const axiosError = err as {
            response?: { data?: { message?: string } };
          };
          errorMessage =
            axiosError.response?.data?.message || "Failed to fetch profile";
        }

        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [session?.user?.accessToken]);

  const refetch = () => {
    fetchProfile();
  };

  return { profile, loading, error, refetch };
}
