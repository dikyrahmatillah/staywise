import Image from "next/image";

interface PropertyInfoProps {
  property:
    | {
        name: string;
        city: string;
      }
    | undefined;
  room:
    | {
        name: string;
      }
    | undefined;
}

export const PropertyInfo = ({ property, room }: PropertyInfoProps) => {
  if (!property || !room) {
    console.warn("PropertyInfo received undefined data:", { property, room });
    return (
      <div className="flex items-center gap-4">
        <div className="h-15 w-20 shrink-0 rounded-2xl overflow-hidden bg-gray-200">
          <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">
            No Image
          </div>
        </div>
        <div className="flex flex-col gap-1 min-w-0">
          <h3 className="font-medium text-base leading-6 line-clamp-2 text-gray-500">
            Property data unavailable
          </h3>
          <p className="text-xs text-muted-foreground leading-[18px]">
            {property?.city || "Location unknown"}
          </p>
          <p className="text-xs text-muted-foreground leading-[18px]">
            {room?.name || "Room unknown"}
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-4">
      <div className="h-15 w-20 shrink-0 rounded-2xl overflow-hidden">
        <Image
          src="/placeholder.svg"
          alt={property.name}
          width={80}
          height={60}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-col gap-1 min-w-0">
        <h3 className="font-medium text-base leading-6 line-clamp-2">
          {property.name}
        </h3>
        <p className="text-xs text-muted-foreground leading-[18px]">
          {property.city}
        </p>
        <p className="text-xs text-muted-foreground leading-[18px]">
          {room.name}
        </p>
      </div>
    </div>
  );
};
