import type { MedicalCard } from "@/widgets/medicalCard";

export interface InfectionsDialogProps {
  readonly currentMedicalCard?: MedicalCard;
  readonly infectionsDialogVisible: boolean;
  readonly refetchMyCard: () => void;
  readonly setInfectionsDialogVisible: (value: boolean) => void;
  readonly isEdit: boolean;
  readonly recordData: any;
}
