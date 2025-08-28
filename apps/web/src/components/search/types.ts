export interface SearchState {
  location: string;
  checkIn?: Date;
  checkOut?: Date;
  adults: number;
  childrenCount: number;
  pets: number;
}

export interface SearchActions {
  setLocation: (location: string) => void;
  setCheckIn: (date: Date | undefined) => void;
  setCheckOut: (date: Date | undefined) => void;
  setAdults: (count: number) => void;
  setChildrenCount: (count: number) => void;
  setPets: (count: number) => void;
  onSearch: () => void;
}

export interface ExpandedSearchProps {
  location: string;
  checkIn: Date | undefined;
  checkOut: Date | undefined;
  adults: number;
  childrenCount: number;
  pets: number;
  setLocation: (value: string) => void;
  setCheckIn: (value: Date | undefined) => void;
  setCheckOut: (value: Date | undefined) => void;
  setAdults: (value: number) => void;
  setChildren: (value: number) => void;
  setPets: (value: number) => void;
  onSearch: () => void;
  locationOpen: boolean;
  datesOpen: boolean;
  guestsOpen: boolean;
  onLocationOpenChange: (open: boolean) => void;
  onDatesOpenChange: (open: boolean) => void;
  onGuestsOpenChange: (open: boolean) => void;
  onClose: () => void;
}

export interface SearchButtonProps {
  isSearchOpen: boolean;
  onToggle: () => void;
}
