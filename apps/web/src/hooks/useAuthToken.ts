"use client";

import { useEffect } from "react";
import { setAuthToken } from "@/lib/axios";
import type { Session } from "next-auth";

export function useAuthToken(session?: Session | null) {
  useEffect(() => {
    setAuthToken(session?.user?.accessToken ?? null);
  }, [session?.user?.accessToken]);
}

export default useAuthToken;
