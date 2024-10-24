import type { Dispatch, SetStateAction } from "react";

export interface DoctorBookingRescheduleDialogProps {
  isDoctor: boolean;
  transferPenalty: number;
  doctorProfileId: string;
  clinicId: string;
  consultationId: string;
  isConfirmationDialogOpen: boolean;
  setIsConfirmationDialogOpen: Dispatch<SetStateAction<boolean>>;
  isRescheduleDialogOpen: boolean;
  setIsRescheduleDialogOpen: Dispatch<SetStateAction<boolean>>;
  onRescheduleSubmit: () => void;
}
