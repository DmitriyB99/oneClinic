import type { ReactElement } from "react";

export interface ButtonCallProps {
  icon: ReactElement;
  isDanger?: boolean;
  onClick?: () => void;
  title: string;
}
