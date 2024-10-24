import { Clinic } from "@/entities/myProfile";
import { Address } from "@/entities/myProfile/models/myBookingsModel";
import type { CreateNewPrescription } from "@/shared/api/medicalPrescription";

export interface Doctor {
  id: string;
  first_name: string;
  last_name: string;
  photo_url?: string | null;
  specialities?: string[];
}

// export interface ConsultationSlotModel {
//   clinicInfo?: {
//     buildNumber: string;
//     clinicId: string;
//     name: string;
//     street: string;
//     cityName: string;
//   };
//   bookingConsultationSlotId: string;
//   consultationStatus: string;
//   consultationType: string;
//   created: string;
//   currency?: string;
//   doctorFullname?: string;
//   doctorProfileId: string;
//   fromTime: string;
//   id: string;
//   isInDirection: boolean;
//   modified: string;
//   patientFullName: string;
//   price?: string;
//   reservedFullname: string;
//   reservedPhoneNumber: string;
//   reservedUserId: string;
//   toTime: string;
//   treatmentDirectionInfo?: {
//     categoryName: string;
//     created: string;
//     doctorFullname: string;
//   };
//   medicalPrescriptionInfo?: Omit<
//     CreateNewPrescription,
//     "userId" | "userProfileId" | "doctorProfileId" | "treatmentDirections"
//   >;
// }

interface TreatmentDirection {
  created: string;
  from_specialities: string[];
  to_speciality?: string;
  from_doctor?: string;
  from_clinic?: string;
}

export interface Consultation {
  id: string;
  service_type: "doctor-service" | "clinic-service";
  clinic_service_type?: string | null;
  doctor_service_type?: string | null;
  consultation_type?: string | null;
  status: string;
  price?: number;
  from_time?: string | null;
  to_time?: string | null;
  day?: string | null;
  address?: Address | null;
  clinic?: Clinic;
  doctor?: Doctor | null;
  name?: string | null;
  patient?: string | null;
  treatment_direction?: TreatmentDirection | null;
}

export interface CreateConsultationSlotModel {
  clinicId?: string;
  consultationData?: {
    isInDirection: boolean;
    price: number;
  };
  consultationStatus?: string;
  consultationType: string;
  doctorProfileId: string;
  fromTime: string;
  toTime: string;
  userProfileId: string;
}

export interface RescheduleConsultationSlotModel {
  id: string;
  consultationStatus: string;
  fromTime?: string;
  toTime?: string;
}
