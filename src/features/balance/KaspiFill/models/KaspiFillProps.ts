import type { Dispatch, SetStateAction } from "react";

export interface KaspiFillProps {
  isDialogOpen: boolean;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
}
