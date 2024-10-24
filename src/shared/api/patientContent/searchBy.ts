import type { AxiosResponse } from "axios";

import { api } from "./apiClient";

export interface Clinic {
  id: string;
  name: string;
}

export interface Doctor {
  first_name: string;
  id: string;
  last_name: string;
}

export interface Speciality {
  code: string;
  id: string;
  name: string;
}

export interface DataResponse {
  clinics: Clinic[];
  doctors: Doctor[];
  specialities: Speciality[];
}

export const patientSearchApi = {
  getSearchResult(search: string): Promise<AxiosResponse<DataResponse>> {
    return api.get("search", { params: { search } });
  },
  getAnalysisSearchResult(
    search: string
  ): Promise<AxiosResponse<DataResponse>> {
    return api.get("search/analysis", { params: { search } });
  },
  getOnlineSearchResult(search: string): Promise<AxiosResponse<DataResponse>> {
    return api.get("search/online", { params: { search } });
  },
};
