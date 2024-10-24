import type { MedicalCard } from "@/widgets/medicalCard";

export interface VaccinesDialogProps {
  readonly currentMedicalCard?: MedicalCard;
  readonly vaccinesDialogVisible: boolean;
  readonly isEdit: boolean;
  readonly recordData: any;
  readonly refetchMyCard: () => void;
  readonly setVaccinesDialogVisible: (value: boolean) => void;
}
