import type { Control } from "react-hook-form";
import type { UseFormSetValue } from "react-hook-form";

import type { DoctorDataFillModel } from "@/widgets/auth/models";

export interface AuthDoctorProfileSetupStepModel {
  back?: () => void;
  control?: Control<DoctorDataFillModel>;
  doctorId?: string;
  next?: () => void;
  setValue?: UseFormSetValue<DoctorDataFillModel>;
}
