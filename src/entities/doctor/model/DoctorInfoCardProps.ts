import type { ClinicDoctorDetails } from "@/shared/api/dtos";

export type DoctorInfoCardProps = Partial<ClinicDoctorDetails> & {
  onRegisterAppointment?: () => void;
  onCardClick?: () => void;
  className?: string;
  isOnlineConsultation?: boolean;
};
