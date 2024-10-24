import type { AxiosResponse } from "axios";

import type { MyProfileForm, MyProfileModel } from "@/entities/myProfile";
import { api } from "./patient/apiClient";

export const familyApi = {
  getMyFamily(): Promise<AxiosResponse<MyProfileModel[]>> {
    return api.get("family/me");
  },
  updateFamilyProfile(values: MyProfileForm): Promise<AxiosResponse<unknown>> {
    return api.post("family", values);
  },
};
