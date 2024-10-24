import type { AxiosResponse } from "axios";

import type { MedicalTestCategoryModel } from "@/entities/medicalTest";
import { api } from "@/shared/api/instance";
import type { PageableResponse } from "@/shared/types";

export const medicalTestCategoryApi = {
  getAllMedicalTestCategories(): Promise<
    AxiosResponse<PageableResponse<MedicalTestCategoryModel>>
  > {
    return api.get(`/main/medical-test-category`);
  },
};
