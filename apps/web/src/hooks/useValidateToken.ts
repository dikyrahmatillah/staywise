import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { extractErrorMessage } from "@/lib/auth-error.utils";

export function useValidateToken(token?: string, type?: string) {
  const [isLoading, setIsLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      setIsValid(false);
      setError("Missing token");
      return;
    }

    let mounted = true;

    const validate = async () => {
      try {
        await api.get("/auth/validate-token", {
          params: { token, type },
        });
        if (!mounted) return;
        setIsValid(true);
      } catch (err: unknown) {
        if (!mounted) return;
        const message =
          extractErrorMessage(err) ||
          (err instanceof Error ? err.message : "Invalid or expired token");
        setError(message);
        setIsValid(false);
      } finally {
        if (!mounted) return;
        setIsLoading(false);
      }
    };

    validate();

    return () => {
      mounted = false;
    };
  }, [token, type]);

  return { isLoading, isValid, error } as const;
}
