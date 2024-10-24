import type { AxiosResponse } from "axios";

import type {
  ConsultationSlotModel,
  CreateConsultationSlotModel,
  RescheduleConsultationSlotModel,
} from "@/entities/appointments";
import { api } from "@/shared/api/instance";
import type { PageableResponse } from "@/shared/types";
import { getTimezoneOffsetString } from "@/shared/utils";

import type { ClinicInfoModel } from "./clinics";
import type {
  GetBookingInfoByDateResponseDTO,
  RescheduleConsultationResponseDTO,
} from "./dtos";

interface AllConsultationsPayload {
  fromTime?: string;
  toTime?: string;
  isInDirection?: boolean;
  doctorProfileId?: string;
  clinicId?: string;
}

interface AllConsultationsResponse {
  bookingConsultationSlotId: string;
  clinicInfo: ClinicInfoModel;
  consultationStatus: string;
  consultationType: string;
  doctorFullname: string;
  doctorProfileId: string;
  fromTime: string;
  isInDirection: boolean;
  price: number;
  reservedFullname: string;
  reservedUserId: string;
  toTime: string;
}

export const appointmentBookingApi = {
  createConsultationSlot(
    data: CreateConsultationSlotModel
  ): Promise<AxiosResponse<unknown>> {
    return api.post("main/booking-consultation/slots", data);
  },
  getConsultationSlotById(
    consultationId: string
  ): Promise<AxiosResponse<ConsultationSlotModel>> {
    return api.get(`main/booking-consultation/slots/${consultationId}`);
  },
  getAllConsultationSlots(
    doctorProfileId: string,
    bookingDate: string,
    clinicId: string
  ): Promise<AxiosResponse<Array<Partial<ConsultationSlotModel>>>> {
    return api.get("main/booking-consultation/slots", {
      params: {
        doctorProfileId,
        bookingDate,
        clinicId,
      },
    });
  },
  rescheduleConsultationSlot(
    data: RescheduleConsultationSlotModel
  ): Promise<AxiosResponse<Partial<RescheduleConsultationResponseDTO>>> {
    return api.put("main/booking-consultation/slots", data);
  },
  getMyConsultationSlots(
    page: number,
    size: number,
    fromDate?: string,
    toDate?: string
  ): Promise<AxiosResponse<PageableResponse<GetBookingInfoByDateResponseDTO>>> {
    const fromDateReq = new Date(new Date().getTime() + 5 * 60 * 60 * 1000);
    const timezoneOffset = getTimezoneOffsetString(fromDateReq);

    return api.post(
      "main/booking-consultation/slots/me",
      {
        fromDate: fromDate
          ? `${fromDate}${timezoneOffset}`
          : `${fromDateReq.toISOString().replaceAll("Z", "")}${timezoneOffset}`,
        toDate: toDate
          ? `${toDate}${timezoneOffset}`
          : `2025-01-01T00:00:00.000${timezoneOffset}`,
      },
      {
        params: {
          page,
          size,
        },
      }
    );
  },
  getAllConsultations: (
    data: AllConsultationsPayload
  ): Promise<AxiosResponse<PageableResponse<AllConsultationsResponse>>> =>
    api.post("main/booking-consultation/slots/info", data),
};
