import type { MedicalCard } from "@/widgets/medicalCard";

export interface DrugIntoleranceDialogProps {
  readonly currentMedicalCard?: MedicalCard;
  readonly drugIntoleranceDialogVisible: boolean;
  readonly isEdit: boolean;
  readonly recordData: any;
  readonly refetchMyCard: () => void;
  readonly setDrugIntoleranceDialogVisible: (value: boolean) => void;
}
