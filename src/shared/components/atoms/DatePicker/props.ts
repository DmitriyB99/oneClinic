import type { DatePickerProps as AntDatePickerProps } from "antd";

export type DatePickerProps = AntDatePickerProps & {
  isError?: boolean;
  bottomText?: string;
};
