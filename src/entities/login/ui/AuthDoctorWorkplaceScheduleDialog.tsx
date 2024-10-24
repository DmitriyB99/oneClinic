import type { FC } from "react";
import { useCallback, useEffect, useState } from "react";

import dayjs from "dayjs";
import { useTranslations } from "next-intl";

import type {
  AuthDoctorWorkplaceScheduleDialogModel,
  DaysListType,
  Weekday,
  WorkplaceModel,
} from "@/entities/login";
import { AuthDoctorDayListRender, WeekdayEnum } from "@/entities/login";
import { Button, DefaultCell, Dialog, Island } from "@/shared/components";
import { timeFormat } from "@/shared/config";
import { convertToDateWithOffsetByTime } from "@/shared/utils";

const days: Weekday[] = Object.keys(WeekdayEnum) as Weekday[];
export const AuthDoctorWorkplaceScheduleDialog: FC<AuthDoctorWorkplaceScheduleDialogModel> =
  ({
    openWorkplaceScheduleDialog,
    setOpenWorkplaceScheduleDialog,
    activeWorkplace,
    workHereButton = false,
    onWorkPeriodChanged,
  }) => {
    const tMob = useTranslations("Mobile.Login");
    const t = useTranslations("Common");

    const [daysList, setDaysList] = useState<DaysListType[]>([]);

    useEffect(() => {
      if (activeWorkplace) {
        setDaysList(
          days.map((day, index) => {
            const currentDaySchedule = activeWorkplace?.workPeriods?.find(
              (someDay) => WeekdayEnum[day] === someDay.day
            );

            const isStartTimeInRightFormat =
              !!currentDaySchedule?.startTime &&
              currentDaySchedule.startTime.length <= 5;

            const isEndTimeInRightFormat =
              !!currentDaySchedule?.startTime &&
              currentDaySchedule.startTime.length <= 5;

            return {
              day,
              id: index,
              isChecked: !!currentDaySchedule?.day,
              startTime: isStartTimeInRightFormat
                ? currentDaySchedule.startTime
                : dayjs(currentDaySchedule?.startTime).format(timeFormat),
              endTime: isEndTimeInRightFormat
                ? currentDaySchedule.endTime
                : dayjs(currentDaySchedule?.endTime).format(timeFormat),
            };
          })
        );
      }
    }, [activeWorkplace]);

    const handleContinueClick = useCallback(() => {
      const daysSchedule =
        daysList
          .filter((day) => day.isChecked)
          .map((day) => {
            const [hStart, mStart] = day.startTime.split(":");
            const formattedStartTime = convertToDateWithOffsetByTime(
              parseInt(hStart),
              parseInt(mStart)
            );

            const [hEnd, mEnd] = day.endTime.split(":");
            const formattedEndTime = convertToDateWithOffsetByTime(
              parseInt(hEnd),
              parseInt(mEnd)
            );

            return {
              day: WeekdayEnum[day.day],
              startTime: formattedStartTime,
              endTime: formattedEndTime,
            };
          }) ?? [];

      if (activeWorkplace) {
        const updatedWorkPlace: WorkplaceModel = {
          ...activeWorkplace,
          checked: true,
          workPeriods: daysSchedule,
        };

        onWorkPeriodChanged?.(updatedWorkPlace);
      }

      setDaysList(
        days.map((day, index) => ({
          day,
          id: index,
          isChecked: false,
          startTime: "10:00",
          endTime: "18:00",
        }))
      );
      setOpenWorkplaceScheduleDialog(false);
    }, [
      activeWorkplace,
      daysList,
      onWorkPeriodChanged,
      setOpenWorkplaceScheduleDialog,
    ]);

    const onCheckboxChange = useCallback(
      (id?: number) => {
        setDaysList(
          daysList.map((item) =>
            item.id === id
              ? {
                  ...item,
                  isChecked: !item.isChecked,
                }
              : item
          )
        );
      },
      [daysList]
    );
    return (
      <Dialog
        isOpen={openWorkplaceScheduleDialog}
        setIsOpen={setOpenWorkplaceScheduleDialog}
        className="h-9/10 !bg-gray-2 !p-0"
        darkenBackground={workHereButton}
      >
        <div className="bg-white p-4 text-Bold24">
          {tMob("PleaseIndicateYourWorkScheduleIn")} {activeWorkplace?.name}{" "}
          {activeWorkplace?.address ? `(${activeWorkplace.address})` : ""}
        </div>
        <Island className="!p-0">
          {daysList.map(({ day, id, isChecked, startTime, endTime }) => (
            <DefaultCell
              key={id}
              checked={isChecked}
              title={<div className="ml-3">{day}</div>}
              onCheckboxChange={() => {
                onCheckboxChange(id);
              }}
              hideMainIcon
              rightElement={
                <AuthDoctorDayListRender
                  endTime={endTime}
                  id={id ?? 0}
                  isChecked={isChecked}
                  setDaysList={setDaysList}
                  startTime={startTime}
                />
              }
            />
          ))}
        </Island>
        <div className="absolute bottom-0 flex w-full justify-between bg-white p-4">
          {workHereButton && (
            <Button
              variant="tertiary"
              className="w-full text-red"
              onClick={() => {
                setOpenWorkplaceScheduleDialog(false);
              }}
            >
              {tMob("IDontWorkHere")}
            </Button>
          )}
          <Button
            variant="primary"
            className="w-full"
            onClick={handleContinueClick}
          >
            {t("Continue")}
          </Button>
        </div>
      </Dialog>
    );
  };
