import type { FC } from "react";

import clsx from "clsx";

import type { CaretDownProps } from "@/entities/statistics";
import { CaretDownIcon } from "@/shared/components";

export const CaretDown: FC<CaretDownProps> = ({ rise, number }) => (
  <div
    className={clsx("ml-2 flex items-end pb-1 text-Regular14", {
      "text-positiveStatus": rise,
      "text-red": !rise,
    })}
  >
    {number}
    <div
      className={clsx("flex h-4 w-4 justify-center", {
        "items-center": !rise,
      })}
    >
      <CaretDownIcon
        size="xs"
        color={rise ? "positiveStatus" : "red"}
        rotate={rise ? 180 : 0}
      />
    </div>
  </div>
);
