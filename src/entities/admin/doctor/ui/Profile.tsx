import type { FC } from "react";
import { Fragment } from "react";

import { Divider } from "antd";
import { useTranslations } from "next-intl";

import type { DoctorProfile as DoctorProfileType } from "@/entities/clinics";
import { DegreesEnum } from "@/entities/clinics";
import { Button, EditIcon, TrashBucketIcon } from "@/shared/components";

enum BookingTypeLabel {
  "AWAY" = "HouseCall2",
  "OFFLINE" = "ClinicAdmission",
  "ONLINE" = "OnlineConsultation2",
}

export const DoctorProfile: FC<{ data: DoctorProfileType }> = ({ data }) => {
  const t = useTranslations("Common");
  const tDesktop = useTranslations("Desktop.Admin");
  return (
    <div className="flex w-full flex-col gap-3">
      <p className="m-0 p-0 text-Bold20">{t("Contacts")}</p>
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-col">
          <p className="m-0 text-Regular12 text-gray-secondary">
            {tDesktop("DoctorPhoneNumber")}
          </p>
          {data?.phoneNumber && (
            <p className="m-0 mt-1 text-Regular16">{data.phoneNumber}</p>
          )}
          {data?.contacts?.map((tel) => (
            <p key={tel.phoneNumber} className="m-0 mt-1 text-Regular16">
              {tel.phoneNumber ?? t("Absent")}
            </p>
          ))}
        </div>
        <div className="flex flex-row gap-3">
          <EditIcon width={18} height={18} color="colorPrimaryBase" />
          <TrashBucketIcon width={18} height={18} color="red" />
        </div>
      </div>
      <Divider className="mt-0" />
      <p className="m-0 p-0 text-Bold20">{t("PlaceOfWork")}</p>
      {data?.clinicInfos?.map(
        ({ clinicId, cityName, street, name, buildNumber }) => (
          <div
            key={clinicId}
            className="flex flex-row items-center justify-between"
          >
            <div className="flex flex-col">
              <p className="m-0 text-Regular12 text-gray-secondary">
                {t("Clinic")}
              </p>
              <p className="m-0 mt-1 text-Regular16">{name}</p>
              <p className="m-0 text-Regular12 text-gray-secondary">
                {cityName && cityName + ", "}
                {street} {buildNumber}
              </p>
            </div>
          </div>
        )
      )}
      <Divider className="mt-0" />
      <p className="m-0 p-0 text-Bold20">{t("Specialization")}</p>
      <div className="flex flex-row items-center justify-between gap-2">
        <div className="flex flex-row">
          {data?.specialityNames?.map((spec) => (
            <span key={spec} className="rounded-xl bg-purple-1 px-3 py-1">
              <p className="m-0 p-0 text-Regular12 text-purple-0">{spec}</p>
            </span>
          ))}
        </div>
        <div className="flex flex-row gap-3">
          <EditIcon width={18} height={18} color="colorPrimaryBase" />
        </div>
      </div>
      <p className="m-0 mt-3 p-0 text-Bold20">{t("Services")}</p>
      <div>
        {data?.servicePrices?.map((service) => (
          <Fragment key={service.consultationType}>
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-col">
                <p className="m-0 mt-1 text-Regular16">
                  {t(
                    BookingTypeLabel[
                      service.consultationType as keyof typeof BookingTypeLabel
                    ]
                  )}
                </p>
                <p className="m-0 text-Regular12 text-gray-secondary">
                  {t("FirstConsultation")} {service.firstPrice} ₸,{" "}
                  {t("Repeated")} {service.secondPrice} ₸
                </p>
              </div>
            </div>
            <Divider className="mt-0" />
          </Fragment>
        ))}
      </div>
      <p className="m-0 p-0 text-Bold20 ">{t("Education")}</p>
      {data?.studyDegrees?.map((study) => (
        <Fragment key={study.id}>
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-col">
              <p className="m-0 text-Regular12 text-gray-secondary">
                {DegreesEnum[study?.degree as keyof typeof DegreesEnum]}
              </p>
              <p className="m-0 mt-1 text-Regular16">{study.name}</p>
              <p className="m-0 text-Regular12 text-gray-secondary">
                {study.yearStart} - {study.yearEnd}
              </p>
            </div>
            <div className="flex flex-row gap-3">
              <EditIcon color="colorPrimaryBase" width={18} height={18} />
              <TrashBucketIcon width={18} height={18} color="red" />
            </div>
          </div>
          <Divider className="mt-0" />
        </Fragment>
      ))}
      <Button className="!my-3 !h-10">{t("ChangePassword")}</Button>
    </div>
  );
};
