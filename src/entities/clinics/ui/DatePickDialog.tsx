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
  Dialog,
  DividerSaunet,
  Island,
  SegmentedControl,
} from "@/shared/components";

export const DatePickDialog = ({
  // onSubmit=console.log(23),
  // handleBack,
  // onCalendarChange,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  datePickDialogOpen,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  setDatePickDialogOpen,
  onDateSelected,
}) => {
  const t = useTranslations("Common");
  const tMob = useTranslations("Mobile.My");
  const router = useRouter();
  const { handleSubmit, control, watch, setValue } =
    useForm<AppointmentTimeAndFormat>();

  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);

  const handleApplyDate = () => {
    if (selectedDate) {
      const formattedDate = selectedDate.format("YYYY-MM-DD");
      setSelectedDates((prevDates) => [...prevDates, formattedDate]);
      onDateSelected([...selectedDates, formattedDate]);
      setSelectedDate(null);
    }
    setDatePickDialogOpen(false);
  };
  // const handleOnSubmit = useCallback(() => {
  //   handleSubmit(onSubmit)();
  // }, [handleSubmit, onSubmit]);

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

  return (
    <Dialog
      isOpen={datePickDialogOpen}
      setIsOpen={setDatePickDialogOpen}
      className="flex flex-col !p-0"
    >
      <div className="overflow-hidden">
        <Island className="rounded-b-none px-4 !pt-4">
          <div className="flex items-center justify-between">
            <div
              className="flex cursor-pointer rounded-2xl bg-gray-2 px-5 py-2 text-Bold20"
              //   onClick={handleBack}
            >
              <ArrowLeftOutlined />
            </div>
            <div className="text-Bold16">Фильтр</div>
            <div className="text-Regular14 text-red">Сбросить</div>
          </div>

          <Controller
            control={control}
            defaultValue={new Date()}
            render={({ field }) => (
              <Calendar
                className="mt-2"
                onChange={(date) => {
                  setSelectedDate(dayjs(date));
                }}
                // onChange={() => {
                //   console.log(2312321);
                // }}
                //   bookDates={bookingDates}
              />
            )}
            name="date"
          />
          <DividerSaunet className="my-3" />
          <Button
            variant="primary"
            className="w-full"
            // onClick={handleOnSubmit}
            onClick={handleApplyDate} // Используйте выделенную функцию
          >
            Применить
          </Button>
        </Island>
      </div>
    </Dialog>
  );
};
