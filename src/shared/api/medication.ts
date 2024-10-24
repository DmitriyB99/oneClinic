import type { AxiosResponse } from "axios";

import { api } from "@/shared/api/instance";
import type { PageableResponse } from "@/shared/types";

interface MedicationModel {
  code: string;
  id: string;
  name: string;
  nameTranslation: {
    en: string;
    kk: string;
    ru: string;
  };
}

export const medicationApi = {
  getMedications(): Promise<
    AxiosResponse<PageableResponse<MedicationModel[]>>
  > {
    return api.get("/main/medication");
  },
};
