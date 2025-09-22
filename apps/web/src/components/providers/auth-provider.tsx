"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { ReactNode, useEffect } from "react";
import { setAuthToken } from "@/lib/axios";

function SessionTokenSync({ children }: { children: ReactNode }) {
  const { data: session } = useSession();

  useEffect(() => {
    const token = session?.user?.accessToken ?? null;
    setAuthToken(token);
  }, [session]);

  return <>{children}</>;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <SessionTokenSync>{children}</SessionTokenSync>
    </SessionProvider>
  );
}

export default AuthProvider;
