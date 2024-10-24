import type { ChipType } from "@/shared/components";

export interface ChipModel {
  isActive?: boolean;
  isDisabled?: boolean;
  label: string;
}

export interface ChipsProps {
  chipLabels: string[] | ChipModel[];
  className?: string;
  isCarousel?: boolean;
  onChange?: (activeChips: string[] | undefined | string) => void;
  type: ChipType;
  defaultValue?: string;
}

export interface ChipLabelType {
  id: number | string;
  isActive: boolean;
  isDisabled?: boolean;
  label: string;
}
