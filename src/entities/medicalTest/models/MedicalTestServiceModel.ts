export interface MedicalTestService {
  analysisTypeId: string | null;
  analysisTypeName: string | null;
  price: number | null;
  serviceDirectoryId: string | null;
  serviceDirectoryName: string | null;
  type: string | null;
}

export interface GetMedicalTestServicesResponse {
  ANALYSIS: MedicalTestService[];
  DIAGNOSTIC: MedicalTestService[];
}
