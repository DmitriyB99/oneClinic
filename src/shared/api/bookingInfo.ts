import type { AxiosResponse } from "axios";

import { api } from "@/shared/api/instance";

import type { ClinicBookingSlots, PageableResponse } from "../types";

interface DoctorAvailableSlot {
  clinicId: string;
  clinicName?: string | null;
  consultationStatus?: string | null;
  consultationType?: string | null;
  doctorProfileId: string;
  fromTime: string;
  id?: string | null;
  name?: string | null;
  patientFullName?: string | null;
  price?: number | null;
  reservedUserId?: string | null;
  samplingMethod?: string | null;
  serviceDirectoryId?: string | null;
  toTime: string;
}

interface CalendarSlotsStatus {
  freeStatus: boolean;
  slotCount: number;
}

export const bookingInfoApi = {
  getClinicSlots(
    fromDate: string,
    toDate: string
  ): Promise<AxiosResponse<PageableResponse<ClinicBookingSlots>>> {
    return api.post("/main/booking-info/clinic/slots", {
      fromDate,
      toDate,
    });
  },
  getDoctorSlots(
    fromDate: string,
    toDate: string
  ): Promise<AxiosResponse<PageableResponse<ClinicBookingSlots>>> {
    return api.post("/main/booking-info/doctor/slots", {
      fromDate,
      toDate,
    });
  },
  getCalendarSlots(
    month: number,
    year: number
  ): Promise<AxiosResponse<Record<number, number>>> {
    return api.get("/main/booking-info/doctor/slots/calendar", {
      params: {
        month,
        year,
      },
    });
  },

  getDoctorAvailableSlots(
    doctorProfileId: string,
    bookingDate: string,
    clinicId?: string
  ): Promise<AxiosResponse<DoctorAvailableSlot[]>> {
    return api.get("/main/booking-info/doctor/available-slots", {
      params: {
        doctorProfileId,
        clinicId,
        bookingDate,
      },
    });
  },
  getDoctorAvailableCalendarSlots(
    doctorProfileId: string,
    month: number,
    year: number,
    clinicId?: string
  ): Promise<AxiosResponse<Record<number, CalendarSlotsStatus>>> {
    return api.get("/main/booking-info/doctor/available-slots/calendar", {
      params: {
        doctorProfileId,
        month,
        year,
        clinicId,
      },
    });
  },
};
