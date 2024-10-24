type SamplingMethod = "AT_HOME" | "AT_CLINIC" | "SELF";

export interface MedicalTestModel {
  categoryId?: string;
  clinicId: string;
  created?: string;
  description: string;
  doctorProfileId?: string;
  id: string;
  modified?: string;
  name: string;
  price: number;
  samplingMethods: SamplingMethod[];
}
