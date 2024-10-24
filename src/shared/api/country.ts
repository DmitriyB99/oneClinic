import type { AxiosResponse } from "axios";

import { api } from "@/shared/api/instance";

interface Country {
  code: string;
  id: string;
  name?: string | null;
}

export const countryApi = {
  getCountries(
    size?: number,
    page?: number,
    languageCode = "ru"
  ): Promise<AxiosResponse<{ result: Country[] }>> {
    return api.get("/country", {
      params: {
        size,
        page,
        languageCode,
      },
    });
  },
};
