import { useCallback } from "react";
import { useRouter } from "next/router";

import { SplideSlide } from "@splidejs/react-splide";
import clsx from "clsx";
import dayjs from "dayjs";

import type { ConsultationStatus } from "@/entities/myProfile/models/myBookingsModel";
import { Island, Avatar, Button } from "@/shared/components";
import { dateFormat, timeFormat } from "@/shared/config";
import { CONSULTATION_STATUS } from "@/shared/constants";

export function getMinutesDifference(targetTime) {
  const currentTime = new Date().getTime();
  const targetDate = new Date(targetTime).getTime();
  const differenceInMillis = targetDate - currentTime;
  const minutes = Math.floor(differenceInMillis / (1000 * 60));

  return minutes;
}

function getCurrentDay(date) {
  const currentDate = new Date();
  const givenDate = new Date(date);

  currentDate.setHours(0, 0, 0, 0);
  givenDate.setHours(0, 0, 0, 0);

  if (currentDate.getTime() === givenDate.getTime()) {
    return "Сегодня";
  }
  return dayjs(givenDate).format(dateFormat);
}

export const UpcomingDoctorsConsultations = ({
  consultation,
  parseConsultationType,
}) => {
  const minutesRemaining = getMinutesDifference(consultation?.from_time);
  const parsedConsultationType = parseConsultationType(
    consultation?.consultation_type
  );
  const router = useRouter();

  const consultationDisplay = {
    ONLINE: {
      title: "OneClinic",
      address: null,
      avatar: "oneClinicAvatar.png",
    },
    AWAY: {
      title: `ул. ${consultation?.address?.street} ${
        consultation?.address?.build_number
      }${
        consultation?.address?.floor
          ? `, ${consultation?.address?.floor} этаж`
          : ""
      }${
        consultation?.address?.apartment
          ? `, кв. ${consultation?.address?.apartment}`
          : ""
      }`,
      address: "Адрес вызова",
      avatar: "greenDefaultAvatar.png",
    },
    OFFLINE: {
      title: consultation?.clinic?.name,
      header: "OneClinic",
      address: `ул. ${consultation?.address?.street} ${
        consultation?.address?.build_number
      }${
        consultation?.address?.floor
          ? `, ${consultation?.address?.floor} этаж`
          : ""
      }${
        consultation?.address?.apartment
          ? `, кв. ${consultation?.address?.apartment}`
          : ""
      }`,
      avatar: consultation?.clinic?.icon_url,
    },
  };

  const parseConsultationStatus = useCallback(
    (type: ConsultationStatus): { text: string; color: string } => {
      const statusColors = {
        [CONSULTATION_STATUS.ACTIVE]: {
          text: "Идет консультация",
          color: "lightNeutral",
        },
        [CONSULTATION_STATUS.CANCELED]: { text: "Отменена", color: "red" },
        [CONSULTATION_STATUS.DONE]: {
          text: "Завершена",
          color: "lightPositive",
        },
      };

      if (statusColors[type]) {
        return statusColors[type];
      }

      if (minutesRemaining > 0 && minutesRemaining < 15) {
        return {
          text: `⏰ Через ${minutesRemaining} минут`,
          color: "lightWarning",
        };
      }
      return { text: null, color: "" };
    },
    [minutesRemaining]
  );

  const parsedConsultationStatus = parseConsultationStatus(
    consultation?.status
  );
  // console.log('parsedConsultationStatus')
  // console.log(consultation)
  const displayData = consultationDisplay[consultation?.consultation_type];

  return (
    <SplideSlide key={consultation?.id} className="mb-4 ml-3 mt-3 !w-[327px]">
      <Island isCard className="flex h-full flex-col !px-4">
        <div className="flex flex-wrap items-center justify-start text-Regular12">
          <div className="mb-1 mr-2 flex items-center rounded-3xl bg-lightNeutral px-2 py-1">
            {parsedConsultationType?.icon}
            <div className="ml-1">{parsedConsultationType?.text}</div>
          </div>

          {parsedConsultationStatus && (
            <div
              className={clsx(
                "mb-1 mr-2 flex items-center rounded-3xl px-2 py-1",
                {
                  "bg-lightNeutral":
                    parsedConsultationStatus.color === "lightNeutral",
                  "bg-red": parsedConsultationStatus.color === "red",
                  "bg-lightPositive":
                    parsedConsultationStatus.color === "lightPositive",
                  "bg-lightWarning":
                    parsedConsultationStatus.color === "lightWarning",
                }
              )}
            >
              <div className="text-red">{parsedConsultationStatus.text}</div>
            </div>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center justify-start">
            <Avatar
              isSquare={true}
              size="avatar"
              src={consultation?.patient?.photo_url}
            />
            <div className="ml-3 flex flex-col">
              <div className="mb-1 text-Regular16">
                {consultation?.patient?.name} {consultation?.patient?.surname}
              </div>
              <div className="text-Regular12 text-secondaryText">Пациент</div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="text-right text-Regular16">
              {dayjs(consultation?.from_time).format(timeFormat)}
            </div>
            <div className="text-Regular12 text-secondaryText">
              {getCurrentDay(consultation?.from_time)}
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between py-2">
          <div className="flex items-center justify-start">
            <Avatar size="avatar" src={displayData.avatar} />
            <div className="ml-3 flex flex-col">
              <div className="mb-1 max-w-[240px] truncate text-Regular16">
                {displayData.title}
              </div>
              <div className="max-w-[240px] truncate text-Regular12 text-secondaryText">
                {displayData.address || "Онлайн-клиника"}
              </div>
            </div>
          </div>
        </div>

        <Button
          className="my-4 mt-auto"
          size="s"
          variant="secondary"
          block
          onClick={() =>
            router.push({
              pathname: `/myDoctor/booking/${consultation?.id}`,
            })
          }
        >
          <div className="text-Bold14 text-red">Детали записи</div>
        </Button>
      </Island>
    </SplideSlide>
  );
};
