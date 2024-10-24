import type { FC } from "react";

import clsx from "clsx";

import type { DesktopMyNumbersInfoCardProps } from "@/entities/statistics";
import { Island } from "@/shared/components";

import { CaretDown } from "./CaretDown";

export const DesktopMyNumbersInfoCard: FC<DesktopMyNumbersInfoCardProps> = ({
  title,
  indicator,
  changes,
  className,
  secondLine,
}) => (
  <Island className={clsx("w-40 pb-2 text-Bold14", className)}>
    {title}
    {secondLine && <div>{secondLine}</div>}
    <div className="flex">
      <div className="mt-1 text-Bold32">{indicator}</div>
      <CaretDown number={changes} rise={changes[0] === "+"} />
    </div>
  </Island>
);
