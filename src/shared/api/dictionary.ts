import type { AxiosResponse } from "axios";

import { api } from "@/shared/api/dictionaryService";

interface DictionaryResponse {
  total_count: number;
  total_page: number;
  current_page: number;
  limit: number;
  result: Array<{
    id: string;
    code: string;
    name: string;
    image_url?: string;
  }>;
}

export const dictionaryApi = {
  getSpecialities: (
    languageCode = "ru"
  ): Promise<AxiosResponse<DictionaryResponse>> =>
    api.get(`/speciality`, { params: { languageCode } }),
  getSpecialyById: (
    languageCode = "ru",
    id: string
  ): Promise<AxiosResponse<any>> =>
    api.get(`/speciality/${id}`, { params: { languageCode } }),
  getFamilyMembers: (
    languageCode = "ru"
  ): Promise<AxiosResponse<DictionaryResponse>> =>
    api.get(`/family-member`, { params: { languageCode } }),
  getCities: (
    languageCode = "ru"
  ): Promise<AxiosResponse<DictionaryResponse>> =>
    api.get(`/city`, { params: { languageCode } }),
  getCountries: (
    languageCode = "ru"
  ): Promise<AxiosResponse<DictionaryResponse>> =>
    api.get(`/country`, { params: { languageCode } }),
  getAnalysisTypes: (
    languageCode = "ru"
  ): Promise<AxiosResponse<DictionaryResponse>> =>
    api.get(`medical-service-group`, { params: { languageCode } }),
  getMedicationFrequencies: (
    languageCode = "ru"
  ): Promise<AxiosResponse<DictionaryResponse>> =>
    api.get(`/medication-schedule`, { params: { languageCode } }),
  getDosages: (
    languageCode = "ru"
  ): Promise<AxiosResponse<DictionaryResponse>> =>
    api.get(`/dose`, { params: { languageCode } }),
  getAllergies: (queryParams): Promise<AxiosResponse<DictionaryResponse>> =>
    api.get(`/allergy`, { params: { ...queryParams } }),
  getDrugsIntolerance: (
    languageCode = "ru"
  ): Promise<AxiosResponse<DictionaryResponse>> =>
    api.get(`/drugs-intolerance`, { params: { languageCode } }),
  getInfections: (queryParams): Promise<AxiosResponse<DictionaryResponse>> =>
    api.get(`/infection`, { params: { ...queryParams } }),
  getMedications: (queryParams): Promise<AxiosResponse<DictionaryResponse>> =>
    api.get(`/medication`, { params: { ...queryParams } }),
  getUniversities: (
    languageCode = "ru"
  ): Promise<AxiosResponse<DictionaryResponse>> =>
    api.get(`/university`, { params: { languageCode } }),
  getVaccines: (queryParams): Promise<AxiosResponse<DictionaryResponse>> =>
    api.get(`/vaccine`, { params: { ...queryParams } }),
  getServicesDirectory: (
    languageCode = "ru"
  ): Promise<AxiosResponse<DictionaryResponse>> =>
    api.get(`medical-service`, { params: { languageCode } }),
  getProcedureDirectory: (
    languageCode = "ru"
  ): Promise<AxiosResponse<DictionaryResponse>> =>
    api.get(`main/procedure-directory`, { params: { languageCode } }),
};
