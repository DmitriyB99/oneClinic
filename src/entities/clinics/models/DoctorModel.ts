import type {
  CertificateModel,
  ClinicModel,
  DoctorServicePriceModel,
  EducationBlockModel,
  WorkPeriodModel,
} from "@/widgets/auth/models";

export interface DoctorClinicModel {
  cityId: string;
  clinicId: string;
  status: string;
  workPeriod: WorkPeriodModel[];
}

export interface DoctorProfile {
  birthDate?: string;
  certificates?: CertificateModel[];
  clinicId?: string;
  clinics?: ClinicModel[];
  clinicInfos?: ClinicModel[];
  contacts?: {
    fullName: string;
    phoneNumber: string;
  }[];
  clinicWorkPeriod?: DoctorClinicModel[];
  created?: string;
  iin?: string;
  description?: string;
  doctorId?: string;
  doctorProfileId?: string;
  fatherName?: string;
  firstName?: string;
  fullName?: string;
  id?: string;
  email?: string;
  isOnDuty?: boolean;
  isPro?: boolean;
  lastName?: string;
  modified?: string;
  phoneNumber?: string;
  photoUrl?: string;
  price?: number;
  rating?: number;
  reviewCount?: number;
  servicePrices?: DoctorServicePriceModel[];
  specialityCodes?: string[];
  specialityNames?: string[];
  status?: string;
  studyDegrees?: EducationBlockModel[];
  userId?: string;
  workExperience?: number;
}
