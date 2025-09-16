export interface GuestSelectorProps {
  adults: number;
  childrenCount: number;
  pets: number;
  onAdultsChange: (count: number) => void;
  onChildrenChange: (count: number) => void;
  onPetsChange: (count: number) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  maxGuests: number;
}
