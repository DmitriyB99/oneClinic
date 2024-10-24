import type { FC } from "react";

import clsx from "clsx";

import { TrashBucketIcon } from "@/shared/components";

import type { CardOneClinicProps } from "./props";

export const CardOneClinic: FC<CardOneClinicProps> = ({
  title,
  topText,
  bottomText,
  className,
  removeCard,
  id,
}) => (
  <div className={clsx("group relative rounded-lg bg-white p-4", className)}>
    <div className="text-Regular12 text-secondaryText">{topText}</div>
    <div className="mt-1">{title}</div>
    <div className="mt-1 text-Regular12 text-secondaryText">{bottomText}</div>
    <div
      className="absolute right-3 top-3 hidden cursor-pointer group-hover:block"
      onClick={() => removeCard?.(id)}
    >
      <TrashBucketIcon color="black" />
    </div>
  </div>
);
