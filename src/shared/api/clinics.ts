import type { AxiosResponse } from "axios";

import type { Clinic, GetClinicsQueryParams } from "@/entities/clinics";
import type { WeekdayEnglish } from "@/entities/login";
import type { PageableResponse } from "@/shared/types";
import type { ServiceTypeEnum } from "@/widgets/auth";

import { api } from "./clinicsService";
import type { ClinicDoctorDetails } from "./dtos";
import type { ManagerPhotoUpdatePayload } from "./dtos/clinic";
import type { MainResponse } from "../types";

interface ReviewResponse {
  authorId: string;
  created: Date;
  id: string;
  modified: Date;
  rating: number;
  reviewerName: string;
  reviewingId: string;
  reviewingName: string;
  text: string;
}

export interface WorkPeriod {
  day_of_week: WeekdayEnglish;
  end_time?: string;
  start_time?: string;
  is_working?: boolean;
  is_24hour_working?: boolean;
}

export interface ClinicPhoneNumber {
  phoneNumber: string;
  type: string;
}

export interface ClinicDoctor {
  doctorProfileId: string;
  userId: string;
  username: string;
}

export interface ClinicByIdResponse {
  bin?: string;
  surname?: string;
  fatherName?: string;
  buildNumber: string;
  cityId: string;
  clinicDoctors: ClinicDoctor[];
  clinicServices: {
    analysisTypeId: string;
    price: number;
    serviceDirectoryId: string;
    type: ServiceTypeEnum;
  }[];
  description: string;
  email: string;
  iconUrl: string;
  id: string;
  locationPoint: {
    x: number;
    y: number;
  };
  name: string;
  phoneNumber: string | null;
  phoneNumbers: ClinicPhoneNumber[];
  rating: number;
  status: string;
  street: string;
  tags: string[] | null;
  userId: string;
  workPeriods: WorkPeriod[];
}
export interface ClinicInfoModel {
  buildNumber: string;
  cityId: string;
  cityName: string;
  clinicId: string;
  clinicServices:
    | {
        analysisTypeId: string;
        price: number;
        serviceDirectoryId: string;
        type: ServiceTypeEnum;
      }[]
    | null;
  description: string | null;
  email: string;
  iconUrl: string;
  id: string;
  locationPoint: {
    x: number;
    y: number;
  } | null;
  name: string;
  phoneNumber: string | null;
  phoneNumbers: ClinicPhoneNumber[];
  rating: number;
  reviewCount: string;
  status: string;
  street: string;
  managerPhoto?: string;
  workPeriods: WorkPeriod[];
  managerFullname?: string;
}

interface ClinicPatientDetails {
  fullname: string;
  phoneNumber: string;
  userId: string;
  userProfileId: string;
}

export interface UpdateClinicProfileModel {
  bin?: string;
  cityId?: string;
  description: string;
  email: string;
  id: string;
  locationPoint: {
    x: number;
    y: number;
  };
  name: string;
  phoneNumber: string;
  street: string;
  workPeriods: WorkPeriod[];
  firstName?: string;
  fatherName?: string;
  lastName?: string;
  phoneNumbers: ClinicPhoneNumber[];
}

export const clinicsApi = {
  getClinics(
    queryParams?: GetClinicsQueryParams
  ): Promise<AxiosResponse<PageableResponse<Clinic>>> {
    return api.get("clinic", {
      params: { ...queryParams, limit: 100 },
    });
  },
  getClinicById(id: string): Promise<AxiosResponse<ClinicByIdResponse>> {
    return api.get(`clinic/${id}`);
  },
  getClinicMe(): Promise<AxiosResponse<ClinicByIdResponse>> {
    return api.get(`/main/clinic/me`);
  },
  getClinicInfoById(id: string): Promise<AxiosResponse<ClinicInfoModel>> {
    return api.get(`/main/clinic/info/${id}`);
  },
  getClinicMain(clinicId: string): Promise<AxiosResponse<MainResponse>> {
    return api.post(
      "/main/clinic/main",
      {},
      {
        params: { clinicId },
      }
    );
  },
  getReviews(queryParams?: {
    [key: string]: string;
  }): Promise<AxiosResponse<PageableResponse<ReviewResponse>>> {
    return api.get("/main/review", {
      params: queryParams,
    });
  },
  getClinicDoctors(
    clinicId?: string,
    doctorClinicStatuses?: string[]
  ): Promise<AxiosResponse<PageableResponse<ClinicDoctorDetails>>> {
    return api.post("main/clinic/doctor", {
      clinicId,
      doctorClinicStatuses,
    });
  },
  getClinicDoctorsRequests(): Promise<
    AxiosResponse<PageableResponse<ClinicDoctorDetails>>
  > {
    return api.get("/main/clinic/doctor-request");
  },
  getClinicPatients(
    clinicId?: string
  ): Promise<AxiosResponse<PageableResponse<ClinicPatientDetails>>> {
    return api.post("main/clinic/patient", {
      clinicId,
    });
  },
  updateClinicDoctorStatus(
    doctorProfileId: string,
    status: string
  ): Promise<AxiosResponse<PageableResponse<ClinicPatientDetails>>> {
    return api.put(
      `main/clinic/doctor/conclusion?doctorProfileId=${doctorProfileId}&status=${status}`
    );
  },
  uploadManagerProfilePhoto: (
    file: ManagerPhotoUpdatePayload
  ): Promise<AxiosResponse<ClinicInfoModel>> =>
    api.put("main/clinic/icon", file, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  updateClinicProfile: (
    data: UpdateClinicProfileModel
  ): Promise<AxiosResponse<unknown>> => api.put("main/clinic", data),
  addReviews(
    type: "doctor" | "clinic",
    data?: {
      [key: string]: string | number;
    }
  ): Promise<AxiosResponse<PageableResponse<ReviewResponse>>> {
    return api.post(`/main/review/${type}`, data);
  },
  deleteClinicDoctorById(
    clinicId: string,
    doctorProfileId: string
  ): Promise<AxiosResponse<unknown>> {
    return api.delete("/main/clinic/doctor/delete", {
      params: {
        clinicId,
        doctorProfileId,
      },
    });
  },
};
