import type { FC } from "react";
import { useCallback, useMemo, useState } from "react";
import type { ControllerRenderProps } from "react-hook-form";
import { useForm, Controller } from "react-hook-form";
import { useQuery } from "react-query";

import { ArrowLeftOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import type {
  AppointmentChooseTimeFormatProps,
  AppointmentFormat,
  AppointmentTimeAndFormat,
} from "@/entities/appointments";
import { bookingInfoApi } from "@/shared/api/bookingInfo";
import type { BookDatesModel } from "@/shared/components";
import {
  Button,
  Calendar,
  Chips,
  Island,
  SegmentedControl,
} from "@/shared/components";

// Фейковые данные для временных слотов
interface FakeAppointmentsData {
  [day: number]: { slotCount: number; freeStatus: boolean };
}

const fakeAppointmentsPerDay: FakeAppointmentsData = {
  1: { slotCount: 5, freeStatus: true },
  2: { slotCount: 0, freeStatus: false },
  3: { slotCount: 3, freeStatus: true },
  4: { slotCount: 4, freeStatus: true },
  5: { slotCount: 0, freeStatus: false },
  6: { slotCount: 2, freeStatus: true },
  7: { slotCount: 6, freeStatus: true },
  8: { slotCount: 3, freeStatus: true },
  9: { slotCount: 1, freeStatus: true },
  10: { slotCount: 0, freeStatus: false },
};

const fakeAppointmentChips = [
  { fromTime: "Сейчас", isBooked: false },
  { fromTime: "10:30", isBooked: true },
  { fromTime: "11:00", isBooked: false },
  { fromTime: "11:30", isBooked: true },
  { fromTime: "12:00", isBooked: false },
  { fromTime: "12:30", isBooked: false },
  { fromTime: "13:00", isBooked: true },
  { fromTime: "13:30", isBooked: false },
  { fromTime: "14:00", isBooked: true },
  { fromTime: "14:30", isBooked: false },
  { fromTime: "15:00", isBooked: false },
  { fromTime: "15:30", isBooked: true },
  { fromTime: "16:00", isBooked: false },
  { fromTime: "16:30", isBooked: true },
  { fromTime: "17:00", isBooked: false },
  // Добавьте больше данных при необходимости
];

export const AppointmentChooseTimeFormat: FC<AppointmentChooseTimeFormatProps> =
  ({
    onSubmit,
    handleBack,
    appointmentChips,
    onCalendarChange,
    onlineDisabled,
    defaultSegmentValue,
    withConsultationTypeTabs = true,
    doctorProfileId = "",
    clinicId = "",
  }) => {
    const t = useTranslations("Common");
    const tMob = useTranslations("Mobile.My");
    const router = useRouter();
    const { handleSubmit, control, watch, setValue } =
      useForm<AppointmentTimeAndFormat>();
    const handleOnSubmit = useCallback(() => {
      handleSubmit(onSubmit)();
    }, [handleSubmit, onSubmit]);

    const [activeDate, setActiveDate] = useState<Dayjs>(dayjs());

    const { data: appointmentsPerDay } = useQuery(
      ["calendarAppointments", activeDate],
      () => Promise.resolve({ data: fakeAppointmentsPerDay }),

        // bookingInfoApi
        //   .getDoctorAvailableCalendarSlots(
        //     String(router.query.doctorId ?? doctorProfileId),
        //     activeDate.month() + 1,
        //     activeDate.year(),
        //     String(router.query.clinicId ?? clinicId)
        //   )
        //   ?.then((res) => res.data),
      {
        enabled:
          Boolean(router.query.doctorId ?? doctorProfileId) &&
          Boolean(router.query.clinicId ?? clinicId),
      }
    );

    // const bookingDates = useMemo(() => {
    //   const bookingDates: BookDatesModel[] = [];
    //   for (const day in appointmentsPerDay) {
    //     const dayNumber = parseInt(day);
    //     bookingDates.push({
    //         books: appointment.slotCount,
    //         day: `${activeDate.format("MM")} ${day}`,
    //         freeStatus: appointment.freeStatus,
    //       });
    //     }
    //   }
    //   return bookingDates;
    // }, [activeDate, appointmentsPerDay]);

    const bookingDates = useMemo(() => {
      const bookingDates: BookDatesModel[] = [];
      if (appointmentsPerDay) {
        for (const day in appointmentsPerDay.data) {
          const dayNumber = parseInt(day, 10);
          const appointment = appointmentsPerDay.data[dayNumber];
          bookingDates.push({
            books: appointment.slotCount,
            day: `${activeDate.format("MM")} ${day}`,
            freeStatus: appointment.freeStatus,
          });
        }
      }
      return bookingDates;
    }, [activeDate, appointmentsPerDay]);

    const time = watch("time");

    // const appointmentChipsRender = useCallback(
    //   (field: ControllerRenderProps<AppointmentTimeAndFormat, "time">) =>
    //     (appointmentChips?.length ?? 0) > 0 ? (
    //       <Chips
    //         chipLabels={
    //           appointmentChips?.map((appointmentChip) => ({
    //             label: appointmentChip?.fromTime,
    //             isDisabled: appointmentChip?.isBooked,
    //           })) ?? []
    //         }
    //         type="single"
    //         isCarousel={false}
    //         onChange={(val) => {
    //           field.onChange(val?.[0]);
    //         }}
    //         className="grid grid-cols-4"
    //       />
    //     ) : (
    //       <div className="my-4 text-Semibold20">
    //         {tMob("ServiceDoesNotAppearOnThisDay")}
    //       </div>
    //     ),
    //   [appointmentChips, tMob]
    // );

    const appointmentChipsRender = useCallback(
      (field: ControllerRenderProps<AppointmentTimeAndFormat, "time">) =>
        (fakeAppointmentChips.length > 0) ? (
          <Chips
            chipLabels={fakeAppointmentChips.map((appointmentChip) => ({
              label: appointmentChip.fromTime,
              isDisabled: appointmentChip.isBooked,
            }))}
            type="single"
            isCarousel={false}
            onChange={(val) => {
              field.onChange(val?.[0]);
            }}
            className="grid grid-cols-5"
          />
        ) : (
          <div className="my-4 text-Semibold20">
            {tMob("ServiceDoesNotAppearOnThisDay")}
          </div>
        ),
      [tMob]
    );

    return (
      <div className="h-3/4 bg-gray-0">
        <div className="overflow-hidden">
          <Island className="px-4 !pt-4">
            <div className="mb-4 flex items-center justify-start">
              <div
                className="flex cursor-pointer rounded-2xl bg-gray-2 px-5 py-2 text-Bold20"
                onClick={handleBack}
              >
                <ArrowLeftOutlined />
              </div>
              <div className="ml-14 text-Bold16">{t("TimeOfTaking")}</div>
            </div>
            {withConsultationTypeTabs && (
              <Controller
                control={control}
                name="format"
                defaultValue={
                  (defaultSegmentValue as AppointmentFormat) ?? "online"
                }
                render={({ field }) => (
                  <SegmentedControl
                    value={field.value}
                    size="l"
                    options={[
                      ...(onlineDisabled
                        ? []
                        : [{ label: t("Online"), value: "online" }]),
                      { label: t("InHospital"), value: "hospital" },
                      { label: t("AtHome"), value: "home" },
                    ]}
                    onChange={(val) => {
                      field.onChange(val);
                    }}
                  />
                )}
              />
            )}
            <Controller
              control={control}
              defaultValue={new Date()}
              render={({ field }) => (
                <Calendar
                  className="mt-2 shadow-cardCarousel"
                  onChange={(time) => {
                    onCalendarChange?.(dayjs(time).format("YYYY-MM-DD"));
                    field.onChange(time.toDate());
                    setActiveDate(time);
                    setValue("time", "");
                  }}
                  bookDates={bookingDates}
                />
              )}
              name="date"
            />
          </Island>
          <Island className="rounded-b-none my-2 px-4 pb-0.5">
            <div className="text-Bold20">{t("TimeOfTaking")}</div>
            <div className="mt-1 text-Regular14">
              {t("TheDurationOfTheConsultationIsTwentyMinutes")}
            </div>
            <div>
              <Controller
                control={control}
                render={({ field }) => appointmentChipsRender(field)}
                name="time"
              />
            </div>
          </Island>
        </div>
        <div className="sticky bg-white p-4">
          <Button
            variant="secondary"
            className="w-full"
            onClick={handleOnSubmit}
            disabled={!time}
          >
            {t("Select")}
          </Button>
        </div>
      </div>
    );
  };
