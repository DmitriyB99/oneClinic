import type { FC } from "react";

import type { ProgressProps } from "antd";
import { Progress } from "antd";

import { colors } from "@/shared/config";

export const ProgressBar: FC<ProgressProps> = ({ ...rest }) => (
  <Progress
    type="line"
    strokeColor={colors?.brand?.primary}
    className="w-full rounded-3xl"
    showInfo={false}
    trailColor={colors?.gray?.[1]}
    {...rest}
  />
);
