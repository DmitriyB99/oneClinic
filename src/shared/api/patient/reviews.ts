import type { AxiosResponse } from "axios";

import { Pageable } from "../dtos";
import { api } from "./apiClient";

export type Review = {
  booking_consultation_slot_id: string | null;
  booking_medical_service_id: string | null;
  clinic_id: string;
  comment: string;
  rating: number;
};

export const patientReviewsApi = {
  getClinicReviews(params: Pageable): Promise<AxiosResponse<any>> {
    return api.get("review/clinic", { params });
  },
  getClinicReviewById(id: string): Promise<AxiosResponse<unknown>> {
    return api.get(`review/clinic/${id}`);
  },
  createClinicReview(data: Review): Promise<AxiosResponse<unknown>> {
    return api.post("review/clinic", data);
  },
  updateClinicReview(data): Promise<AxiosResponse<unknown>> {
    return api.put(`review/clinic/${data.id}`, data);
  },
  deleteClinicReview(id: string): Promise<AxiosResponse<unknown>> {
    return api.delete(`review/clinic/${id}`);
  },
  getDoctorReviews(params: Pageable): Promise<AxiosResponse<any>> {
    return api.get("review/doctor", { params });
  },
  getDoctorReviewById(id: string): Promise<AxiosResponse<unknown>> {
    return api.get(`review/doctor/${id}`);
  },
  createDoctorReview(
    data: Omit<Review, "booking_medical_service_id">
  ): Promise<AxiosResponse<unknown>> {
    return api.post("review/doctor", data);
  },
  updateDoctorReview(data): Promise<AxiosResponse<unknown>> {
    return api.put(`review/doctor/${data.id}`, data);
  },
  deleteDoctorReview(id: string): Promise<AxiosResponse<unknown>> {
    return api.delete(`review/doctor/${id}`);
  },
};
