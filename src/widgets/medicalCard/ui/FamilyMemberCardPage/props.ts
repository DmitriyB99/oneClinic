export interface MedicalCard {
  medical_card: {
    created: string;
    height?: number;
    id: string;
    modified?: string;
    patient_id: string;
    user_id: string;
    weight?: number;
  };
  medical_card_allergy: {
    allergy_id: string;
    created: string;
    description: string;
    id: string;
    medical_card_id: string;
    modified: string;
  }[];
  medical_card_drugs_intolerance: {
    created: string;
    drugs_intolerance_id: string;
    id: string;
    medical_card_id: string;
  }[];
  medical_card_infection: {
    created: string;
    id: string;
    infection_date: string;
    infection_id: string;
    medical_card_id: string;
    modified: string;
  }[];
  medical_card_medication: {
    created: string;
    dose: number;
    dose_id: string;
    id: string;
    medical_card_id: string;
    medication_id: string;
    medication_schedule: number;
    medication_schedule_id: string;
    modified: string;
    treatment_days: number;
  }[];
  medical_card_vaccine: {
    created: string;
    id: string;
    medical_card_id: string;
    modified: string;
    vaccine_date: string;
    vaccine_id: string;
  }[];
}
