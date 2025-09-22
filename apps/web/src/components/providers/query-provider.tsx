"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            gcTime: 1000 * 60 * 30,
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            refetchOnReconnect: false,
          },
        },
      })
  );

  const [Devtools, setDevtools] = React.useState<React.ComponentType<{
    initialIsOpen?: boolean;
  }> | null>(null);

  React.useEffect(() => {
    if (process.env.NODE_ENV === "production") return;

    let mounted = true;
    import("@tanstack/react-query-devtools")
      .then((mod) => {
        if (mounted && mod && mod.ReactQueryDevtools) {
          setDevtools(() => mod.ReactQueryDevtools);
        }
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {Devtools ? <Devtools initialIsOpen={false} /> : null}
    </QueryClientProvider>
  );
}

export default QueryProvider;
