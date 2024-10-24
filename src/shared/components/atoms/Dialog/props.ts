import type { ReactElement } from "react";

export interface PropertiesDialog {
  children: ReactElement | ReactElement[];
  className?: string;
  darkenBackground?: boolean;
  isOpen: boolean;
  isTinted?: boolean;
  lockScroll?: boolean;
  onScroll?: () => void;
  setIsOpen?: (isOpen: boolean) => void;
  title?: string;
}
