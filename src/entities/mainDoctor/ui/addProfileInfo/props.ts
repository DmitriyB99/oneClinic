import type { Dispatch, SetStateAction } from "react";

export interface AddProfileInfoDialogProps {
  open: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}
