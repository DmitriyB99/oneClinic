import type { Consultation } from "@/entities/appointments";

export interface BookingInfoProps {
  isDoctor: boolean;
  shouldDisplayMainButtons: boolean;
  consultationData?: Consultation;
  isConsultationLoading: boolean;
  isConsultationError: boolean;
  onRescheduleClick?: () => void;
  onCancelClick?: () => void;
  AdditionalButton?: React.ReactNode;
  DescriptionElement?: React.ReactNode;
}
