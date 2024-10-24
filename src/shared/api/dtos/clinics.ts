import type { DoctorServicePriceModel } from "@/widgets/auth";

export enum ClinicDoctorStatus {
  ACTIVE = "ACTIVE",
  BANNED = "BANNED",
  DELETED = "DELETED",
  DISABLED = "DISABLED",
  NEW = "NEW",
  NEW_DISABLED = "NEW_DISABLED",
  NOT_ACTIVE = "NOT_ACTIVE",
  STOPPED = "STOPPED",
}

export interface Specialities {
  id: string;
  name: string;
}

export interface ClinicDoctorDetails {
  id: string;
  email?: string;
  first_name: string;
  last_name: string;
  father_name: string;
  inWorkEndTime: string | null;
  phoneNumber: string;
  photo_url: string;
  rating: number;
  review_count: number;
  servicePrices: DoctorServicePriceModel[];
  specialities: Specialities[];
  status: ClinicDoctorStatus;
  userId?: string;
  clinics: Array<{ clinicId: string }>;
}
