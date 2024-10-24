import type { Dispatch, ReactNode, SetStateAction } from "react";

export interface DoctorBookingDialogProps {
  address?: string | null;
  buttons?: ReactNode;
  clinicName?: string | null;
  imageUrl?: string | null;
  openDoctorBookingDialog: boolean;
  personName?: string | null;
  price?: string | null | number;
  reminderText?: string | null;
  setOpenDoctorBookingDialog: Dispatch<SetStateAction<boolean>>;
  subtitle?: string | null;
  title?: string | null;
}
