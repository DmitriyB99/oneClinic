import type { AxiosResponse } from "axios";

import { api } from "./apiClient";
import type { Speciality } from "./searchBy";

export interface ClinicLite {
  id: string;
  name: string;
  rating: number;
  icon_url: string;
}

export interface ClinicsFilter {
  clinic_ids: string[];
  is_nearby: boolean;
  is_24hour_working: boolean;
  is_working: boolean;
  speciality_ids: string[];
}

export interface Clinics {
  id: string;
  name: string;
  icon_url?: string | null;
  address?: string;
}

export interface ClinicFilterResult {
  clinics?: Clinics[];
  specialities: Speciality[];
}

export const patientClinicsApi = {
  getClinics(data): Promise<AxiosResponse<any>> {
    return api.post("clinics", data);
  },
  getPopularCityClinics(): Promise<AxiosResponse<ClinicLite[]>> {
    return api.get("clinics/lite");
  },
  getClinicById(clinicId: string): Promise<AxiosResponse<any>> {
    return api.get(`clinics/${clinicId}`);
  },
  getClinicsReview(clinicId: string): Promise<AxiosResponse<any>> {
    return api.get(`clinics/${clinicId}/reviews`);
  },
  getClinicsServices(clinicId: string): Promise<AxiosResponse<unknown>> {
    return api.get(`clinics/${clinicId}/services`);
  },
  getClinicsFilter(
    body: ClinicsFilter
  ): Promise<AxiosResponse<ClinicFilterResult>> {
    return api.post("clinics/filters", body);
  },
};
