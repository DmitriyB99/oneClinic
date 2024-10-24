import type { AxiosResponse } from "axios";

import type {
  MyProfileForm,
  MyProfileModel,
  MyProfilePhotoUpdateModel,
} from "@/entities/myProfile";

import { api } from "./apiClient";

export const patientProfileApi = {
  getMyProfile(): Promise<AxiosResponse<Partial<MyProfileModel>>> {
    return api.get("profile/me");
  },
  updateMyProfile(
    updatedProfileData: MyProfileForm
  ): Promise<AxiosResponse<unknown>> {
    return api.put("profile/me", updatedProfileData);
  },
  updateMyPhoto(
    data: MyProfilePhotoUpdateModel
  ): Promise<AxiosResponse<unknown>> {
    return api.post("profile/me/photo", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
