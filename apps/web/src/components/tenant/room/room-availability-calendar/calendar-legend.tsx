"use client";

function CalendarLegend() {
  return (
    <div className="flex gap-4 text-sm">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-green-100 border border-green-300 rounded" />
        <span>Available (Default)</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-red-100 border border-red-300 rounded" />
        <span>Unavailable</span>
      </div>
    </div>
  );
}

export default CalendarLegend;
