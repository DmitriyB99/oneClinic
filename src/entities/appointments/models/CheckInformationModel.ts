export type AppointmentFormat = "hospital" | "online" | "home";

export interface AppointmentInformation {
  address?: string;
  cost: number;
  date: string;
  doctor?: string;
  format: AppointmentFormat;
  medicalFacility: string;
  medicalTestType?: string;
  paymentMethod?: "cash" | "card";
}
export interface CheckInformationDialogProps {
  appointmentInformation: AppointmentInformation;
  handleBack?: () => void;
  handleGoToNextPage?: () => void;
  isLoading?: boolean;
  isMedicalTest?: boolean;
  submitButtonText?: string;
}
