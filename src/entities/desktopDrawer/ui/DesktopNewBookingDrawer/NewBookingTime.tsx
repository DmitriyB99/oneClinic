import type { FC } from "react";
import { useCallback, useMemo, useState } from "react";
import { Controller } from "react-hook-form";
import type { ControllerRenderProps } from "react-hook-form";
import { useQuery } from "react-query";

import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import { useTranslations } from "next-intl";

import type {
  NewDesktopBookingModel,
  NewBookingTimeProps,
} from "@/entities/desktopDrawer";
import { bookingInfoApi } from "@/shared/api/bookingInfo";
import type { BookDatesModel } from "@/shared/components";
import { Calendar, Chips } from "@/shared/components";

export const NewBookingTime: FC<NewBookingTimeProps> = ({
  time,
  control,
  onCalendarChange,
  appointmentChips,
  doctorProfileId,
}) => {
  const [activeDate, setActiveDate] = useState<Dayjs>(dayjs());
  const t = useTranslations("Common");
  const tDesktop = useTranslations("Desktop.Bookings");

  const { data: appointmentsPerDay } = useQuery(
    ["calendarAppointments", activeDate],
    () =>
      bookingInfoApi
        .getDoctorAvailableCalendarSlots(
          doctorProfileId,
          activeDate.month() + 1,
          activeDate.year()
        )
        ?.then((res) => res.data)
  );

  const bookingDates = useMemo(() => {
    const bookingDates: BookDatesModel[] = [];
    for (const day in appointmentsPerDay) {
      const dayNumber = parseInt(day);
      bookingDates.push({
        books: appointmentsPerDay?.[dayNumber].slotCount,
        day: `${activeDate.format("MM")} ${day}`,
        freeStatus: appointmentsPerDay?.[dayNumber].freeStatus,
      });
    }
    return bookingDates;
  }, [activeDate, appointmentsPerDay]);

  const appointmentChipsRender = useCallback(
    (field: ControllerRenderProps<NewDesktopBookingModel, "time">) =>
      (appointmentChips?.length ?? 0) > 0 ? (
        <Chips
          chipLabels={
            appointmentChips?.map((appointmentChip) => ({
              label: appointmentChip?.fromTime,
              isDisabled: appointmentChip?.isBooked,
            })) ?? []
          }
          type="single"
          isCarousel={false}
          onChange={(val) => {
            field.onChange(val?.[0]);
          }}
          className="grid grid-cols-4"
        />
      ) : (
        <div className="my-4 text-Semibold20">
          {tDesktop("ServiceNotProvidedThisDay")}
        </div>
      ),
    [appointmentChips, tDesktop]
  );
  return (
    <>
      <Controller
        control={control}
        defaultValue={new Date()}
        render={({ field }) => (
          <Calendar
            onChange={(time) => {
              onCalendarChange?.(dayjs(time).format("YYYY-MM-DD"));
              field.onChange(time.toDate());
              setActiveDate(time);
            }}
            bookDates={bookingDates}
            className="mt-6 shadow-cardCarousel"
          />
        )}
        name="date"
      />
      <h3 className="mt-10 text-Bold20 text-dark">{t("TimeOfTaking")}</h3>
      <div className="mt-1 text-Regular14">
        {t("TheDurationOfTheConsultationIsTwentyMinutes")}
      </div>
      <div>
        <Controller
          control={control}
          rules={{ required: tDesktop("SelectRecordTime") }}
          defaultValue={time}
          render={({ field }) => appointmentChipsRender(field)}
          name="time"
        />
      </div>
    </>
  );
};
