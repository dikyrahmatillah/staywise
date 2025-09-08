import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { GetPropertiesQuery } from "@repo/schemas";

interface PropertiesSummaryProps {
  total: number;
  params: GetPropertiesQuery;
  isLoading: boolean;
  onChange: (updates: Partial<GetPropertiesQuery>) => void;
  formatLocation: (l: string) => string;
  toTitleCase: (s: string) => string;
}

export function PropertiesSummary({
  total,
  params,
  isLoading,
  onChange,
  formatLocation,
  toTitleCase,
}: PropertiesSummaryProps) {
  const summary = (() => {
    if (isLoading) return "Loading...";
    let text = "";
    if (params.name || params.categoryName || params.location) {
      const filters = [] as string[];
      if (params.name) filters.push(`for "${params.name}"`);
      if (params.categoryName)
        filters.push(`in category "${params.categoryName}"`);
      if (params.location)
        filters.push(`in ${formatLocation(params.location)}`);
      if (total === 0) text = `No Properties ${filters.join(" ")}`;
      else if (total === 1) text = `1 Property ${filters.join(" ")}`;
      else text = `${total} Properties ${filters.join(" ")}`;
    } else {
      text = `All Properties (${total})`;
    }
    return toTitleCase(text.trim());
  })();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
      <div className="mb-4 sm:mb-0">
        <h1 className="text-2xl font-bold text-foreground">{summary}</h1>
      </div>
      <div className="flex items-center gap-2">
        <Label htmlFor="pageSize" className="text-sm">
          Show:
        </Label>
        <Select
          value={String(params.limit || 12)}
          onValueChange={(value) => onChange({ limit: Number(value), page: 1 })}
        >
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="6">6</SelectItem>
            <SelectItem value="12">12</SelectItem>
            <SelectItem value="24">24</SelectItem>
            <SelectItem value="48">48</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">per page</span>
      </div>
    </div>
  );
}
