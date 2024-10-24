export interface EducationBlockModel {
  degree?: string;
  diplomaUrl?: string;
  id?: number;
  name?: string;
  yearEnd?: string | number;
  yearStart?: string | number;
}
export interface CertificateModel {
  certificateUrl?: string;
  id?: number;
  name?: string;
  yearEarned?: string | number;
}

export interface WorkPeriodModel {
  day: string;
  endTime: string;
  startTime: string;
}

export interface ClinicModel {
  city?: string;
  cityId?: string;
  clinicId?: string;
  street?: string;
  name?: string;
  cityName?: string;
  buildNumber?: string;
  workPeriod: WorkPeriodModel[];
}

export interface DoctorServicePriceModel {
  consultation_type: string;
  first_price: number;
  second_price?: number;
  duration_minutes?: number;
  id: string
}

export interface DoctorDataFillModel {
  iin?: string;
  certificates: CertificateModel[];
  clinics: ClinicModel[];
  contacts: {
    fullName: string;
    phoneNumber: string;
  }[];
  doctorId: string;
  photoUrl?: string;
  servicePrices: DoctorServicePriceModel[];
  specialityCodes: string[];
  studyDegrees: EducationBlockModel[];
  workExperience?: number;
  fatherName?: string;
  firstName?: string;
  lastName?: string;
}

export interface ClinicDoctorDataFillModel
  extends Omit<
    DoctorDataFillModel,
    "photoUrl" | "contacts" | "studyDegrees" | "certificates" | "doctorId"
  > {
  email: string;
  phoneNumber: string;
}

export interface EducationListModel {
  id: number;
  name: string;
  degree: string;
  years: Date[];
  diplomaUrl: string;
}

export enum DoctorConsultationTypeEnum {
  AWAY = "AWAY",
  OFFLINE = "OFFLINE",
  ONLINE = "ONLINE",
  CUSTOM = "CUSTOM",
}
