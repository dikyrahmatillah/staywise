"use client";

import { useSearchParams } from "next/navigation";
import { format } from "date-fns";

export default function SearchPage() {
  const searchParams = useSearchParams();

  const location = searchParams.get("location") || "";
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const adults = searchParams.get("adults") || "0";
  const children = searchParams.get("children") || "0";
  const pets = searchParams.get("pets") || "0";

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="font-sans text-3xl font-bold mb-8">Search Results</h1>

      <div className="font-sans bg-white rounded-lg border p-6 mb-8">
        <h2 className="font-sans text-xl font-semibold mb-4">
          Search Parameters
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {location && (
            <div>
              <span className="font-sans font-medium text-gray-700">
                Location:
              </span>
              <p className="font-sans text-gray-900">{location}</p>
            </div>
          )}

          {checkIn && (
            <div>
              <span className="font-sans font-medium text-gray-700">
                Check-in:
              </span>
              <p className="font-sans text-gray-900">
                {format(new Date(checkIn), "MMM d, yyyy")}
              </p>
            </div>
          )}

          {checkOut && (
            <div>
              <span className="font-sans font-medium text-gray-700">
                Check-out:
              </span>
              <p className="font-sans text-gray-900">
                {format(new Date(checkOut), "MMM d, yyyy")}
              </p>
            </div>
          )}

          <div>
            <span className="font-sans font-medium text-gray-700">Guests:</span>
            <p className="font-sans text-gray-900">
              {adults} adult{parseInt(adults) > 1 ? "s" : ""}
              {parseInt(children) > 0 &&
                `, ${children} child${parseInt(children) > 1 ? "ren" : ""}`}
              {parseInt(pets) > 0 &&
                `, ${pets} pet${parseInt(pets) > 1 ? "s" : ""}`}
            </p>
          </div>
        </div>
      </div>

      <div className="text-center font-sans text-gray-500">
        <p>
          Property listings will be displayed here based on your search
          criteria.
        </p>
      </div>
    </div>
  );
}
