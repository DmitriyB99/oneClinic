import type { AxiosResponse } from "axios";

import { api } from "./apiClient";

export interface FamilyMember {
  birth_date?: string;
  family_member_code: string;
  father_name: string;
  gender: string;
  iin: string;
  name: string;
  phone: string;
  surname: string;
  weight: number;
  height: number;
}

export const patientFamilyApi = {
  getFamily(): Promise<AxiosResponse<any>> {
    return api.get("family");
  },
  getFamilyMember(id: string): Promise<AxiosResponse<any>> {
    return api.get(`family/${id}`);
  },
  createFamilyMember(data: FamilyMember): Promise<AxiosResponse<unknown>> {
    return api.post("family", data);
  },
  updateFamilyMember(
    id: string,
    data: Partial<FamilyMember>
  ): Promise<AxiosResponse<unknown>> {
    return api.put(`family/${id}`, data);
  },
};
