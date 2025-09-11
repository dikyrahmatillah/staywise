import { usePropertyCreation } from "../property-creation-context";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
          <p className="text-sm text-gray-500">Maximum 100 characters</p>
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxGuests">Maximum Guests *</Label>
          <Input
            id="maxGuests"
            type="number"
            min={1}
            value={formData.maxGuests || ""}
            onChange={(e) =>
              handleChange("maxGuests", parseInt(e.target.value) || 1)
            }
            placeholder="1"
          />
        </div>
      </CardContent>
    </Card>
  );
}
