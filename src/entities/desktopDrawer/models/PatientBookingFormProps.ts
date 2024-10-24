import type { Dispatch, SetStateAction } from "react";
import type { Control } from "react-hook-form";

import type { DefaultOptionType } from "antd/es/select";

import type { MyShortInfoModel } from "@/entities/myProfile";

import type {
  DoctorDataModel,
  NewDesktopBookingModel,
} from "./DesktopBookingsDrawerProps";

export enum SearchByInfo {
  Fullname = "FullName",
  IIN = "IIN",
  PhoneNumber = "Number",
}
export interface PatientBookingFormProps {
  clinicServiceDataList: DefaultOptionType[];
  control: Control<NewDesktopBookingModel>;
  doctorServiceDataList: DefaultOptionType[];
  isClinic: boolean;
  searchInfo?: MyShortInfoModel;
  setDoctorData: Dispatch<SetStateAction<DoctorDataModel | undefined>>;
  fillingSteps: (string | undefined)[];
  doctorData?: DoctorDataModel;
}
