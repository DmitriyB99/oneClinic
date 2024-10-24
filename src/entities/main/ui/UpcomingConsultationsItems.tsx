import type { FC } from "react";

import { SplideSlide } from "@splidejs/react-splide";
import dayjs from "dayjs";

import type { UpcomingConsultationsItemsModel } from "@/entities/main";
import { Island, Avatar, Button } from "@/shared/components";
import { dateFormat, timeFormat } from "@/shared/config";

function getMinutesDifference(targetTime) {
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

export const UpcomingConsultationsItems: FC<UpcomingConsultationsItemsModel> =
  ({ consultation, router, parseConsultationType }) => {
    const minutesRemaining = getMinutesDifference(consultation?.from_time);
    const parsedConsultationType = parseConsultationType(
      consultation?.doctor_service_type || consultation?.clinic_service_type
    );

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
      ANALYSIS: {
        title: consultation?.clinic?.name,
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

    const displayData =
      consultationDisplay[
        consultation?.doctor_service_type || consultation?.clinic_service_type
      ];

    return (
      <SplideSlide key={consultation?.id} className="mb-4 ml-3 mt-3 !w-[327px]">
        <Island isCard className="flex h-full flex-col !px-4">
          <div className="flex flex-wrap items-center justify-start text-Regular12">
            {consultation?.status === "CREATED" && (
              <div className="mb-1 mr-2 flex items-center rounded-3xl bg-crimson px-2 py-1 text-Regular12 text-white">
                Подтвердите запись
              </div>
            )}
            <div className="mb-1 mr-2 flex items-center rounded-3xl bg-lightNeutral px-2 py-1">
              {parsedConsultationType?.icon}
              <div className="ml-1">{parsedConsultationType?.text}</div>
            </div>
            {minutesRemaining > 0 && minutesRemaining < 15 && (
              <div className="mb-1 mr-2 flex items-center rounded-3xl bg-lightWarning px-2 py-1">
                <div className="text-red">
                  ⏰ Через {minutesRemaining} минут
                </div>
              </div>
            )}
          </div>
          {(consultation?.doctor_service_type ||
            consultation?.clinic_service_type) !== "ANALYSIS" && (
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center justify-start">
                <Avatar
                  isSquare={true}
                  size="avatar"
                  src={consultation?.doctor?.photo_url}
                />
                <div className="ml-3 flex flex-col">
                  <div className="mb-1 text-Regular16">
                    {consultation?.doctor?.first_name}{" "}
                    {consultation?.doctor?.last_name}
                  </div>
                  <div className="text-Regular12 text-secondaryText">
                    {(consultation?.doctor?.specialities &&
                      consultation?.doctor?.specialities[0]) ??
                      ""}
                  </div>
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
          )}

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
            {consultation?.clinic_service_type === "ANALYSIS" && (
              <div className="text-Regular12 text-secondaryText">
                {getCurrentDay(consultation?.from_time)}
              </div>
            )}
          </div>
          {consultation?.status === "CREATED" ? (
            <Button
              className="my-4 mt-auto"
              size="s"
              variant="secondary"
              block
              onClick={() =>
                router.push({
                  pathname: `/booking/${consultation?.id}`,
                  query: {
                    service_type: consultation?.service_type,
                  },
                })
              }
            >
              <div className="text-Bold14 text-red">Детали записи</div>
            </Button>
          ) : (
            <Button className="my-4 mt-auto" size="s" variant="secondary" block>
              <div className="text-Bold14 text-red">Подтвердите запись</div>
            </Button>
          )}
        </Island>
      </SplideSlide>
    );
  };
