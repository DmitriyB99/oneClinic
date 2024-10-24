import type { WorkPeriod } from "@/shared/api/clinics";

export interface ClinicDataFillModel {
  clinicId: string;
  name: string;
  description: string;
  email: string;
  iconUrl: string;
  address: ClinicAddresssModel;
  phoneNumbers: ClinicPhoneNumbersModel[];
  workPeriods: WorkPeriod[];
  clinicServices: ClinicServicesModel[];
  bin: string;
  latitude: number;
  longitude: number;
}

export interface ClinicPhoneNumbersModel {
  type: "DEFAULT" | "WHATSAPP";
  phoneNumber: string;
}

export interface ClinicAddresssModel {
  cityId: string | null;
  street: string;
  buildNumber: string;
}

export enum ServiceTypeEnum {
  ANALYSIS = "ANALYSIS",
  DIAGNOSTIC = "DIAGNOSTIC",
}

export interface ClinicServicesModel {
  type: ServiceTypeEnum;
  analysisTypeId: string;
  serviceDirectoryId: string;
  price: number;
}

export interface SelectOptionModel {
  key: string;
  value: string;
  label: string;
}

export interface ServiceDataModel {
  id: string;
  type: SelectOptionModel;
  analysis: SelectOptionModel;
  price: string;
  serviceType: ServiceTypeEnum;
}
