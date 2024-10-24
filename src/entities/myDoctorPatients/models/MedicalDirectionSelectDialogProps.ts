import type { Dispatch, SetStateAction } from "react";

export enum DIRECTION_TYPES {
  DOCTOR = "DOCTOR",
  FUNCTIONAL_DIAGNOSIS = "FUNCTIONAL_DIAGNOSIS",
  MEDICAL_TEST = "MEDICAL_TEST",
}

export interface DirectionType {
  type: DIRECTION_TYPES;
  text: string;
  categoryId: string;
}

export interface DirectionItem {
  categoryId: string;
  category: DIRECTION_TYPES;
  name: string;
}

export interface MedicalDirectionSelectDialogProps {
  selectNumber: number;
  title: string;
  placeholder: string;
  values: DirectionItem[];
  onSelect: (item: DirectionItem, selectNumber: number) => void;
  onCancel: () => void;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}
