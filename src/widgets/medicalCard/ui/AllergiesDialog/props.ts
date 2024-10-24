import type { MedicalCard } from "@/widgets/medicalCard";

export interface AllergiesDialogProps {
  readonly currentMedicalCard?: MedicalCard;
  readonly allergiesDialogVisible: boolean;
  readonly isEdit: boolean;
  readonly recordData: any;
  readonly refetchMyCard: () => void;
  readonly setAllergiesDialogVisible: (value: boolean) => void;
}
