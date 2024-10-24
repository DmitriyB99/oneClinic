import type { SelectProps as AntSelectProps } from "antd";

export interface SelectProps extends AntSelectProps {
  isError?: boolean;
  bottomText?: string;
}
