import type { AxiosResponse } from "axios";

import { api } from "@/shared/api/instance";

export const serviceDirectoryApi = {
  getServiceData(serviceId?: string): Promise<AxiosResponse<unknown>> {
    return api.get("/main/service-directory", {
      params: {
        id: serviceId,
      },
    });
  },
};
