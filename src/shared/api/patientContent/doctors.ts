import type { AxiosResponse } from "axios";

import { api } from "./apiClient";
import type { Speciality } from "./searchBy";

export enum ExperienceYears {
  OneToThree = "1-3 years",
  SixPlus = "6+ years",
  ThreeToSix = "3-6 years",
}

export interface Clinics {
  id: string;
  name: string;
}

export interface Cost {
  min?: number;
  max?: number;
}

export interface DoctorFilterResult {
  clinics?: Clinics[];
  cost?: Cost;
  specialties: Speciality[];
}

export interface Coordinates {
  longitude: number;
  latitude: number;
}

export interface DoctorsFilter {
  appointment_date: string[];
  clinic_ids: string[];
  cost: {
    max: number;
    min: number;
  };
  experiences: ExperienceYears[];
  is_nearby: boolean;
  is_online: boolean;
  is_working: boolean;
  location: number[];
  services: string[];
  speciality_ids: string[];
  weekends: boolean;
}

export const patientDoctorsApi = {
  getDoctors(data): Promise<AxiosResponse<any>> {
    return api.post("doctors", data);
  },
  getPopularDoctors(): Promise<AxiosResponse<any>> {
    return api.get("doctors/popular");
  },
  getDoctorsByClinicId(clinicId: string): Promise<AxiosResponse<any>> {
    return api.get(`doctors/clinic/${clinicId}`);
  },
  getDoctorsBySpecialityId(
    specialityId: string,
    onlyOnline: boolean
  ): Promise<AxiosResponse<unknown>> {
    return api.get(`doctors/speciality/${specialityId}`, {
      params: { onlyOnline },
    });
  },
  getDoctoById(
    doctorId: string,
    coordinates: Coordinates
  ): Promise<AxiosResponse<any>> {
    return api.get(`doctors/${doctorId}`, { params: coordinates });
  },
  getDoctorsReview(doctorId: string): Promise<AxiosResponse<any>> {
    return api.get(`doctors/${doctorId}/reviews`);
  },
  getDoctorsServices(doctorId: string): Promise<AxiosResponse<any>> {
    return api.get(`doctors/${doctorId}/services`);
  },
  getDoctorsFilter(
    body: DoctorsFilter
  ): Promise<AxiosResponse<DoctorFilterResult>> {
    return api.post("doctors/filters", body);
  },
};
