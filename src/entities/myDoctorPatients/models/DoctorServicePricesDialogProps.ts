import type { Dispatch, SetStateAction } from "react";

export type DoctorProfileServiceType = "ONLINE" | "OFFLINE" | "AWAY";

export interface DoctorServicePricesDialogProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  firstPriceLabel: string;
  secondPriceLabel: string;
  inputValue: string[];
  setInputValue: Dispatch<SetStateAction<string[]>>;
  serviceType: DoctorProfileServiceType;
  onSubmit: (result: string[], type: DoctorProfileServiceType) => void;
}
