"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export function ImageGallery({
  name,
  images,
}: {
  name: string;
  images: string[];
}) {
  const primary = images[0];
  const rightTop = images[1];
  const rightBottom = images[2];

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <div className="relative w-full aspect-[16/9] overflow-hidden rounded-lg">
            {primary ? (
              <Image
                src={primary}
                alt={`${name} - photo 1`}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted/50 flex items-center justify-center">
                No image
              </div>
            )}

            <div className="absolute left-3 bottom-3">
              <Badge variant="secondary">{images.length} Photos</Badge>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="relative w-full aspect-[9/5] overflow-hidden rounded-lg">
            {rightTop ? (
              <Image
                src={rightTop}
                alt={`${name} - photo 2`}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted/50 flex items-center justify-center">
                No image
              </div>
            )}
          </div>
          <div className="relative w-full aspect-[9/5] overflow-hidden rounded-lg">
            {rightBottom ? (
              <Image
                src={rightBottom}
                alt={`${name} - photo 3`}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted/50 flex items-center justify-center">
                No image
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
