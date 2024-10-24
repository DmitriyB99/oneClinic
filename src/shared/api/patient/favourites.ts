import type { AxiosResponse } from "axios";

import { api } from "./apiClient";
import type { Pageable } from "../dtos";

export const patientFavouritesApi = {
  getFavouriteDoctors(params: Pageable): Promise<AxiosResponse<any>> {
    return api.get("favourites/doctors", { params });
  },
  addFavouriteDoctor(doctor_id: string): Promise<AxiosResponse<unknown>> {
    return api.post("favourites/doctors", { doctor_id });
  },
  deleteFavouriteDoctor(doctor_id: string): Promise<AxiosResponse<unknown>> {
    return api.delete(`favourites/doctors/${doctor_id}`);
  },
  getFavouriteClinics(params: Pageable): Promise<AxiosResponse<unknown>> {
    return api.get("favourites/clinics", { params });
  },
  addFavouriteClinic(clinic_id: string): Promise<AxiosResponse<unknown>> {
    return api.post("favourites/clinics", { clinic_id });
  },
  deleteFavouriteClinic(clinic_id: string): Promise<AxiosResponse<unknown>> {
    return api.delete(`favourites/clinics/${clinic_id}`);
  },
};
