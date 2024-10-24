import type { AxiosError, AxiosResponse } from "axios";
import axios from "axios";

import type {
  ClinicDataFillModel,
  ClinicRegistrationRequestModel,
  DoctorDataFillModel,
  ClinicDoctorDataFillModel,
  DoctorRegistrationModel,
  ManagerRegistrationModel,
} from "@/widgets/auth/models";
import {
  getRefreshToken,
  removeAuthToken,
  removeRefreshToken,
} from "shared/utils/auth";

import { api, baseURL } from "./authService";
import type { PageableResponse } from "../types";

export const authApi = {
  authUserByLogin(password: string, username: string) {
    return api
      .post("auth/login", null, {
        auth: { username, password },
      })
      .catch((err: AxiosError) => Promise.reject(err));
  },
  authUserGetOTP(number: string) {
    return api.post("auth/sms/send", { phone: number });
  },
  getProfile() {
    return api.get("user/me");
  },
  authUserWithOTP(number: string, code: string) {
    return api.post("auth/sms/verify", { phone: number, code });
  },
  refreshAuthToken() {
    const refreshToken = getRefreshToken();

    // send refreshToken to Android
    if (window.AndroidInterface?.sendRefreshToken) {
      window.AndroidInterface.sendRefreshToken(refreshToken);
    }

    // send refreshToken to iOS
    if (window.webkit?.messageHandlers?.jsMessageHandler?.postMessage) {
      window.webkit.messageHandlers.jsMessageHandler.postMessage(
        JSON.stringify({
          newToken: refreshToken,
        })
      );
    }

    return axios
      .post<{ access_token: string; refresh_token?: string }>(
        `${baseURL}auth/token/refresh`,
        { refresh_token: refreshToken }
      )
      .catch((err: AxiosError) => {
        removeAuthToken();
        removeRefreshToken();
        return Promise.reject(err);
      });
  },
  registerDoctor(data: DoctorRegistrationModel) {
    return api.post("/doctor/new-account", data);
  },
  registerClinic(data: ManagerRegistrationModel) {
    return api.post("/clinic/new-account", data);
  },
  createDoctorByClinic(
    data: ClinicDoctorDataFillModel
  ): Promise<AxiosResponse<PageableResponse<unknown>>> {
    return api.post("/auth/user/clinic/doctor/create", data);
  },
  // updateMyPassword(
  //   id: string,
  //   password: string
  // ): Promise<AxiosResponse<unknown>> {
  //   return api.post(`user/change-password`, { id, password });
  // },

  updateMyPassword(id: string, password: string) {
    return api.post("user/change-password", { id, password });
  },

  doctorFillProfile(data: DoctorDataFillModel) {
    return api.put("/auth/user/doctor/fill", data);
  },
  clinicFillProfile(data: ClinicDataFillModel) {
    return api.put("/auth/user/clinic/fill", data);
  },
  getAllNewClinic(): Promise<
    AxiosResponse<PageableResponse<ClinicRegistrationRequestModel>>
  > {
    return api.get("/auth/user/clinic/new-account/all");
  },
  setDeviceId(deviceId: string, tokenType: "ANDROID" | "IOS") {
    return api.post(
      `/notification/push?token=${deviceId}&tokenType=${tokenType}`
    );
  },
  removeDeviceId(tokenType: "ANDROID" | "IOS") {
    return api.post(`/notification/push?token=""&tokenType=${tokenType}`);
  },
  checkExistingIin(iin: string) {
    return api.post("/auth/user/doctor/exist/iin", {}, { params: { iin } });
  },
  checkExistingLogin(username: string) {
    return api.post(
      "/auth/user/doctor/exist/username",
      {},
      { params: { username } }
    );
  },
};
