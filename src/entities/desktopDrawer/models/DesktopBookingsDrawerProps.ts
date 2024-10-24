import type { SubmitHandler } from "react-hook-form";

import type { Dayjs } from "dayjs";

import type { AppointmentFormat } from "@/entities/appointments";
import type { RegistrationRequestModel } from "@/shared/pages/registrationRequest";
import type { ClinicModel, ServiceDataModel } from "@/widgets/auth";
export interface DesktopDrawerProps {
  onClose: () => void;
  open: boolean;
}
export interface DesktopBookingsNewDrawerProps extends DesktopDrawerProps {
  date?: Dayjs;
  onSubmit?: SubmitHandler<NewDesktopBookingModel>;
  time?: string;
}

export interface DesktopFiltersNewDrawerProps extends DesktopDrawerProps {
  onSubmit?: (filter: boolean) => void;
}

export interface DesktopBookingsDrawerProps extends DesktopDrawerProps {
  id: string;
}

export interface DesktopFillClinicDrawerProps extends DesktopDrawerProps {
  addData: (serviceData: ServiceDataModel) => void;
}

export interface DesktopAddDoctorWorkPlaceDrawerProps
  extends DesktopDrawerProps {
  addData: (workPlace: DoctorClinicModel, oldClinicId?: string) => void;
  WorkPlaceData?: ClinicModel;
}

export interface NewDesktopBookingModel {
  date: Date;
  doctor: string;
  format: AppointmentFormat;
  patientIIN: string;
  patientName: string;
  patientPhone: string;
  service: string;
  time: string;
}
export interface FindUserByShortModel {
  searchData: string;
}

export interface DoctorDataModel {
  doctorId?: string;
  clinicId?: string;
  price?: number;
}

export interface DoctorClinicModel {
  cityId?: Record<"label" | "value", string>;
  clinicId?: Record<"label" | "value", string>;
  workPeriod: {
    day: string;
    endTime: string;
    startTime: string;
  }[];
}

export interface RegistrationRequestDrawer extends DesktopDrawerProps {
  requestView?: RegistrationRequestModel;
}

export enum GetShortByValue {
  "FullName" = "fullname",
  "IIN" = "iin",
  "Number" = "phoneNumber",
}
