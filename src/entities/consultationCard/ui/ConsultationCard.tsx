import { useCallback, type FC } from "react";

import clsx from "clsx";

import { AidKit, Avatar, Heartbeat, Island, OnlineMeeting } from "@/shared/components";

import type { ConsultationCardModel } from "../models/ConsultationCardModel";
import { DoctorConsultationTypeEnum } from "@/widgets/auth";
import { ConsultationType, ParseConsultationTypes } from "@/entities/main";
import { useTranslations } from "next-intl";
import { ConsultationStatus } from "@/entities/myProfile/models/myBookingsModel";
import { CONSULTATION_STATUS } from "@/shared/constants";
import { getMinutesDifference } from "@/entities/mainDoctor/ui/upcomingDoctorsConsultations";

function formatMinutesToTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(remainingMinutes).padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}`;
}

export const ConsultationCard: FC<ConsultationCardModel> = ({
  name,
  type,
  serviceType,
  time,
  date,
  imageUrl,
  onClick,
  status,
  fromTime
}) => {
  const t = useTranslations("Common");
  const tDesktop = useTranslations("Desktop.Bookings");
  const minutesRemaining = getMinutesDifference(fromTime);

  const parseConsultationType = useCallback(
    (type: string): ConsultationType => {
      switch (type) {
        case DoctorConsultationTypeEnum.OFFLINE:
          return {
            text: t("ClinicAdmission") as ParseConsultationTypes,
            icon: <Heartbeat size="sm" />,
          };
        case DoctorConsultationTypeEnum.AWAY:
          return {
            text: tDesktop("DoctorCallAtHome") as ParseConsultationTypes,
            icon: <AidKit size="sm" color="black" />,
          };
        case DoctorConsultationTypeEnum.CUSTOM:
          return {
            text: t("ClinicAdmission") as ParseConsultationTypes,
            icon: <Heartbeat size="sm" />
          };
        default:
          return {
            text: t("OnlineConsultation2") as ParseConsultationTypes,
            icon: <OnlineMeeting size="sm" />,
          };
      }
    },
    [t, tDesktop]
  );

  const parseConsultationStatus = useCallback(
    (status): { text: string; color: string; textColor: string; } => {
      const statusColors = {
        [CONSULTATION_STATUS.ACTIVE]: {text: `Идет консультация ${formatMinutesToTime(minutesRemaining)}`, color: "lightNeutral", textColor: "neutralStatus"},
        [CONSULTATION_STATUS.CANCELED]: { text: "Отменена", color: "red", textColor: "white"},
        [CONSULTATION_STATUS.DONE]: {text: "Завершена", color: "lightPositive", textColor: "positiveStatus"},
      };

      if (statusColors[status]) {
        return statusColors[status];
      }

      if (minutesRemaining > 0 && minutesRemaining < 15) {
        return {
          text: `⏰ Через ${minutesRemaining} минут`,
          color: "lightWarning",
          textColor: "red",
        };
      }
      return null
    },
    [minutesRemaining]
  );

  const parsedConsultationType = parseConsultationType(serviceType);
  const parsedConsultationStatus = parseConsultationStatus(status);

  return (
  <Island isCard className="mt-4 !px-4" onClick={onClick}>
    <div className="flex">
      <div className="flex items-center justify-start text-Regular12">
        <div className="mr-2 flex items-center rounded-3xl px-2 py-1 bg-lightNeutral">
          {parsedConsultationType.icon}
          <div className="ml-1.5">{parsedConsultationType.text}</div>
        </div>
      </div>
      {parsedConsultationStatus && (
        <div className="flex items-center justify-start text-Regular12">
          <div className={clsx("mr-2 flex items-center rounded-3xl px-2 py-1",
            {
              "bg-lightNeutral":
                parsedConsultationStatus.color === "lightNeutral",
              "bg-red": parsedConsultationStatus.color === "red",
              "bg-lightPositive":
                parsedConsultationStatus.color === "lightPositive",
              "bg-lightWarning":
                parsedConsultationStatus.color === "lightWarning",
            }
          )}>
            <div className={clsx(
            {
              "text-neutralStatus":
                parsedConsultationStatus.textColor === "neutralStatus",
              "text-red": parsedConsultationStatus.textColor === "red",
              "text-positiveStatus":
                parsedConsultationStatus.textColor === "positiveStatus",
              "text-white":
                parsedConsultationStatus.textColor === "white",
            }
          )}>{parsedConsultationStatus.text}</div>
          </div>
        </div>
      )}
    </div>
    <div className="mt-3 flex items-center justify-between">
      <div className="flex items-center justify-start">
        <div className="w-10">
          <Avatar size={40} style={{ borderRadius: "12px" }} src={imageUrl} />
        </div>
        <div className="ml-3 flex flex-col">
          <div className="mb-1 text-Regular16">{name}</div>
          <div className="text-Regular12 text-secondaryText">{type}</div>
        </div>
      </div>
      <div className="flex w-20 flex-col items-end">
        <div className="text-Regular16">{time}</div>
        <div className="mt-1 text-Regular12 text-secondaryText">{date}</div>
      </div>
    </div>
  </Island>
)};
