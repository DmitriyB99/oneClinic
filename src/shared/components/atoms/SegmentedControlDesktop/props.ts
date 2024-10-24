import type { SegmentedProps } from "antd";

export interface SegmentedControlSaunetProps extends SegmentedProps {
  activeStyle?: {
    borderRadius?: number;
    borderRadiusLG?: number;
    borderRadiusOuter?: number;
    borderRadiusSM?: number;
    borderRadiusXS?: number;
    boxShadowTertiary?: string;
    colorText?: string;
    controlHeight?: number;
  };
  className?: string;
  isDefault?: boolean;
}
