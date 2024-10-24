import type { Dispatch, SetStateAction } from "react";

import type { ListType } from "@/shared/components";

export interface MedicalTestListDialogProps {
  handleMedicalTestClick: (id?: string | number) => void;
  isOpen: boolean;
  medicalTests: ListType[];
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  title: string;
}
