// Badge component variants
export type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

// Status configuration for badges and UI components
export interface StatusConfig {
  variant: BadgeVariant;
  className: string;
  dot: string;
  label: string;
}
