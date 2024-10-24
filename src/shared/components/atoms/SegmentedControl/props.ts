import type { SegmentedProps } from "antd";

type SegmentedControlSizes = "m" | "l";

export interface SegmentedControlSaunetProps
  extends Omit<SegmentedProps, "size"> {
  size?: SegmentedControlSizes;
}
