import type { AxiosResponse } from "axios";

import { api } from "@/shared/api/instance";

interface City {
  code: string;
  id: string;
  name?: string | null;
}

export const cityApi = {
  getCities(
    country_id?: string,
    size?: number,
    page?: number,
    languageCode = "ru"
  ): Promise<AxiosResponse<{ result: City[] }>> {
    return api.get("/city", {
      params: {
        size,
        page,
        languageCode,
        country_id,
      },
    });
  },
};
