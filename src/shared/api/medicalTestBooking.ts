import type { AxiosResponse } from "axios";
import dayjs from "dayjs";

import type {
  BookingSlotModel,
  CreateBookingSlotModel,
  GetMedicalTestServicesResponse,
  MedicalTestModel,
  MedicalTestSlotModel,
} from "@/entities/medicalTest";
import { api } from "@/shared/api/instance";
import { dateTimeWithOffset } from "@/shared/config";
import type { PageableResponse } from "@/shared/types";
import type { ServiceTypeEnum } from "@/widgets/auth";

interface MedicalTestBookingSlotModel {
  analysisTypeId: string;
  analysisTypeName?: string;
  name?: string;
  price: number;
  serviceDirectoryName: string;
  type: ServiceTypeEnum;
  clinicInfo?: {
    name?: string;
  };
  fromTime: string;
}

export const medicalTestBookingApi = {
  getClinicMedicalTests(
    clinicId: string
  ): Promise<AxiosResponse<MedicalTestModel[]>> {
    return api.get(`/main/booking-medical-test?clinicId=${clinicId}`);
  },

  getBookingMedicalTestById(
    medicalTestId: string
  ): Promise<AxiosResponse<MedicalTestModel>> {
    return api.get(`/main/booking-medical-test/${medicalTestId}`);
  },

  getBookingMedicalTestServices(
    clinicId: string
  ): Promise<AxiosResponse<GetMedicalTestServicesResponse>> {
    return api.get(`/main/booking-medical-test/services`, {
      params: {
        clinicId,
      },
    });
  },
  createBookingSlot(
    data: CreateBookingSlotModel
  ): Promise<AxiosResponse<unknown>> {
    return api.post("main/booking-medical-test/slots", data);
  },
  getMyBookings(
    page: number,
    fromDate?: string,
    toDate?: string
  ): Promise<AxiosResponse<PageableResponse<MedicalTestSlotModel>>> {
    const firstDate = dayjs("2022-01-01", "YYYY-MM-DD");
    const secondDate = firstDate.add(3, "year");
    return api.post(
      "/main/booking-medical-test/slots/me",
      {
        fromTime: fromDate ?? firstDate.format(dateTimeWithOffset),
        toTime: toDate ?? secondDate.format(dateTimeWithOffset),
      },
      {
        params: {
          page,
          size: 100, // get all
        },
      }
    );
  },
  getSlotById(
    serviceDirectoryId: string,
    type: string,
    clinicId: string
  ): Promise<AxiosResponse<MedicalTestBookingSlotModel>> {
    return api.get(`/main/booking-medical-test/service-info`, {
      params: {
        serviceDirectoryId,
        type,
        clinicId,
      },
    });
  },
  getMedicalTestBookingSlotById(
    id: string
  ): Promise<AxiosResponse<MedicalTestBookingSlotModel>> {
    return api.get(`/main/booking-medical-test/slots/${id}`);
  },
  getAllSlots(
    serviceDirectoryId: string,
    bookingDate: string,
    clinicId: string
  ): Promise<AxiosResponse<BookingSlotModel[]>> {
    return api.get("main/booking-medical-test/slots", {
      params: {
        clinicId,
        serviceDirectoryId,
        bookingDate,
      },
    });
  },

  getAllAvailableSlots(
    serviceDirectoryId: string,
    bookingDate: string,
    clinicId: string
  ): Promise<AxiosResponse<BookingSlotModel[]>> {
    return api.get("main/booking-medical-test/slots/available", {
      params: {
        clinicId,
        serviceDirectoryId,
        bookingDate,
      },
    });
  },
};
