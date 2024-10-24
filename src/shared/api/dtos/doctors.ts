import type { DoctorServicePriceModel } from "@/widgets/auth/models";

interface ClinicData {
  buildNumber: string | null;
  cityId: string;
  cityName: string | null;
  clinicServices: string | null;
  description: string | null;
  iconUrl: string | null;
  locationPoint: string | null;
  name: string;
  phoneNumbers: string | null;
  rating: number;
  reviewCount: number;
  street: string | null;
  workPeriods: string | null;
}

export interface ConsultationSlotData {
  bookingConsultationSlotId: string;
  clinicInfo: ClinicData | null;
  consultationStatus: string | null;
  consultationType: string;
  doctorFullname: string;
  doctorProfileId: string;
  fromTime: string | null;
  isInDirection: boolean;
  price: number;
  reservedFullname: string | null;
  reservedPhoneNumber: null;
  reservedUserId: string | null;
  toTime: string | null;
  userProfileId: string | null;
}

export interface ConsultationSlotsByDatePayloadDTO {
  clinicId: string | null;
  consultationStatus: string | null;
  consultationType: string | null;
  doctorProfileId: string;
  fromTime: string;
  isInDirection: boolean;
  toTime: string;
}

export interface ConsultationSlotsByDateResponseDTO {
  content: ConsultationSlotData[];
}

export interface GetDutyDoctorsListRequestDTO {
  byPopular?: boolean;
  minPrice?: number;
  maxPrice?: number;
  specialityCodes?: string;
}

export interface GetDutyDoctorsListResponseDTO {
  userId: string;
  email: string;
  doctorId: string;
  fullName: string;
  rating: number;
  reviewCount: number;
  workExperience: number;
  phoneNumber: string;
  photoUrl: string;
  clinicInfos: [
    {
      clinicId: string;
      name: string;
      description: string;
      iconUrl: string;
      rating: number;
      reviewCount: number;
      locationPoint: {
        x: number;
        y: number;
      };
      cityId: string;
      cityName: string;
      street: string;
      buildNumber: string;
      phoneNumbers: [
        {
          type: string;
          phoneNumber: string;
        }
      ];
      clinicServices: [
        {
          type: string;
          analysisTypeId: string;
          analysisTypeName: string;
          serviceDirectoryId: string;
          serviceDirectoryName: string;
          price: number;
        }
      ];
      workPeriods: [
        {
          days: string;
          startTimes: string;
          endTimes: string;
        }
      ];
    }
  ];
  specialityCodes: string[];
  servicePrices: DoctorServicePriceModel[];
  inWorkEndTimes: string;
  statuss: string;
}

export interface ActivateSessionWithDutyDoctorResponseDTO {
  id: string;
  doctorProfileId: string;
  status: string;
  consultationStartTime: string;
  consultationEndTime: string;
}

export interface GetDoctorStatisticsResponseDTO {
  myPatient: number;
  otherPatient: number;
  subscriptDoctor: number;
  notSubscriptDoctor: number;
  rating: number;
  reviewCount: number;
}

export interface DoctorPhotoUpdatePayload {
  file?: File | null;
  profileId: string;
}

export interface PopularDoctorsPayload {
  specialityCodes?: string;
  cityId?: string;
  fullName?: string;
  phoneNumber?: string;
  status?: string;
  curDate?: string;
}
