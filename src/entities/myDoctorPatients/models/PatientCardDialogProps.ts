import type { Dispatch, SetStateAction } from "react";

export interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onMedicalCardClick?: () => void;
  onWriteOutDirectionClick?: () => void;
}
