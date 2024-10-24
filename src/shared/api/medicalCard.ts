import type { AxiosResponse } from "axios";

import type { MedicalCard } from "@/widgets/medicalCard";

import { api } from "./medicalCardService";

export interface Medication {
  dose: number;
  dose_id: string;
  medical_card_id: string;
  medication_id: string;
  medication_schedule: number;
  medication_schedule_id: string;
  treatment_days: number;
}

export interface ServiceHistory {
  patient_id: string;
  filters?: string;
  from_date?: string;
  to_date?: string;
  offset?: number;
  limit?: number;
}

export const medicalCardApi = {
  getServiceHistory(data: ServiceHistory): Promise<AxiosResponse<unknown>> {
    const { patient_id, ...body } = data;

    return api.get(`service-history/${patient_id}/info`, { params: body });
  },
  getMedicalCard(
    patient_id: string,
    language = "ru"
  ): Promise<AxiosResponse<MedicalCard>> {
    return api.get("medical-card/card/info", {
      params: { patient_id, language },
    });
  },
  getMedicalCardById(patient_id: string): Promise<AxiosResponse<unknown>> {
    return api.get(`medical-card/card/${patient_id}`);
  },
  updateMedicalCard(
    patient_id: string,
    data: unknown
  ): Promise<AxiosResponse<unknown>> {
    return api.put(`medical-card/card/${patient_id}`, data);
  },
  /////////////////////////////////////////////////////////////////////////
  createAllergy(data: {
    allergy_id: string;
    description: string;
    medical_card_id: string;
  }): Promise<AxiosResponse<unknown>> {
    const { medical_card_id, ...body } = data;

    return api.post(`medical-card/${medical_card_id}/allergy`, body);
  },
  getAllergyById(
    medical_card_id: string,
    language = "ru"
  ): Promise<AxiosResponse<unknown>> {
    return api.get(`medical-card/${medical_card_id}/allergy`, {
      params: { language },
    });
  },

  updateAllergy(data: {
    medical_card_id: string;
    allergy_id: string;
    id: string;
    description: string;
  }): Promise<AxiosResponse<unknown>> {
    const { medical_card_id, id, ...body } = data;

    return api.put(`medical-card/${medical_card_id}/allergy/${id}`, body);
  },
  deleteAllergy(data: {
    medical_card_id: string;
    id: string;
  }): Promise<AxiosResponse<unknown>> {
    const { medical_card_id, id } = data;

    return api.delete(`medical-card/${medical_card_id}/allergy/${id}`);
  },

  /////////////////////////////////////////////////////////////////////////
  createDrugIntolerance(data: {
    medical_card_id: string;
    medication_id: string;
  }): Promise<AxiosResponse<unknown>> {
    const { medical_card_id, ...body } = data;

    return api.post(`medical-card/${medical_card_id}/drugs-intolerance`, body);
  },
  getDrugIntoleranceById(
    medical_card_id: string,
    language = "ru"
  ): Promise<AxiosResponse<unknown>> {
    return api.get(`medical-card/${medical_card_id}/drugs-intolerance/`, {
      params: language,
    });
  },
  updateDrugIntolerance(data: {
    medical_card_id: string;
    medication_id: string;
    id: string;
  }): Promise<AxiosResponse<unknown>> {
    const { medical_card_id, id, medication_id } = data;
    return api.put(`medical-card/${medical_card_id}/drugs-intolerance/${id}`, {
      medication_id: medication_id,
    });
  },
  deleteDrugIntolerance(data: {
    medical_card_id: string;
    id: string;
  }): Promise<AxiosResponse<unknown>> {
    const { medical_card_id, id } = data;

    return api.delete(
      `medical-card/${medical_card_id}/drugs-intolerance/${id}`
    );
  },
  /////////////////////////////////////////////////////////////////////////
  createInfection(data: {
    medical_card_id: string;
    infection_id: string;
    infection_date: string;
  }): Promise<AxiosResponse<unknown>> {
    const { medical_card_id, ...body } = data;

    return api.post(`medical-card/${medical_card_id}/infection`, body);
  },
  getInfectionById(
    medical_card_id: string,
    language = "ru"
  ): Promise<AxiosResponse<unknown>> {
    return api.get(`medical-card/${medical_card_id}/infection`, {
      params: language,
    });
  },
  updateInfection(data: {
    medical_card_id: string;
    infection_date: string;
    infection_id: string;
    id: string;
  }): Promise<AxiosResponse<unknown>> {
    const { medical_card_id, id, ...body } = data;
    return api.put(`medical-card/${medical_card_id}/infection/${id}`, body);
  },
  deleteInfection(data: {
    medical_card_id: string;
    id: string;
  }): Promise<AxiosResponse<unknown>> {
    const { medical_card_id, id } = data;

    return api.delete(`medical-card/${medical_card_id}/infection/${id}`);
  },
  /////////////////////////////////////////////////////////////////////////
  createMedication(data: Medication): Promise<AxiosResponse<unknown>> {
    const { medical_card_id, ...body } = data;

    return api.post(`medical-card/${medical_card_id}/medication`, body);
  },
  getMedicationById(
    medical_card_id: string,
    language = "ru"
  ): Promise<AxiosResponse<unknown>> {
    return api.get(`medical-card/${medical_card_id}/medication`, {
      params: language,
    });
  },
  updateMedication(
    data: Medication & { id: string }
  ): Promise<AxiosResponse<unknown>> {
    const { medical_card_id, id, ...body } = data;
    return api.put(`medical-card/${medical_card_id}/medication/${id}`, body);
  },
  deleteMedication(data: {
    medical_card_id: string;
    id: string;
  }): Promise<AxiosResponse<unknown>> {
    const { medical_card_id, id } = data;

    return api.delete(`medical-card/${medical_card_id}/medication/${id}`);
  },
  /////////////////////////////////////////////////////////////////////////
  createVaccine(data: {
    medical_card_id: string;
    vaccine_id: string;
    vaccine_date: string;
  }): Promise<AxiosResponse<unknown>> {
    const { medical_card_id, ...body } = data;

    return api.post(`medical-card/${medical_card_id}/vaccine`, body);
  },
  getVaccineById(
    medical_card_id: string,
    language = "ru"
  ): Promise<AxiosResponse<unknown>> {
    return api.get(`medical-card/${medical_card_id}/vaccine`, {
      params: language,
    });
  },
  updateVaccine(data: {
    medical_card_id: string;
    vaccine_date: string;
    vaccine_id: string;
    id: string;
  }): Promise<AxiosResponse<unknown>> {
    const { medical_card_id, id, ...body } = data;
    return api.put(`medical-card/${medical_card_id}/vaccine/${id}`, body);
  },
  deleteVaccine(data: {
    medical_card_id: string;
    id: string;
  }): Promise<AxiosResponse<unknown>> {
    const { medical_card_id, id } = data;

    return api.delete(`medical-card/${medical_card_id}/vaccine/${id}`);
  },
};
