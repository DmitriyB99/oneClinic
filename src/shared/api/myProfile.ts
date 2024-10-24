import type { AxiosResponse } from "axios";

import type { MyShortInfoModel } from "@/entities/myProfile";
import type { PageableResponse } from "@/shared/types";

import { api } from "./patient/apiClient";

export const myProfileApi = {
  getUserDataByShort(
    key?: string,
    searchData?: string
  ): Promise<AxiosResponse<PageableResponse<MyShortInfoModel>>> {
    return api.get("/main/user-profile/short", {
      params: key && {
        [key]: decodeURIComponent(searchData ?? "").replace(/\+/g, " "),
      },
    });
  },
};
