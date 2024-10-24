import type { ButtonProps } from "antd";

export interface SaunetButtonProps extends Omit<ButtonProps, "size"> {
  danger?: boolean;
  iconButton?: boolean;
  outlineDanger?: boolean;
  size?: "s" | "m" | "desktopS";
  square?: boolean;
  transparent?: boolean;
  variant?: "primary" | "secondary" | "tertiary" | "tinted" | "outline";
}
