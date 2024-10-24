import type { AxiosResponse } from "axios";

import { api } from "./apiClient";
import type { Pageable } from "../dtos";

export interface SearchablePageable extends Omit<Pageable, "sort"> {
  search: string;
  sort: string;
}

export const doctorPatientsApi = {
  getPatients(params: SearchablePageable): Promise<AxiosResponse<any>> {
    return api.get("patients", { params });
  },
};
