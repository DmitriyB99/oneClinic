import type { AxiosResponse } from "axios";

import { api } from "@/shared/api/instance";

import type {
  Pageable,
  GetAllTreatmentsPayloadDTO,
  GetAllTreatmentsResponseDTO,
  GetTreatmentByIdResponseDTO,
} from "./dtos";
import type { PageableResponse } from "../types";

export const treatmentApi = {
  getAllTreatments(
    params: Pageable,
    payload: GetAllTreatmentsPayloadDTO
  ): Promise<
    AxiosResponse<PageableResponse<Partial<GetAllTreatmentsResponseDTO>>>
  > {
    return api.post("/main/treatment-direction/info", payload, { params });
  },
  getTreatmentById(
    // not needed for now
    treatmentId: string
  ): Promise<AxiosResponse<Partial<GetTreatmentByIdResponseDTO>>> {
    return api.get(`/main/treatment-direction/${treatmentId}`);
  },
};
