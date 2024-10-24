import type { FC } from "react";
import { useCallback, useMemo, useState } from "react";
import { useMutation, useQuery } from "react-query";

import { Spin, notification } from "antd";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";

import type {
  AppointmentTimeAndFormat,
  RescheduleConsultationSlotModel,
} from "@/entities/appointments";
import { AppointmentChooseTimeFormat } from "@/entities/appointments";
import { appointmentBookingApi } from "@/shared/api/appointmentBooking";
import { bookingInfoApi } from "@/shared/api/bookingInfo";
import { Button, CloseIcon, Dialog } from "@/shared/components";
import { timeFormat } from "@/shared/config";
import { changeTimeFormat } from "@/shared/utils";

import type { DoctorBookingRescheduleDialogProps } from "../models/DoctorBookingRescheduleDialogProps";

export const DoctorBookingRescheduleDialog: FC<DoctorBookingRescheduleDialogProps> =
  ({
    isDoctor,
    consultationId,
    doctorProfileId,
    clinicId,
    transferPenalty,
    isConfirmationDialogOpen,
    setIsConfirmationDialogOpen,
    isRescheduleDialogOpen,
    setIsRescheduleDialogOpen,
    onRescheduleSubmit,
  }) => {
    const t = useTranslations("Common");
    const tMob = useTranslations("Mobile.Booking");
    const [api, contextHolder] = notification.useNotification();
    const [selectedDate, setSelectedDate] = useState<string>(
      dayjs().format("YYYY-MM-DD")
    );

    const {
      data: bookingSlots,
      isLoading: isBookingSlotsLoading,
      isError: isBookingSlotsError,
    } = useQuery(
      ["getBookingSlots", selectedDate],
      () =>
        bookingInfoApi.getDoctorAvailableSlots(
          doctorProfileId,
          selectedDate,
          clinicId
        ),
      {
        enabled: !!doctorProfileId && !!clinicId,
      }
    );

    const getTimeRange = useCallback(
      (appointmentTimeAndFormat: AppointmentTimeAndFormat) => {
        const { date, time } = appointmentTimeAndFormat ?? {};

        return changeTimeFormat(date, time);
      },
      []
    );

    const { mutate: rescheduleConsultationSlot } = useMutation(
      ["rescheduleConsultationSlot"],
      (data: RescheduleConsultationSlotModel) =>
        appointmentBookingApi.rescheduleConsultationSlot(data).catch((err) => {
          const errorMessage = err?.response?.data?.errorMessage ?? "";

          api["error"]({
            message: t("RequestErrorOccurred"),
            description:
              errorMessage === "already reserved"
                ? t("SelectedTimeIsAlreadyTaken")
                : t("TryAgainLater"),
            duration: 3,
            placement: "bottomRight",
          });
        })
    );

    const onCalendarSubmit = useCallback(
      (appointmentTimeAndFormat: AppointmentTimeAndFormat) => {
        const [fromTime, toTime] = getTimeRange(appointmentTimeAndFormat);
        rescheduleConsultationSlot({
          id: consultationId,
          consultationStatus: "MOVED",
          fromTime,
          toTime,
        });
        setIsRescheduleDialogOpen(false);
        onRescheduleSubmit();
      },
      [
        consultationId,
        getTimeRange,
        onRescheduleSubmit,
        rescheduleConsultationSlot,
        setIsRescheduleDialogOpen,
      ]
    );

    const renderedConfirmationDialogContent = useMemo(() => {
      if (isBookingSlotsLoading) {
        return (
          <div className="flex h-full w-full items-center justify-center">
            <Spin size="large" />
          </div>
        );
      }

      if (!isBookingSlotsError) { // NEWTODO: remove ! after test
        return (
          <div className="flex h-full w-full items-center justify-center">
            {t("ErrorHasOccurred")}
          </div>
        );
      }

      return (
        <>
          <div className="mb-4 flex items-center justify-between">
            <div className="text-Bold20">
              {tMob("YouSureYouWantTransferAppointmentQuestion")}
            </div>
            <div
              className="flex w-1/4 justify-end"
              onClick={() => setIsConfirmationDialogOpen(false)}
              onKeyDown={() => setIsConfirmationDialogOpen(false)}
            >
              <CloseIcon />
            </div>
          </div>
          {transferPenalty > 0 && !isDoctor && (
            <p className="text-Regular16">
              {tMob("WeWillRefundYouHalfCostOfConsultation", {
                transferPenalty,
              })}
            </p>
          )}

          <Button
            className="my-4"
            variant="secondary"
            block
            onClick={() => {
              setIsConfirmationDialogOpen(false);
              setIsRescheduleDialogOpen(true);
            }}
          >
            {t("Confirm")}
          </Button>

          <Button
            variant="tertiary"
            block
            onClick={() => setIsConfirmationDialogOpen(false)}
          >
            {t("Cancel")}
          </Button>
        </>
      );
    }, [
      isBookingSlotsError,
      isBookingSlotsLoading,
      isDoctor,
      setIsConfirmationDialogOpen,
      setIsRescheduleDialogOpen,
      t,
      tMob,
      transferPenalty,
    ]);

    const calendarAppointmentChips = useMemo(
      () =>
        (bookingSlots?.data ?? [])?.map((bookingSlot) => ({
          isBooked: !!bookingSlot?.id,
          toTime: dayjs(bookingSlot?.toTime)?.format(timeFormat),
          fromTime: dayjs(bookingSlot?.fromTime)?.format(timeFormat),
        })),
      [bookingSlots?.data]
    );

    return (
      <>
        {contextHolder}
        <Dialog
          isOpen={isConfirmationDialogOpen}
          setIsOpen={setIsConfirmationDialogOpen}
        >
          {renderedConfirmationDialogContent}
        </Dialog>

        <Dialog
          isOpen={isRescheduleDialogOpen}
          setIsOpen={setIsRescheduleDialogOpen}
          className="!p-0"
        >
          <AppointmentChooseTimeFormat
            withConsultationTypeTabs={false}
            onCalendarChange={(date) => setSelectedDate(date)}
            onSubmit={(data) => onCalendarSubmit(data)}
            appointmentChips={calendarAppointmentChips}
            handleBack={() => setIsRescheduleDialogOpen(false)}
            doctorProfileId={doctorProfileId}
            clinicId={clinicId}
          />
        </Dialog>
      </>
    );
  };
