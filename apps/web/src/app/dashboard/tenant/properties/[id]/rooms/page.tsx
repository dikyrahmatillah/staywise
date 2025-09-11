import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { RoomManagement } from "@/components/tenant/room-management";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function RoomManagementPage({
  params: { id },
}: PageProps) {
  const session = await auth();

  if (!session?.user || session.user.role !== "TENANT") {
    redirect("/auth/signin");
  }

  // TODO: Use property id to fetch and manage specific property rooms
  console.log("Property ID:", id);

  return <RoomManagement />;
}
