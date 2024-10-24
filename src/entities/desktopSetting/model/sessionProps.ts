import type { Control, UseFormSetValue } from "react-hook-form";

import type { EditDoctorProfileForm } from "@/pages/myDoctor/editProfile";
import type {
  ClinicByIdResponse,
  UpdateClinicProfileModel,
} from "@/shared/api/clinics";

export interface SessionProps {
  control?: Control<UpdateClinicProfileModel | EditDoctorProfileForm>;
  data?: ClinicByIdResponse;
  setValue?: UseFormSetValue<UpdateClinicProfileModel | EditDoctorProfileForm>;
}
