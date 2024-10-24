import type { AxiosResponse } from "axios";

import { api } from "./apiClient";
// import type { Pageable } from "../dtos";

export const doctorBookingsApi = {
  searchPatients(params: {
    start_date: string;
    end_date: string;
  }): Promise<AxiosResponse<unknown>> {
    return api.get("patients/search", { params });
  },
  getBookings(params: {
    start_date: string;
    end_date: string;
    status: string;
  }): Promise<AxiosResponse<any>> {
    return api.get("booking-slots", { params });
  },
  getUpcomingBookings(): Promise<AxiosResponse<any>> {
    return api.get("booking-slots/upcoming");
  },
  getBookingById(id: string): Promise<AxiosResponse<any>> {
    return api.get(`booking-slots/${id}`)
  },
  getStatusStatistic(params: {
    start_date: string;
    end_date: string;
  }): Promise<AxiosResponse<any>> {
    return api.get("booking-slots/stats/status", { params });
  },
};
