import type { CSSProperties } from "react";

import type { BadgeProps as AntdBadgeProps } from "antd";

export type BadgeType = "warning" | "positive" | "neutral" | "red";

export interface BadgeProps extends AntdBadgeProps {
  className?: string;
  style?: CSSProperties;
  text: string | number;
  type?: BadgeType;
}
