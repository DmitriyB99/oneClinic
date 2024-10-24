import type { AxiosResponse } from "axios";

import { api } from "@/shared/api/instance";

export interface MedicationPrescriptionModel {
  dose: string;
  doseType?: string;
  durationDays: number;
  frequency: string;
  frequencyType?: string;
  name: string;
}

export interface CreateNewPrescription {
  diagnosis: string;
  doctorProfileId: string;
  medications: MedicationPrescriptionModel[];
  patientComplaints: string;
  recommendations: string;
  treatmentDirections: {
    category: string;
    categoryId: string;
  }[];
  userId: string;
  userProfileId: string;
}

export interface CreateMedicalPrescriptionResponse
  extends CreateNewPrescription {
  id: string;
  medications: Array<{
    name: string;
    dose: string;
    frequency: string;
    durationDays: number;
  }>;
}

export const medicalPrescriptionApi = {
  createMedicalPrescription(
    data: CreateNewPrescription
  ): Promise<AxiosResponse<CreateMedicalPrescriptionResponse>> {
    return api.post("/main/medical-prescription", data);
  },
  addPrescriptionToConsultation(
    consultationId: string,
    medicalPrescriptionId: string
  ): Promise<AxiosResponse<unknown>> {
    return api.put("/main/booking-consultation/slots/medical-prescription", {
      id: consultationId,
      medicalPrescriptionId,
    });
  },
};
