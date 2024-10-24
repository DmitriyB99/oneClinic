import { useCallback } from "react";
import type { FC } from "react";

import clsx from "clsx";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";

import type { DesktopMainSubCardProps } from "@/entities/desktopMain";
import {
  EditIcon,
  Heartbeat,
  OnlineMeeting,
  TrashBucketIcon,
} from "@/shared/components";
import { dateFormat, timeFormat } from "@/shared/config";

export const DesktopMainSubCard: FC<DesktopMainSubCardProps> = ({
  name,
  time,
  notifications,
  onClick,
  className,
  doctorName,
  expanded,
  isTransaction,
  type,
  paymentStatus,
}) => {
  const t = useTranslations("Common");
  const tDesktop = useTranslations("Desktop.DesktopMain");

  const parseConsultationType = useCallback(
    (type?: string) => {
      switch (type) {
        case "OFFLINE":
          return tDesktop("inHospital");
        case "AWAY":
          return tDesktop("AtHome");
        default:
          return tDesktop("Online");
      }
    },
    [tDesktop]
  );

  return (
    <div
      onClick={onClick}
      className={clsx(
        "flex h-[102px] w-[294px] flex-col gap-4 rounded-[20px] bg-white p-3 shadow-md",
        className
      )}
    >
      <div className="relative flex flex-row items-center gap-1">
        <div className="flex rounded-xl bg-lightWarning px-2 py-1">
          <Heartbeat size="sm" />
          <p className="m-0 p-0 pl-1 text-Regular12">
            {tDesktop("Reception", {
              type: parseConsultationType(notifications),
            })}
          </p>
        </div>
        {type && (
          <div
            className={clsx(
              "mr-2 flex items-center rounded-3xl bg-lightNeutral px-2 py-1"
            )}
          >
            <OnlineMeeting color="brand-icon" size="sm" />
            <div className="ml-1.5 text-Regular12">{type}</div>
          </div>
        )}
        {expanded && (
          <div className="absolute right-2 flex flex-row gap-3">
            <EditIcon color="colorPrimaryBase" width={18} height={18} />
            <TrashBucketIcon width={18} height={18} color="red" />
          </div>
        )}
        {isTransaction && (
          <div className="absolute right-2 flex flex-row gap-3">
            <p
              className={clsx("m-0 p-0", {
                "text-green": paymentStatus === "SUCCESS",
                "text-red": paymentStatus === "FAILED",
              })}
            >
              3 000 ₸
            </p>
          </div>
        )}
      </div>
      <span className="flex w-full flex-row">
        <div className="h-[35px] w-10 rounded-md bg-gray-6" />
        <div className="ml-2 flex w-full flex-col">
          <span className="flex flex-row items-center justify-between">
            <p className="m-0 w-44 truncate p-0 text-Bold16">{name}</p>
            <p className="m-0 p-0 text-Bold16">
              {dayjs(time).format(timeFormat)}
            </p>
          </span>
          <span className="flex flex-row items-center justify-between">
            <p className="m-0 p-0 text-Regular12 text-secondaryText">
              {doctorName ?? t("Patient")}
            </p>
            <p className="m-0 p-0 text-Regular12 text-secondaryText">
              {dayjs(time).format(dateFormat)}
            </p>
          </span>
        </div>
      </span>
    </div>
  );
};
