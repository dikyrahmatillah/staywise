import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function GuestDashboardPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "GUEST") {
    redirect("/auth/signin");
  }
  return <div></div>;
}
