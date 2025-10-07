import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Image as ImageIcon } from "lucide-react";
import type { PictureFormData } from "../../types";

interface PhotosSectionProps {
  pictures?: PictureFormData[];
  onEdit: () => void;
}

export const PhotosSection = ({ pictures, onEdit }: PhotosSectionProps) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2">
      <ImageIcon className="w-5 h-5 text-gray-500" />
      <Label className="text-base font-medium">
        Photos ({pictures?.length || 0})
      </Label>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="ml-auto"
        onClick={onEdit}
      >
        Edit
      </Button>
    </div>
    <div className="ml-7">
      {pictures && pictures.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {pictures.slice(0, 8).map((picture, index) => {
            // Handle string type (URL)
            if (typeof picture === "string") {
              return (
                <div
                  key={index}
                  className="aspect-video rounded border overflow-hidden bg-gray-100"
                >
                  <Image
                    src={picture}
                    alt={`Photo ${index + 1}`}
                    width={200}
                    height={112}
                    className="w-full h-full object-cover"
                  />
                </div>
              );
            }

            // Handle object type
            return (
              <div
                key={index}
                className="aspect-video rounded border overflow-hidden bg-gray-100"
              >
                {picture.file ? (
                  <Image
                    src={URL.createObjectURL(picture.file)}
                    alt={
                      picture.note ||
                      picture.description ||
                      `Photo ${index + 1}`
                    }
                    width={200}
                    height={112}
                    className="w-full h-full object-cover"
                  />
                ) : picture.imageUrl || picture.url ? (
                  <Image
                    src={picture.imageUrl || picture.url || ""}
                    alt={picture.note || `Photo ${index + 1}`}
                    width={200}
                    height={112}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      target.parentElement!.classList.add(
                        "flex",
                        "items-center",
                        "justify-center"
                      );
                      target.parentElement!.innerHTML = `
                      <div class="text-center text-gray-500">
                        <svg class="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                      </div>
                    `;
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <ImageIcon className="w-6 h-6 mx-auto" />
                      <p className="text-xs mt-1">No preview</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {pictures.length > 8 && (
            <div className="aspect-video rounded border bg-gray-100 flex items-center justify-center">
              <span className="text-sm text-gray-500">
                +{pictures.length - 8} more
              </span>
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-500">No photos added</p>
      )}
    </div>
  </div>
);
