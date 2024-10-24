export type ChipType = "multiselect" | "suggest" | "single";

export interface ChipProps {
  checked?: boolean;
  className?: string;
  disabled?: boolean;
  label: string;
  onChange?: (checked: boolean, id: number) => void;
  type?: ChipType;
}
