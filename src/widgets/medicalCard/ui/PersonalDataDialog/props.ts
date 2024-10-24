import type { MedicalCard } from "@/widgets/medicalCard";

export interface PersonalDataDialogProps {
  readonly currentMedicalCard?: MedicalCard["medical_card"];
  readonly personalDataDialogVisible: boolean;
  readonly refetchMyCard: () => void;
  readonly setPersonalDataDialogVisible: (value: boolean) => void;
}

export interface PersonalDataFormValues {
  readonly birth_date: string;
  readonly height: number;
  readonly gender: string;
  readonly name: string;
  readonly father_name: string;
  readonly surname: string;
  readonly iin: string;
  readonly weight: number;
}
