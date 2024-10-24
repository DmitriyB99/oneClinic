import type { MedicalCard } from "@/widgets/medicalCard";

type DropdownOption = {
  id: string;
  title: string;
};

export interface MyCardDetailsDialogProps {
  readonly bottomInputLabel?: string;
  readonly cardDetailsDialogVisible: boolean;
  readonly currentMedicalCard?: MedicalCard;
  readonly fieldName: string;
  readonly isTopInputDate?: boolean;
  readonly isTopInputDropdown?: boolean;
  readonly refetchMyCard: () => void;
  readonly setCardDetailsDialogVisible: (value: boolean) => void;
  readonly topInputLabel: string;
  readonly topText: string;
  readonly dropdownOptions?: DropdownOption[];
  readonly recordData?: any;
  readonly isEditing?: boolean;
}
