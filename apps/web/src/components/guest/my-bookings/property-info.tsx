import Image from "next/image"
import type { Property, Room } from "@/types/booking"

interface PropertyInfoProps {
  property: Property
  room: Room
}

export const PropertyInfo = ({ property, room }: PropertyInfoProps) => {
  return (
    <div className="flex items-center gap-4">
      <div className="h-15 w-20 shrink-0 rounded-2xl overflow-hidden">
        <Image
          src={property.thumbnail || "/placeholder.svg"}
          alt={property.name}
          width={80}
          height={60}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-col gap-1 min-w-0">
        <h3 className="font-medium text-base leading-6 line-clamp-2">{property.name}</h3>
        <p className="text-xs text-muted-foreground leading-[18px]">{property.location}</p>
        <p className="text-xs text-muted-foreground leading-[18px]">
          {room.name} • {room.type}
        </p>
      </div>
    </div>
  )
}
