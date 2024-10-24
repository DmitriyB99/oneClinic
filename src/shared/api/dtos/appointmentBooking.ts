import type { Clinic, Doctor } from "@/entities/myProfile";
import type { Address } from "@/entities/myProfile/models/myBookingsModel";

export interface DoctorInfo extends Doctor {
  photo_url?: string;
  specialities?: string[];
}

export interface ClinicInfo extends Clinic {
  icon_url?: string;
}

export interface GetBookingInfoByDateResponseDTO {
  doctor_service_type?: string;
  clinic_service_type?: string;
  id: string;
  day?: string;
  from_time?: string;
  to_time?: string;
  doctor?: DoctorInfo;
  clinic?: ClinicInfo;
  address?: Address;
  status?: string;
  service_type?: string;
}

export interface RescheduleConsultationResponseDTO {
  consultationStatus: string;
  consultationType: string;
  doctorProfileId: string;
  fromTime: string;
  toTime: string;
}
