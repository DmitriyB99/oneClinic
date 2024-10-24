import type { FC } from "react";

import clsx from "clsx";

import { DividerSaunet } from "@/shared/components";

import type { DataEntryProps } from "./props";

export const DataEntry: FC<DataEntryProps> = ({
  topText,
  bottomText,
  isDivided = false,
}: DataEntryProps) => (
  <>
    {topText && (
      <div className="mb-1 text-Regular12 text-secondaryText">{topText}</div>
    )}
    <div
      className={clsx("text-Regular16 text-dark", {
        "!my-6": !topText,
        "mb-4": !isDivided,
      })}
    >
      {bottomText}
    </div>
    {isDivided && <DividerSaunet className="my-3" />}
  </>
);
