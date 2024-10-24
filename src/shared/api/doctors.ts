import type { AxiosResponse } from "axios";
import qs from "qs";

import type { DoctorProfile } from "@/entities/clinics";
import type { EditDoctorProfileForm } from "@/pages/myDoctor/editProfile";
import { api } from "@/shared/api/instance";
import type { MainResponse, PageableResponse } from "@/shared/types";

import type {
  ActivateSessionWithDutyDoctorResponseDTO,
  ClinicDoctorDetails,
  ConsultationSlotsByDatePayloadDTO,
  ConsultationSlotsByDateResponseDTO,
  DoctorPhotoUpdatePayload,
  GetDoctorStatisticsResponseDTO,
  GetDutyDoctorsListRequestDTO,
  GetDutyDoctorsListResponseDTO,
  PopularDoctorsPayload,
} from "./dtos";

const paramsSerializer = function (params: unknown) {
  return qs.stringify(params, { arrayFormat: "repeat", skipNulls: true });
};

interface DoctorPatient {
  consultationStatus: string;
  fromTime: number;
  fullname: string;
  phoneNumber: string;
  toTime: number;
  userId: string;
  userProfileId: string;
}

interface DoctorExtraFiles {
  fullPath: string;
  uploadPath: string;
}

export const doctorsApi = {
  getDoctor({
    clinicIds,
    specialityCode,
    bodySpecialityCodes,
  }: {
    bodySpecialityCodes?: string[];
    clinicIds?: string[];
    specialityCode?: string;
  }): Promise<AxiosResponse<PageableResponse<DoctorProfile>>> {
    return api.post(
      "main/doctor-profile/info",
      {
        specialityCodes: bodySpecialityCodes,
      },
      {
        params: {
          page: 0,
          size: 999,
          sort: "modified,desc",
          specialityCode,
          clinicIds,
        },
        paramsSerializer,
      }
    ); // TODO: return IN_WORK once we have enough doctors
  },
  getDoctorById: (doctorId: string) =>
    api.get("main/doctor-profile", { params: { doctorId } }),

  getPatientByProfileId: (patientProfileId: string) =>
    api.get(`/main/user-profile/mine/${patientProfileId}`),

  // main/booking-consultation/slots/nearest/chat-room/{chatRoomId}

  getDoctorProfileInfoById: (
    doctorId: string
  ): Promise<AxiosResponse<DoctorProfile>> =>
    api.get(`main/doctor-profile/info/${doctorId}`),

  getMyDoctorProfile: (): Promise<AxiosResponse<DoctorProfile>> =>
    api.get("main/doctor-profile/me"),

  getDoctorProfileById: (
    doctorId: string
  ): Promise<AxiosResponse<DoctorProfile>> =>
    api.get(`main/doctor-profile/${doctorId}`),

  getDoctorMain: (
    doctorProfileId: string
  ): Promise<AxiosResponse<MainResponse>> =>
    api.post("main/doctor-profile/main", { doctorProfileId }),

  getDoctorConsultationSlotsByDate: (
    slotPayload: ConsultationSlotsByDatePayloadDTO
  ): Promise<AxiosResponse<ConsultationSlotsByDateResponseDTO>> =>
    api.post("main/booking-consultation/slots/info", slotPayload, {
      params: {
        page: 0,
        size: 999,
        sort: "modified,desc",
      },
      paramsSerializer,
    }),

  getDoctorIncome: (
    from: string,
    to: string
  ): Promise<AxiosResponse<{ earningsSum: number }>> =>
    api.post("main/doctor-analytics/sum", { from, to }),

  uploadExtraFiles: (
    id?: string,
    file?: File | null
  ): Promise<AxiosResponse<DoctorExtraFiles>> =>
    api.post(
      "main/doctor-profile/extra",
      { id, file },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    ),

  getDoctorPatients: (
    doctorProfileId?: string,
    fullName?: string
  ): Promise<AxiosResponse<PageableResponse<DoctorPatient>>> =>
    api.get(`main/doctor-profile/patient`, {
      params: { doctorProfileId, fullName },
    }),

  updateDoctorProfile: (
    data: EditDoctorProfileForm
  ): Promise<AxiosResponse<unknown>> => api.put("main/doctor-profile", data),

  uploadDoctorProfilePhoto: (
    file: DoctorPhotoUpdatePayload
  ): Promise<AxiosResponse<DoctorProfile>> =>
    api.post("main/doctor-profile", file, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  getDutyDoctorsList: (
    filters: GetDutyDoctorsListRequestDTO
  ): Promise<AxiosResponse<PageableResponse<GetDutyDoctorsListResponseDTO>>> =>
    api.get("main/doctor-profile/on-duty", { params: filters }),

  updateDutyDoctorStatus: (
    data: Partial<DoctorProfile>
  ): Promise<AxiosResponse<DoctorProfile>> =>
    api.put("main/doctor-profile/on-duty", data),

  activateSessionWithDutyDoctor: (
    doctorProfileId: string,
    userProfileId: string,
    clinicId: string,
    price: string | number
  ): Promise<AxiosResponse<ActivateSessionWithDutyDoctorResponseDTO>> =>
    api.put("main/doctor-profile/consultation-on-duty", {
      doctorProfileId,
      userProfileId,
      clinicId,
      price,
    }),

  getDoctorStatistics: (): Promise<
    AxiosResponse<Partial<GetDoctorStatisticsResponseDTO>>
  > => api.get("main/doctor-profile/my-metrics"),

  getPopularDoctors: (
    data: PopularDoctorsPayload
  ): Promise<AxiosResponse<Partial<{ content: ClinicDoctorDetails[] }>>> =>
    api.post("main/doctor-profile/popular", data),
};
