import type { Doctor } from "@/entities/appointments";

export interface Address {
  apartment: string | null;
  build_number: string | null;
  entrance: string | null;
  floor: string | null;
  street: string | null;
}

export interface Clinic {
  id: string;
  name: string;
}

type ConsultationType =
  | "ONLINE"
  | "OFFLINE"
  | "AWAY"
  | "ON_DUTY_CONSULTATION"
  | "CUSTOM";

export type ConsultationStatus =
  | "CREATED"
  | "ACTIVE"
  | "CANCELED"
  | "PAID"
  | "NOT_CONFIRMED"
  | "MOVED"
  | "MOVED_NOT_CONFIRMED"
  | "DONE";

export interface Consultation {
  address?: Address;
  clinic?: Clinic;
  consultation_type: ConsultationType;
  doctor?: Doctor;
  from_time?: string;
  id: string;
  status: ConsultationStatus;
  to_time?: string;
  price?: number;
  service_type: "doctor-service" | "clinic-service";
  doctor_service_type?: string;
  clinic_service_type?: string;
}
