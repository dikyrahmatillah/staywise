import {
  FileText,
  MapPin,
  Tags,
  BedDouble,
  Sparkles,
  Images,
  ClipboardCheck,
  type LucideIcon,
} from "lucide-react";

export type WizardStep = {
  id: number;
  number: number;
  title: string;
  description: string;
  icon: LucideIcon;
};

export const WIZARD_STEPS: WizardStep[] = [
  {
    id: 1,
    number: 1,
    title: "Basic Info",
    description: "Property name and description",
    icon: FileText,
  },
  {
    id: 2,
    number: 2,
    title: "Location",
    description: "Where is your property located?",
    icon: MapPin,
  },
  {
    id: 3,
    number: 3,
    title: "Category",
    description: "What type of property is this?",
    icon: Tags,
  },
  {
    id: 4,
    number: 4,
    title: "Facilities",
    description: "Available amenities",
    icon: Sparkles,
  },
  {
    id: 5,
    number: 5,
    title: "Pictures",
    description: "Upload property images",
    icon: Images,
  },
  {
    id: 6,
    number: 6,
    title: "Rooms",
    description: "Add rooms and pricing",
    icon: BedDouble,
  },
  {
    id: 7,
    number: 7,
    title: "Review",
    description: "Review and submit",
    icon: ClipboardCheck,
  },
];

export const TOTAL_STEPS = WIZARD_STEPS.length;
