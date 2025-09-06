import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const userRole = session.user.role;
  if (userRole === "TENANT") {
    redirect("/dashboard/tenant");
  } else if (userRole === "USER") {
    redirect("/dashboard/guest");
  } else {
    redirect("/");
  }
}
