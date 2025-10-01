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
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// Sample data for the deals table
// const dealsData = [
//   {
//     id: 1,
//     productName: "Apple Watch",
//     location: "6096 Marjolaine Landing",
//     dateTime: "12.09.2019 - 12.53 PM",
//     piece: 423,
//     amount: "$34,295",
//     status: "Delivered",
//   },
//   {
//     id: 2,
//     productName: "iPhone 15 Pro",
//     location: "1234 Tech Avenue",
//     dateTime: "15.09.2019 - 10.30 AM",
//     piece: 156,
//     amount: "$156,000",
//     status: "Pending",
//   },
//   {
//     id: 3,
//     productName: "MacBook Pro",
//     location: "5678 Innovation Street",
//     dateTime: "18.09.2019 - 3.45 PM",
//     piece: 89,
//     amount: "$178,000",
//     status: "Processing",
//   },
// ];

export default function Dashboard() {
  const { data: session } = useSession();

  // For debugging - remove after fixing
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
              {/* <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Product Name
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Location
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Date - Time
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Piece
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Amount
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dealsData.map((deal) => (
                      <tr
                        key={deal.id}
                        className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src="/apple-watch-lifestyle.png" />
                              <AvatarFallback>AW</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">
                              {deal.productName}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-600">
                          {deal.location}
                        </td>
                        <td className="py-4 px-4 text-gray-600">
                          {deal.dateTime}
                        </td>
                        <td className="py-4 px-4 text-gray-600">
                          {deal.piece}
                        </td>
                        <td className="py-4 px-4 font-medium">{deal.amount}</td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              deal.status === "Delivered"
                                ? "bg-green-100 text-green-800"
                                : deal.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {deal.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent> */}
            </Card>
          </div>

          {/* Deals Table */}
        </main>
      </div>
    </div>
  );
}
