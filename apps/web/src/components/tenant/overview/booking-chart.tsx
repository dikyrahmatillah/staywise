"use client";

import { useMemo, useState } from "react";
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
  type TooltipProps,
} from "recharts";
import { useBookings } from "@/hooks/useBookings";
import type { BookingTransaction } from "@repo/types";

type ViewMode = "month" | "week";

interface ChartDataPoint {
  // Common
  value: number;
  fill: string;
  // Month mode
  monthLabel?: string; // e.g., "Jan"
  monthFullLabel?: string; // e.g., "January 2025"
  isCurrentMonth?: boolean;
  // Week mode
  rangeLabel?: string; // e.g., "1-7"
  weekMonthLabel?: string; // e.g., "Jan"
  isCurrentWeek?: boolean;
}

const MONTH_PRIMARY = "#ff2056";
const MONTH_SECONDARY = "#ff7390";

// Helpers
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

// Build 6 months with current month centered: -2, -1, 0, +1, +2, +3
const getSixMonthCenterRange = (center: Date): Date[] => {
  const result: Date[] = [];
  for (let offset = -2; offset <= 3; offset++) {
    result.push(new Date(center.getFullYear(), center.getMonth() + offset, 1));
  }
  return result;
};

export function BookingChart() {
  const { bookings, loading, error } = useBookings();
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [activeIndex, setActiveIndex] = useState(-1);

  const today = useMemo(() => new Date(), []);

  const chartData: ChartDataPoint[] = useMemo(() => {
    if (!bookings) return [];

    if (viewMode === "month") {
      // 6 months centered on current month
      const months = getSixMonthCenterRange(today);
      return months.map((monthDate) => {
        const month = monthDate.getMonth();
        const year = monthDate.getFullYear();
        const count =
          bookings?.filter((b: BookingTransaction) => {
            const d = new Date(b.createdAt);
            return d.getFullYear() === year && d.getMonth() === month;
          }).length ?? 0;

        const isCurrent =
          month === today.getMonth() && year === today.getFullYear();

        return {
          value: count,
          fill: isCurrent ? MONTH_PRIMARY : MONTH_SECONDARY,
          monthLabel: monthDate.toLocaleDateString("en-US", { month: "short" }),
          monthFullLabel: monthDate.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          }),
          isCurrentMonth: isCurrent,
        };
      });
    } else {
      // Week mode: current month's weekly breakdown
      const currentMonthStart = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );
      const ranges = getWeekRanges(currentMonthStart);
      return ranges.map((range) => {
        const [startStr, endStr] = range.split("-");
        const start = Number.parseInt(startStr, 10);
        const end = Number.parseInt(endStr, 10);

        const count =
          bookings?.filter((b: BookingTransaction) => {
            const d = new Date(b.createdAt);
            return (
              d.getFullYear() === today.getFullYear() &&
              d.getMonth() === today.getMonth() &&
              d.getDate() >= start &&
              d.getDate() <= end
            );
          }).length ?? 0;

        const isCurrentWeek =
          today.getDate() >= start && today.getDate() <= end;

        return {
          value: count,
          fill: isCurrentWeek ? MONTH_PRIMARY : MONTH_SECONDARY,
          rangeLabel: range,
          weekMonthLabel: currentMonthStart.toLocaleDateString("en-US", {
            month: "short",
          }),
          isCurrentWeek,
        };
      });
    }
  }, [bookings, today, viewMode]);

  // Tooltip
  const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as ChartDataPoint;

      if (viewMode === "month") {
        return (
          <div className="bg-white p-3 shadow-lg rounded-lg border">
            <p className="font-semibold text-gray-700 text-sm">
              {data.monthFullLabel}
            </p>
            <p className="text-[#ff2056] font-medium">
              Bookings: {payload[0].value}
            </p>
          </div>
        );
      }

      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border">
          <p className="font-semibold text-gray-700 text-sm">
            {data.weekMonthLabel} ({data.rangeLabel})
          </p>
          <p className="text-[#ff2056] font-medium">
            Bookings: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom tick for week mode to show the month under the first week
  const CustomWeekTick = (props: {
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
          {dataPoint?.rangeLabel}
        </text>
        {payload?.index === 0 && (
          <text
            x={0}
            y={20}
            dy={16}
            textAnchor="middle"
            fill="#111"
            fontSize="13"
            fontWeight="bold"
          >
            {dataPoint?.weekMonthLabel}
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
            <span className="text-[12px] text-gray-500 ml-2">(Loading...)</span>
          )}
        </CardTitle>
        <Select
          value={viewMode}
          onValueChange={(v: ViewMode) => setViewMode(v)}
        >
          <SelectTrigger className="w-32 border-0 shadow-sm">
            <SelectValue placeholder="View" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">Month</SelectItem>
            <SelectItem value="week">Week</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(-1)}
              margin={{ bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#d7d7d7" />
              {viewMode === "month" ? (
                <XAxis
                  dataKey="monthLabel"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  height={40}
                />
              ) : (
                <XAxis
                  dataKey="rangeLabel"
                  axisLine={false}
                  tickLine={false}
                  tick={<CustomWeekTick />}
                  height={70}
                />
              )}
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#64748b" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} cursor="pointer">
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={activeIndex === index ? MONTH_PRIMARY : entry.fill}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {!loading &&
          chartData.length > 0 &&
          chartData.every((d) => d.value === 0) && (
            <div className="text-center">
              <p className="text-gray-500">
                {viewMode === "month"
                  ? "No booking data available for this 6-month period"
                  : "No booking data available for this month"}
              </p>
            </div>
          )}
      </CardContent>
    </Card>
  );
}
