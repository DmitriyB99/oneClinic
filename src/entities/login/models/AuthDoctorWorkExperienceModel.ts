import type { Clinic } from "@/entities/clinics";
import type { AuthDoctorProfileSetupStepModel } from "@/entities/login";
import type { ClinicModel } from "@/widgets/auth";

export interface AuthDoctorWorkExperienceModel
  extends AuthDoctorProfileSetupStepModel {
  clinics?: ClinicModel[];
  clinicsData?: Clinic[];
  isUsedInAuth?: boolean;
  specialityCodes?: string[];
}
