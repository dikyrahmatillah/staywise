import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { CategoryManagement } from "@/components/tenant/category-management";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function CategoryPage({ params: { id } }: PageProps) {
  const session = await auth();

  if (!session?.user || session.user.role !== "TENANT") {
    redirect("/auth/signin");
  }

  // TODO: Use property id to fetch and manage specific property categories
  console.log("Property ID:", id);

  return <CategoryManagement />;
}
