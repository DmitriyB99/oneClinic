import type { AxiosResponse } from "axios";
import qs from "qs";

import type { Clinic, DoctorProfile } from "@/entities/clinics";
import type { PageableResponse } from "@/shared/types";
import type { PatientData } from "@/widgets/Desktop";

import type { ClinicByIdResponse, ClinicInfoModel } from "./clinics";
import { api } from "./instance";

export interface AllConsultationsResponse {
  bookingConsultationSlotId: string;
  clinicInfo: ClinicInfoModel;
  consultationStatus: string;
  consultationType: string;
  doctorFullname: string;
  doctorProfileId: string;
  fromTime: string;
  isInDirection: boolean;
  price: number;
  patientFullName: string;
  reservedUserId: string;
  toTime: string;
}

export interface ReviewResponse {
  id: string;
  authorId: string;
  reviewingId: string;
  reviewingName: string;
  reviewerName: string;
  text: string;
  rating: number;
  created: Date;
  modified: Date;
}
export interface ClinicPatientDetails {
  fullname: string;
  phoneNumber: string;
  userId: string;
  userProfileId: string;
}
/* eslint-disable  @typescript-eslint/no-explicit-any */

export interface PatientMedCard {
  id: string;
  userId: string;
  userProfileId: string;
  isMine: boolean;
  name: string;
  surname: string;
  patronymic: string;
  dateOfBirth: string;
  isMale: boolean;
  weight: number;
  height: number;
  allergies: any;
  drugsIntolerance: [];
  vaccinesToDate: any;
  infectionsToDate: any;
  created: Date;
  modified: Date;
}

export interface PatientProfile extends PatientMedCard {
  familyId: string;
  invitingFamilyId: string;
  phoneNumber: string;
  whoIs: string;
  photoUrl: string;
  iin: string;
  addressInfos: [
    {
      type: string;
      cityId: string;
      street: string;
      buildNumber: string;
    }
  ];
}

export interface PatientFinances {
  id: string;
  senderId: string;
  senderName: string;
  senderWalletType: string;
  recieverId: string;
  receiverName: string;
  recieverWalletType: string;
  productName: string;
  note: string;
  currency: string;
  amount: number;
  transactionType: string;
  transactionStatus: string;
  created: Date;
  modified: Date;
}
export interface Messages {
  id: "string";
  chatRoomId: "string";
  senderId: "string";
  content: "string";
  status: "string";
  fileUrl: "string";
  repliedMessageId: "string";
  created: Date;
  modified: "string";
}
export interface ChatRooms {
  id: "string";
  name: "string";
  chatRoomType: "string";
  members: "string"[];
  latestChatMessage: Messages;
  online: boolean;
}

const paramsSerializer = function (params: unknown) {
  return qs.stringify(params, { arrayFormat: "repeat", skipNulls: true });
};

export const superAdminApis = {
  getPatients(
    page = 0,
    size = 100
  ): Promise<AxiosResponse<PageableResponse<PatientData>>> {
    return api.get("main/user-profile/short", {
      params: {
        page,
        size,
      },
    });
  },
  getClinics(
    page = 0,
    size = 100
  ): Promise<AxiosResponse<PageableResponse<Clinic>>> {
    return api.get("main/clinic", {
      params: {
        page,
        size,
      },
    });
  },
  getNewClinics(
    page = 0,
    size = 100
  ): Promise<AxiosResponse<PageableResponse<Clinic>>> {
    return api.get("auth/user/clinic/new-account/all", {
      params: {
        page,
        size,
      },
    });
  },
  getDoctorMessages(
    userId: string,
    page = 0,
    size = 100
  ): Promise<AxiosResponse<PageableResponse<ChatRooms>>> {
    return api.get("main/chat/admin", {
      params: {
        userId,
        page,
        size,
      },
    });
  },
  getDoctorMessagesInfo(
    chatRoomId: string,
    page = 0,
    size = 100
  ): Promise<AxiosResponse<PageableResponse<Messages>>> {
    return api.get("main/chat/admin/message", {
      params: {
        chatRoomId,
        page,
        size,
      },
    });
  },
  getAllConsultations: (
    role: "clinicId",
    roleId: string
  ): Promise<AxiosResponse<PageableResponse<AllConsultationsResponse>>> =>
    api.post("main/service-history/slots", {
      clinicId: roleId,
      fromDate: "2020-12-14T08:11:56.670Z",
      toDate: "2025-12-14T08:11:56.670Z",
    }),
  getAllDoctorConsultations: (
    doctorId: string
  ): Promise<AxiosResponse<PageableResponse<AllConsultationsResponse>>> =>
    api.post("main/service-history/slots", {
      doctorProfileId: doctorId,
    }),
  getClinicById(id: string): Promise<AxiosResponse<ClinicByIdResponse>> {
    return api.get(`main/clinic/${id}`);
  },
  getClinicReviews(
    page = 0,
    size = 100,
    reviewingId?: string
  ): Promise<AxiosResponse<PageableResponse<ReviewResponse>>> {
    return api.get(`main/review?reviewingId=${reviewingId}`, {
      params: {
        page,
        size,
      },
    });
  },
  getClinicPatients(
    clinicId?: string
  ): Promise<AxiosResponse<PageableResponse<ClinicPatientDetails>>> {
    return api.post("main/clinic/patient", {
      clinicId,
    });
  },
  getDoctorFinances: (doctorUserId: string): Promise<AxiosResponse> =>
    api.post("main/doctor-analytics", { doctorUserId }),
  putClinicStatus(
    clinicId: string,
    status: string
  ): Promise<AxiosResponse<ReviewResponse>> {
    return api.put(
      `auth/user/clinic/conclusion?clinicId=${clinicId}&status=${status}`
    );
  },
  putDoctorStatus(
    doctorId: string,
    status: string
  ): Promise<AxiosResponse<ReviewResponse>> {
    return api.put(
      `auth/user/doctor/conclusion?doctorId=${doctorId}&status=${status}`
    );
  },
  removeDoctor(id: string): Promise<AxiosResponse> {
    return api.delete(`/auth/user/doctor/delete?userId=${id}`);
  },
  getAwaitsDoctors(): Promise<AxiosResponse<PageableResponse<DoctorProfile>>> {
    return api.get("/auth/user/doctor/new-account/all");
  },
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
    );
  },
  getPatientFinances(
    userId: string
  ): Promise<AxiosResponse<PageableResponse<PatientFinances>>> {
    return api.get(`main/user-analytics`, {
      params: { userId, sort: "created,desc" },
    });
  },
  getPatientProfile(userId: string): Promise<AxiosResponse<PatientProfile>> {
    return api.get(`main/user-profile/${userId}`);
  },
  getPatientMedCard(userId: string): Promise<AxiosResponse<PatientMedCard>> {
    return api.get(`main/medical-card/${userId}`);
  },
  getDoctorProfileInfoById: (
    doctorId: string
  ): Promise<AxiosResponse<DoctorProfile>> =>
    api.get(`main/doctor-profile/info/${doctorId}`),
};
