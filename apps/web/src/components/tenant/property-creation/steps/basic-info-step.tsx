import { usePropertyCreation } from "../property-creation-context";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2 } from "lucide-react";

export function BasicInfoStep() {
  const { formData, updateFormData } = usePropertyCreation();

  const handleChange = (field: string, value: string | number) => {
    updateFormData({ [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Property Name *</Label>
          <Input
            id="name"
            value={formData.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Enter property name"
          />
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Maximum 100 characters
            </p>
            <span className="text-xs text-muted-foreground">
              {formData.name?.length || 0}/100
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <textarea
            id="description"
            value={formData.description || ""}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              handleChange("description", e.target.value)
            }
            placeholder="Describe your property..."
            rows={4}
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Tip: Mention highlights like neighborhood, style, and unique
              amenities.
            </p>
            <span className="text-xs text-muted-foreground">
              {formData.description?.length || 0}/500
            </span>
          </div>
        </div>

        {/* Live preview */}
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold tracking-tight">
                {formData.name?.trim() || "Your property name"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {formData.description?.trim() ||
                  "A short description preview will appear here as you type."}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
