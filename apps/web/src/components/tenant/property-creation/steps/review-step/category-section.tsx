import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";

interface CategorySectionProps {
  propertyCategoryId?: string;
  propertyCategoryName?: string;
  customCategoryId?: string;
  customCategoryName?: string;
  onEdit: () => void;
}

export const CategorySection = ({
  propertyCategoryId,
  propertyCategoryName,
  customCategoryId,
  customCategoryName,
  onEdit,
}: CategorySectionProps) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2">
      <Building2 className="w-5 h-5 text-gray-500" />
      <Label className="text-base font-medium">Category</Label>
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
      {propertyCategoryId && (
        <p>
          Default category selected
          {propertyCategoryName ? `: ${propertyCategoryName}` : ""}
        </p>
      )}
      {customCategoryId && (
        <p>
          Custom category selected
          {customCategoryName ? `: ${customCategoryName}` : ""}
        </p>
      )}
      {!propertyCategoryId && !customCategoryId && (
        <p className="text-gray-500">Not selected</p>
      )}
    </div>
  </div>
);
