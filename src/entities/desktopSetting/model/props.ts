import type { Dispatch, MouseEvent, SetStateAction } from "react";
import type { Control, UseFormReset, UseFormSetValue } from "react-hook-form";

import type { EditDoctorProfileForm } from "@/pages/myDoctor/editProfile";
import type { UpdateClinicProfileModel } from "@/shared/api/clinics";

export interface WorkplaceCardProps {
  address?: string;
  title?: string;
  worktime?: string;
  trashClick?: () => void;
  onClick?: (event?: MouseEvent<HTMLDivElement>) => void;
}

export interface WorkTimeCheckModel {
  active?: boolean;
  startWorkTime?: string;
  finishWorkTime?: string;
  day?: string;
}

export interface WorkTimeCheckProps extends WorkTimeCheckModel {
  setWorkDays?: Dispatch<SetStateAction<WorkTimeCheckModel[]>>;
}

export interface DesktopSettingPageProps {
  control: Control<UpdateClinicProfileModel | EditDoctorProfileForm>;
  reset: UseFormReset<UpdateClinicProfileModel | EditDoctorProfileForm>;
  setValue?: UseFormSetValue<UpdateClinicProfileModel | EditDoctorProfileForm>;
}
