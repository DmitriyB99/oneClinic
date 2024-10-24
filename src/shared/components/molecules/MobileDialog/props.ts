import type { ReactNode } from "react";

export interface MobileDialogProps {
  readonly children: ReactNode;
  readonly hide?: boolean;
  readonly height?: string;
  readonly onHideChange?: (val: boolean) => void;
}
