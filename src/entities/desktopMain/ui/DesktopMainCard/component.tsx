import type { FC } from "react";

import clsx from "clsx";

import type { DesktopMainCardProps } from "@/entities/desktopMain";
import { ArrowUpIcon } from "@/shared/components";

export const DesktopMainCard: FC<DesktopMainCardProps> = ({
  title,
  value,
  status,
  percentage,
  icon,
  path,
  onClick,
}) => (
  <div
    className={clsx(
      "flex h-[102px] w-[294px] flex-col gap-4 rounded-[20px] bg-white p-5 shadow-md",
      {
        "cursor-pointer": path,
      }
    )}
    onClick={() => onClick?.(path)}
  >
    <div className="flex flex-row items-center justify-between">
      <p className="m-0 p-0 text-Regular16">{title}</p>
      <span className="flex flex-row items-center justify-center">
        {percentage && (
          <>
            <ArrowUpIcon
              size="sm"
              color={status ? "positiveStatus" : "red"}
              rotate={status ? 0 : 180}
            />
            <p
              className={clsx("m-0 ml-1 p-0 text-Medium16", {
                "text-brand-darkGreen": status,
                "text-red": !status,
              })}
            >
              {percentage}
            </p>
          </>
        )}
      </span>
    </div>
    <span className="flex flex-row">
      <p className="m-0 mr-1 p-0 text-Bold20">{value}</p>
      {icon && icon}
    </span>
  </div>
);
