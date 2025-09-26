import { usePropertyCreation } from "../property-creation-context";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, FileText } from "lucide-react";
import { useMemo } from "react";

export function BasicInfoStep() {
  const { formData, updateFormData } = usePropertyCreation();

  const handleChange = (field: string, value: string | number) => {
    updateFormData({ [field]: value });
  };

  const nameProgress = useMemo(() => {
    const length = formData.name?.length || 0;
    return Math.min((length / 100) * 100, 100);
  }, [formData.name]);

  const descriptionProgress = useMemo(() => {
    const length = formData.description?.length || 0;
    return Math.min((length / 500) * 100, 100);
  }, [formData.description]);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <Label
              htmlFor="name"
              className="text-base font-semibold text-foreground"
            >
              Property Name
            </Label>
          </div>
        </div>

        <div className="space-y-3">
          <Input
            id="name"
            value={formData.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="e.g., Luxury Beachfront Villa with Ocean Views"
            className="h-12 text-base border-2 border-slate-200 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all duration-200"
            maxLength={100}
          />

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">
                {formData.name?.length || 0} of 100 characters
              </span>
              <span
                className={`text-xs font-medium ${
                  nameProgress > 90
                    ? "text-amber-600"
                    : nameProgress > 80
                    ? "text-orange-600"
                    : "text-green-600"
                }`}
              >
                {nameProgress.toFixed(0)}%
              </span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  nameProgress > 90
                    ? "bg-gradient-to-r from-amber-400 to-orange-500"
                    : nameProgress > 80
                    ? "bg-gradient-to-r from-orange-400 to-red-500"
                    : "bg-gradient-to-r from-green-400 to-emerald-500"
                }`}
                style={{ width: `${nameProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <Label
              htmlFor="description"
              className="text-base font-semibold text-foreground"
            >
              Property Description
            </Label>
          </div>
        </div>

        <div className="space-y-3">
          <textarea
            id="description"
            value={formData.description || ""}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              handleChange("description", e.target.value)
            }
            placeholder="Tell guests about your property's unique features, location highlights, amenities, and what makes it special..."
            rows={5}
            maxLength={500}
            className="flex min-h-[120px] w-full rounded-lg border-2 border-slate-200 bg-background px-4 py-3 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/10 transition-all duration-200 resize-none"
          />

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">
                {formData.description?.length || 0} of 500 characters
              </span>
              <span
                className={`text-xs font-medium ${
                  descriptionProgress > 90
                    ? "text-amber-600"
                    : descriptionProgress > 80
                    ? "text-orange-600"
                    : "text-green-600"
                }`}
              >
                {descriptionProgress.toFixed(0)}%
              </span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  descriptionProgress > 90
                    ? "bg-gradient-to-r from-amber-400 to-orange-500"
                    : descriptionProgress > 80
                    ? "bg-gradient-to-r from-orange-400 to-red-500"
                    : "bg-gradient-to-r from-green-400 to-emerald-500"
                }`}
                style={{ width: `${descriptionProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
