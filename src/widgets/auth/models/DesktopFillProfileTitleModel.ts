import type { ReactElement } from "react";

export interface DesktopFillProfileTitleModel {
  labelCount: string;
  titleText: string;
  children: ReactElement;
  back?: () => void;
}
