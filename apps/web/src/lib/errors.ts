import axios from "axios";

export function getErrorMessage(
  err: unknown,
  fallback = "Something went wrong"
) {
  if (axios.isAxiosError(err) && err.response?.data?.message) {
    return err.response.data.message as string;
  }
  return fallback;
}

export default getErrorMessage;
