import type { Dispatch, SetStateAction } from "react";

export interface MedicalCardInformationBlockProps {
  isEditable?: boolean;
  isEmpty: boolean;
  setDialogVisible?: Dispatch<SetStateAction<boolean>>;
  topText: string;
}
