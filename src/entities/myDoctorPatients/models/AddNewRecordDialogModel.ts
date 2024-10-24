import type { Dispatch, SetStateAction } from "react";

export interface AddNewRecordDialogModel {
  consultationId: string;
  userId: string;
  userProfileId: string;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}
