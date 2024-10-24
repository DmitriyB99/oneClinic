import type { FC } from "react";
import { useQuery } from "react-query";

import clsx from "clsx";
import { useTranslations } from "next-intl";

import { superAdminApis } from "@/shared/api";

import type { PatientsCardProps } from "./props";

export const PatientsCard: FC<PatientsCardProps> = ({
  className,
  doctorProfileId,
  isPatient,
}) => {
  const t = useTranslations("Common");
  const { data: doctorInfoShort } = useQuery(
    ["getProfiles", doctorProfileId],
    () =>
      superAdminApis
        .getDoctorProfileInfoById(doctorProfileId ?? "")
        .then((res) => res.data),
    { keepPreviousData: true }
  );

  return doctorInfoShort ? (
    <div
      className={clsx("flex w-full gap-3 rounded-3xl bg-white p-5", className)}
    >
      <div className="h-10 w-10 rounded-md bg-gray-0">
        {doctorInfoShort?.photoUrl && (
          <img className="w-full" src={doctorInfoShort.photoUrl} alt="img" />
        )}
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          <div className="flex w-fit gap-2">
            {doctorInfoShort?.specialityNames?.map((item: string) => (
              <span
                key={item}
                className="w-fit rounded-xl bg-purple-1 px-3 py-1"
              >
                <p className="m-0 p-0 text-Regular12 text-purple-0">{item}</p>
              </span>
            ))}
          </div>
          <p className="m-0 text-Regular16">
            {doctorInfoShort?.lastName} {doctorInfoShort?.firstName}{" "}
            {doctorInfoShort?.fatherName}
          </p>
          <p className="m-0 text-Regular12 text-gray-secondary">
            {doctorInfoShort?.contacts?.[0]?.phoneNumber}
          </p>
          <p className="m-0 text-Regular12 text-gray-secondary">
            {isPatient ? t("Patient") : t("Doctor")}
          </p>
        </div>
      </div>
    </div>
  ) : (
    <p>loading...</p>
  );
};
