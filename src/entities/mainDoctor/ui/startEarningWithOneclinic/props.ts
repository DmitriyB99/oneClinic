import type { Dispatch, SetStateAction } from "react";

export interface StartEarningWithOneclinicDialogProps {
  open: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}
