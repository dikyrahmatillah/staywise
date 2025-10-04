import Link from "next/link";

interface PropertyBookingInfoProps {
  propertyId: string;
  propertyName: string;
  roomName: string;
  nights: number;
  truncate?: boolean; // Option to truncate or wrap
}

export const PropertyBookingInfo = ({
  propertyId,
  propertyName,
  roomName,
  nights,
  truncate = true, // Default to truncate
}: PropertyBookingInfoProps) => {
  const propertyNameClass = truncate
    ? "truncate md:max-w-[200px] lg:max-w-[200px]"
    : "line-clamp-2";

  return (
    <div className="flex flex-col gap-1 min-w-0">
      <Link
        href={`/properties/${propertyId}`}
        className={`font-medium font-sans text-base hover:text-primary hover:underline transition-colors ${propertyNameClass}`}
        title={propertyName} // Native browser tooltip as fallback
      >
        {propertyName}
      </Link>

      <p
        className="text-sm font-sans text-muted-foreground truncate"
        title={roomName}
      >
        {roomName}
      </p>

      <p className="text-sm font-sans text-muted-foreground">
        {nights} {nights === 1 ? "night" : "nights"}
      </p>
    </div>
  );
};
