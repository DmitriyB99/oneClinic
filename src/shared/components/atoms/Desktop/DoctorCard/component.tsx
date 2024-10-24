import type { FC } from "react";

import clsx from "clsx";

import type { DoctorCardProps } from "./props";

export const DoctorCard: FC<DoctorCardProps> = ({
  className,
  userId,
  userProfileId,
  fullname,
  phoneNumber,
}) => (
  <div
    className={clsx("flex w-full gap-3 rounded-3xl bg-white p-5", className)}
  >
    <div className="h-10 w-10 rounded-md bg-gray-0" />
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-1">
        <p className="m-0 text-Regular16">{fullname}</p>
        <p className="m-0 text-Regular12 text-gray-secondary">{phoneNumber}</p>
        <p className="m-0 text-Regular12 text-gray-secondary">Пациент</p>
      </div>
    </div>
  </div>
);
