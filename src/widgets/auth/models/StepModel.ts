import type {
  Control,
  FieldErrors,
  FieldValues,
  UseFormReset,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

import type { ClinicDataFillModel } from "./ClinicDataFillModel";
import type { DoctorDataFillModel } from "./DoctorDataFillModel";
export interface StepModel {
  back?: () => void;
  next?: () => void;
}

export interface RegistrationStepModel<T extends FieldValues>
  extends StepModel {
  control?: Control<T>;
  setValue?: UseFormSetValue<T>;
  watch?: UseFormWatch<T>;
  error?: FieldErrors<T>;
  reset?: UseFormReset<T>;
}

export type Step3FillClinicProfileSetValue = UseFormReset<
  DoctorDataFillModel | ClinicDataFillModel
>;

export interface Step6Model extends StepModel {
  isNewPassword: boolean;
  userId: string;
}
