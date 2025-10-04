"use client";
import { useSession } from "next-auth/react";
import { EnhancedStats } from "@/components/tenant/overview/statistic-card";
import { BookingChart } from "@/components/tenant/overview/booking-chart";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function Dashboard() {
  const { data: session } = useSession();

  console.log("Dashboard session:", {
    user: session?.user,
    role: session?.user?.role,
    id: session?.user?.id,
    accessToken: session?.user?.accessToken ? "Present" : "Missing",
  });

  return (
    <div className="flex">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto p-6">
          <div className="mb-8">
            <EnhancedStats />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <BookingChart />
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0">
              <CardHeader className="flex items-center justify-between">
                <CardTitle>Booking Details</CardTitle>
                <Select defaultValue="october">
                  <SelectTrigger className="w-32 border-0 shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="october">October</SelectItem>
                    <SelectItem value="november">November</SelectItem>
                    <SelectItem value="december">December</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
