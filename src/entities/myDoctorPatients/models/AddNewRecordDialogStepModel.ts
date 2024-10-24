import type { Dispatch, SetStateAction } from "react";

import type { CreateNewPrescription } from "@/shared/api/medicalPrescription";

export interface AddNewRecordDialogStepModel {
  back: () => void;
  next: () => void;
  medicalPrescription?: Partial<CreateNewPrescription>;
  setMedicalPrescription?: Dispatch<
    SetStateAction<Partial<CreateNewPrescription>>
  >;
}
