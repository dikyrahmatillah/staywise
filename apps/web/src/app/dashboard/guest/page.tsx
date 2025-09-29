import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default async function GuestDashboardPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "GUEST") {
    redirect("/auth/signin");
  }

  // TODO: Check if user has bookings or activities
  const hasBookings = false;
  const hasActivities = false;

  if (!hasBookings && !hasActivities) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-6">
        <div className="text-center max-w-md">
          {/* Image Placeholder */}
          <div className="mb-6 flex justify-center">
            <div className="relative flex items-center justify-center">
              <Image
                src="/assets/guest_dashboard_ES.png"
                alt="No Bookings"
                width={150}
                height={150}
                className="object-contain"
              />
            </div>
          </div>

          {/* Empty State Content */}
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            Welcome to StayWise!
          </h2>
          <p className="text-gray-600 mb-8">
            You haven&apos;t made any bookings yet. Start exploring amazing
            places to stay and create your first memorable experience.
          </p>

          {/* Call to Action */}
          <div className="space-y-3">
            <Link
              href="/properties"
              className="inline-block w-full sm:w-auto px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/80 transition-colors"
            >
              Browse Properties
            </Link>
            <div className="text-sm text-gray-500">
              Discover your perfect stay
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <div>Dashboard with bookings and activities</div>;
}
