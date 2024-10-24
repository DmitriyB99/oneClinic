export interface TakeMedicineInputDropdownModel {
  activeItem?: string;
  isShortened?: boolean;
  items: {id: string; title: string}[];
  setActiveItem?: (value: string) => void;
}
