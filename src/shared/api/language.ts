import type { AxiosResponse } from "axios";

import { api } from "@/shared/api/instance";

export type LanguageCode = "ru" | "uz" | "kk" | "en";

export const languageApi = {
  updateUserLanguage(
    userId: string,
    code: LanguageCode
  ): Promise<AxiosResponse> {
    return api.put(
      "/main/user-info/language",
      {},
      { params: { userId, languageCode: code } }
    );
  },
};
