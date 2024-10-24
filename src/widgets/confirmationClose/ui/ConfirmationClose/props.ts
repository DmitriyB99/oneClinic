import type { Dispatch, SetStateAction } from "react";

export interface ComingSoonPropsModel {
  open: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}
