export interface Clinic {
  id: string;
  name: string;
}

export interface Doctor {
  id: string;
  first_name: string;
  last_name: string;
}

export interface Patient {
  id: string;
  surname: string;
  name: string;
}

export interface MyProfileReviewModel {
  booking_consultation_slot_id: string | null;
  booking_medical_service_id: string | null;
  clinic: Clinic;
  doctor: Doctor;
  comment: string;
  id: string;
  patient: Patient[];
  rating: number;
  created: string;
}
