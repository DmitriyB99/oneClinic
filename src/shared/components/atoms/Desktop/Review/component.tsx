import type { FC } from "react";

import { Rate } from "antd";
import clsx from "clsx";

import type { ReviewProps } from "./props";

export const Review: FC<ReviewProps> = ({
  name,
  date,
  rate,
  message,
  className,
}) => (
  <div
    className={clsx(
      "flex w-full flex-col gap-3 rounded-3xl bg-white p-4",
      className
    )}
  >
    <div className="relative flex w-full flex-row items-center gap-3">
      <div className="h-10 w-10 rounded-full bg-gray-0" />
      <div className="flex flex-col">
        <p className="m-0 p-0 text-Regular16">{name}</p>
        <Rate
          className="text-Regular12"
          disabled
          allowHalf
          defaultValue={rate}
        />
      </div>
      <div className="absolute right-0">
        <p className="m-0 p-0 text-Regular12 text-gray-secondary">{date}</p>
      </div>
    </div>
    <p className="m-0 p-0 text-Regular14">{message}</p>
  </div>
);
