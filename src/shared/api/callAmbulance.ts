import type { AxiosResponse } from "axios";

import type { CreateAmbulanceCallModel } from "@/entities/ambulance";
import { api } from "@/shared/api/instance";
import type { PageableResponse } from "@/shared/types";

export const callAmbulanceApi = {
  createAmbulanceCall(data: CreateAmbulanceCallModel) {
    return api.post("main/ambulance-call", data);
  },
  getMyAmbulanceCalls(
    page: number,
    size: number
  ): Promise<AxiosResponse<PageableResponse<CreateAmbulanceCallModel>>> {
    return api.get("main/ambulance-call/me", { params: { page, size } });
  },
};
