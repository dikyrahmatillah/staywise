"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  TooltipProps,
} from "recharts";
import { useBookings } from "@/hooks/useBookings";
import type { BookingTransaction } from "@repo/types";

// Helper: weekly date ranges for a month
const getWeekRanges = (date: Date): string[] => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const ranges: string[] = [];
  let start = 1;

  while (start <= daysInMonth) {
    const end = Math.min(start + 6, daysInMonth);
    ranges.push(`${start}-${end}`);
    start = end + 1;
  }

  return ranges;
};

// Dropdown options → last 6 months for flexibility
const generateMonthOptions = () => {
  const currentDate = new Date();
  const options = [];

  for (let monthOffset = 0; monthOffset <= 5; monthOffset++) {
    const monthDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - monthOffset,
      1
    );
    const monthName = monthDate.toLocaleDateString("en-US", { month: "long" });
    const monthValue = `${monthDate.getFullYear()}-${monthDate.getMonth()}`;

    options.push({
      value: monthValue,
      label: monthName,
      isCurrent: monthOffset === 0,
    });
  }

  return options;
};

interface ChartDataPoint {
  label: string;
  month: string;
  value: number;
  fill: string;
  isCurrentMonth: boolean;
}

export function BookingChart() {
  const { bookings, loading, error } = useBookings();
  const monthOptions = generateMonthOptions();
  const [activeIndex, setActiveIndex] = useState(-1);
  const [selectedMonth, setSelectedMonth] = useState(monthOptions[0].value);

  // Build chart data for 3 months window based on dropdown
  const chartData: ChartDataPoint[] = useMemo(() => {
    const colors = ["#ff2056", "#ff4d75", "#ff7390"];
    const data: ChartDataPoint[] = [];

    const [selYear, selMonth] = selectedMonth.split("-").map(Number);

    // 3 months window (selected month + prev 2)
    for (let monthOffset = 2; monthOffset >= 0; monthOffset--) {
      const monthDate = new Date(selYear, selMonth - monthOffset, 1);
      const monthName = monthDate.toLocaleDateString("en-US", { month: "short" });
      const ranges = getWeekRanges(monthDate);
      const isCurrentMonth =
        monthDate.getMonth() === new Date().getMonth() &&
        monthDate.getFullYear() === new Date().getFullYear();

      ranges.forEach((range, i) => {
        const value = bookings
          ? bookings.filter((b: BookingTransaction) => {
              const d = new Date(b.createdAt);
              return (
                d.getFullYear() === monthDate.getFullYear() &&
                d.getMonth() === monthDate.getMonth() &&
                d.getDate() >= parseInt(range.split("-")[0]) &&
                d.getDate() <= parseInt(range.split("-")[1])
              );
            }).length
          : 0;

        data.push({
          month: monthName,
          label: range,
          value,
          fill: colors[i % colors.length],
          isCurrentMonth,
        });
      });
    }
    return data;
  }, [bookings, selectedMonth]);

  // Tooltip (typed)
  const CustomTooltip = ({
    active,
    payload,
  }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as ChartDataPoint;
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border">
          <p className="font-semibold text-gray-700 text-sm">
            {data.month} ({data.label})
          </p>
          <p className="text-[#ff2056] font-medium">
            Bookings: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom XAxis tick → show month under first week only
  const CustomXAxisTick = (props: {
    x?: number;
    y?: number;
    payload?: { index?: number; value?: string };
  }) => {
    const { x = 0, y = 0, payload } = props;
    const dataPoint =
      payload?.index !== undefined ? chartData[payload.index] : null;

    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="middle"
          fill="#64748b"
          fontSize="12"
        >
          {dataPoint?.label}
        </text>
        {payload?.index !== undefined && payload.index % 4 === 0 && (
          <text
            x={0}
            y={20}
            dy={16}
            textAnchor="middle"
            fill="#111"
            fontSize="13"
            fontWeight="bold"
          >
            {dataPoint?.month}
          </text>
        )}
      </g>
    );
  };

  if (error) {
    return (
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0">
        <CardHeader>
          <CardTitle>Booking Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-80">
            <div className="text-center">
              <p className="text-red-500 text-lg font-medium">
                Error loading booking data
              </p>
              <p className="text-gray-500 text-sm mt-2">{error}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0">
      <CardHeader className="flex flex-row items-center justify-between mb-6">
        <CardTitle className="text-lg">
          Booking Insights
          {loading && (
            <span className="text-sm text-gray-500 ml-2">(Loading...)</span>
          )}
        </CardTitle>
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-40 border-0 shadow-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {monthOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label} {option.isCurrent && "(Current)"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-80 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(-1)}
              margin={{ bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={<CustomXAxisTick />}
                height={70}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#64748b" }}
                label={{
                  value: "Bookings",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} cursor="pointer">
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={activeIndex === index ? "#ff2056" : entry.fill}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        {!loading && chartData.every((d) => d.value === 0) && (
          <div className="text-center">
            <p className="text-gray-500">
              No booking data available for this 3-month period
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
