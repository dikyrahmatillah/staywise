import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { RoomAvailability } from "@/components/tenant/room-availability";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function AvailabilityPage({ params: { id } }: PageProps) {
  const session = await auth();

  if (!session?.user || session.user.role !== "TENANT") {
    redirect("/auth/signin");
  }

  // TODO: Use property id to fetch and manage specific property availability
  console.log("Property ID:", id);

  return <RoomAvailability />;
}
