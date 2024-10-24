import type { MedicalCard } from "@/widgets/medicalCard";

export interface TakeMedicinesDialogProps {
  readonly currentMedicalCard?: MedicalCard;
  readonly takeMedicinesDialogVisible: boolean;
  readonly refetchMyCard: () => void;
  readonly setTakeMedicinesDialogVisible: (value: boolean) => void;
  readonly fieldName: string;
}
