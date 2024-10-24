import type { FC } from "react";

import { Badge as Antdbadge } from "antd";
import clsx from "clsx";

import type { BadgeProps } from "./props";

export const Badge: FC<BadgeProps> = ({
  text,
  style,
  className,
  type = "positive",
  ...rest
}: BadgeProps) => (
  <Antdbadge
    className={className}
    style={style}
    count={
      <div
        className={clsx(
          {
            "bg-lightPositive text-positiveStatus": type === "positive",
            "bg-lightWarning text-warningStatus": type === "warning",
            "bg-lightNeutral text-neutralStatus": type === "neutral",
            "bg-red text-white": type === "red",
          },
          "!top-1 flex min-w-6 items-center justify-center rounded-3xl text-Bold11",
          className
        )}
      >
        {text}
      </div>
    }
    {...rest}
  />
);
