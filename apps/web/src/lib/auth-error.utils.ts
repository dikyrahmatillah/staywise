export function extractErrorMessage(err: unknown): string | undefined {
  if (typeof err === "object" && err && "response" in err) {
    const resp = err as { response?: { data?: { message?: string } } };
    return resp.response?.data?.message;
  }
  return undefined;
}
