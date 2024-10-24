import type { AddNewRecordDialogStepModel } from "@/entities/myDoctorPatients";

import type { DirectionItem } from "./MedicalDirectionSelectDialogProps";

export interface MedicalDirectionStepProps extends AddNewRecordDialogStepModel {
  specialityTypes: DirectionItem[];
  analysisTypes: DirectionItem[];
  procedureTypes: DirectionItem[];
}

export interface MedicalDirectionSelectDialogStateProps {
  selectNumber: number;
  title: string;
  values: DirectionItem[];
}
