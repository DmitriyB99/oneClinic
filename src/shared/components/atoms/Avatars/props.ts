import type { CSSProperties, ReactNode } from "react";

export type AvatarSize =
  | "xs"
  | "s"
  | "m"
  | "l"
  | "xl"
  | "clinicAva"
  | "lg"
  | "avatar";

export interface AvatarProps {
  bottomRightIcon?: JSX.Element;
  className?: string;
  icon?: ReactNode;
  isOnline?: boolean;
  isSquare?: boolean;
  size?: AvatarSize | number;
  src?: string | ReactNode;
  style?: CSSProperties;
  text?: string;
  isGPT?: boolean;
}
