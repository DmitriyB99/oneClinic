import type { Dispatch, SetStateAction } from "react";

export interface OnDutyDoctorDialogProps {
  open: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}
