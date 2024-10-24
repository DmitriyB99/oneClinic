import type { AxiosResponse } from "axios";

import type { Consultation } from "@/entities/myProfile/models/myBookingsModel";

import { api } from "./apiClient";

export const patientBookingsApi = {
  getBookings(): Promise<AxiosResponse<Consultation[]>> {
    return api.get("bookings");
  },
  getBookingById(
    id: string,
    service_type: string
  ): Promise<AxiosResponse<Consultation>> {
    return api.get(`bookings/${id}`, { params: { service_type } });
  },
};
