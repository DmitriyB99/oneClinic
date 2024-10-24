import type { SelectProps } from "antd";

export interface DesktopSelectProps
  extends Omit<SelectProps, "options" | "onChange"> {
  activeStyle?: {
    colorBgContainer?: string;
  };
  className?: string;
  defaultValue?: string;
  isDefault?: boolean;
  onChange?: (
    value: string,
    valObj: DesktopSelectOptionProps | DesktopSelectOptionProps[]
  ) => void;
  options?: Array<DesktopSelectOptionProps>;
}

export interface DesktopSelectOptionProps {
  label: string;
  value: string;
}
