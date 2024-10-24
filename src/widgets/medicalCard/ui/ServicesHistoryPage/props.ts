export type docNameType = "bookingConsultationSlot" | "bookingMedicalTestSlot";

export interface ServiceHistoryItem {
  id?: string;
  bookingType?: "CONSULTATION" | "MEDICAL_TEST";
  name?: string;
  serviceDirectoryId?: string;
  clinicName?: string;
  doctorName?: string;
  doctorProfileId?: string;
  clinicId?: string;
  reservedUserId?: string;
  userProfileId?: string;
  patientFullName?: string;
  consultationStatus?: string;
  consultationType?: string;
  samplingMethod?: string;
  fromTime?: string;
  toTime?: string;
}

export interface ServicesHistoryPageProps {
  setServicesHistoryTabVisible: (value: boolean) => void;
}
