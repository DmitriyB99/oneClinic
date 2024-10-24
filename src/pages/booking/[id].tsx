import type { ReactElement } from "react";
import { useCallback, useMemo, useState } from "react";
import { useMutation, useQuery } from "react-query";

import { notification } from "antd";
import dayjs from "dayjs";
import type { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import type { RescheduleConsultationSlotModel } from "@/entities/appointments";
import { DoctorBookingRescheduleDialog } from "@/entities/myDoctorPatients";
import { appointmentBookingApi } from "@/shared/api/appointmentBooking";
import { patientBookingsApi } from "@/shared/api/patientContent/bookings";
import { Button } from "@/shared/components";
import { CONSULTATION_STATUS } from "@/shared/constants";
import { MainLayout } from "@/shared/layout";
import { BookingInfo } from "@/widgets/booking";

export default function BookingPage() {
  const t = useTranslations("Common");
  const tMob = useTranslations("Mobile.Booking");
  const [api, contextHolder] = notification.useNotification();
  const router = useRouter();
  const { id, service_type } = router.query;

  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    useState<boolean>(false);

  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] =
    useState<boolean>(false);

  const [isRescheduledConsultation, setIsRescheduledConsultation] =
    useState<boolean>(false);

  const [isConsultationUpdated, setIsConsultationUpdated] =
    useState<boolean>(false);

  const {
    data: consultationData,
    isLoading: isConsultationDataLoading,
    isError: isConsultationDataError,
  } = useQuery(
    ["getConsultationById", isRescheduledConsultation],
    () =>
      patientBookingsApi
        .getBookingById(id as string, service_type as string)
        .then((res) => {
          setIsRescheduledConsultation(false);
          return res.data;
        }),
    {
      enabled: !!id && !!service_type,
    }
  );

  const isNotConfirmedConsultation = useMemo(
    () =>
      consultationData?.status === CONSULTATION_STATUS.NOT_CONFIRMED ||
      consultationData?.status === CONSULTATION_STATUS.MOVED_NOT_CONFIRMED,
    [consultationData?.status]
  );

  const { mutate: updateConsultationSlot } = useMutation(
    ["updateConsultationSlot"],
    (data: RescheduleConsultationSlotModel) =>
      appointmentBookingApi.rescheduleConsultationSlot(data).then(() => {
        displayRescheduleNotification(
          data.consultationStatus as CONSULTATION_STATUS
        );
      }),
    {
      onSuccess: () => {
        setIsConsultationUpdated(true);
        setTimeout(() => {
          router.push("/");
        }, 1500);
      },
      onError: () => {
        api["error"]({
          message: t("RequestErrorOccurred"),
          duration: 3,
          placement: "bottomRight",
        });
      },
    }
  );

  const displayRescheduleNotification = useCallback(
    (consultationStatus: CONSULTATION_STATUS) => {
      let statusMessage = "";

      switch (consultationStatus) {
        case CONSULTATION_STATUS.CANCELED:
          statusMessage = t("RegistrationCanceled");
          break;
        case CONSULTATION_STATUS.CREATED:
          statusMessage = t("AppointmentConfirmed");
          break;
        case CONSULTATION_STATUS.MOVED_NOT_CONFIRMED:
          statusMessage = t("EntryMoved");
          break;
        default:
          statusMessage = t("AppointmentConfirmed");
      }

      api["success"]({
        message: statusMessage,
        duration: 1.5,
        placement: "bottomRight",
      });
    },
    [api, t]
  );

  const doctorProfileId = useMemo(
    () => consultationData?.doctor?.id ?? "",
    [consultationData?.doctor?.id]
  );
  const clinicId = useMemo(
    () => consultationData?.clinic?.id ?? "",
    [consultationData?.clinic?.id]
  );

  const transferPenalty = useMemo(() => {
    if (!consultationData?.price || !consultationData?.from_time) {
      return 0;
    }

    const now = dayjs();
    const consultationDate = dayjs(consultationData.from_time);
    const diffInHours = consultationDate.diff(now, "hour");

    if (diffInHours < 24) {
      return consultationData.price / 2;
    }

    return 0;
  }, [consultationData?.from_time, consultationData?.price]);

  return (
    <div>
      {contextHolder}
      <BookingInfo
        isDoctor={false}
        shouldDisplayMainButtons={!isConsultationUpdated}
        consultationData={consultationData}
        isConsultationLoading={isConsultationDataLoading}
        isConsultationError={isConsultationDataError}
        onRescheduleClick={() => setIsConfirmationDialogOpen(true)}
        onCancelClick={() => {
          updateConsultationSlot({
            id: String(router.query.id),
            consultationStatus: CONSULTATION_STATUS.CANCELED,
          });
        }}
        AdditionalButton={
          isNotConfirmedConsultation ? (
            <Button
              block
              onClick={() => {
                updateConsultationSlot({
                  id: String(router.query.id),
                  consultationStatus: CONSULTATION_STATUS.CREATED,
                });
              }}
            >
              {t("ConfirmConsultation")}
            </Button>
          ) : consultationData?.doctor_service_type === "ONLINE" ? (
            <Button block onClick={() => router.push(`/chat/1`)}>
              {t("StartConsultation")}
            </Button>
          ) : (
            <Button block onClick={() => router.push(`/oneQr`)}>
              {t("StartConsultation")}
            </Button>
          )
        }
        DescriptionElement={
          isNotConfirmedConsultation ? (
            <div className="mr-2 mt-4 inline-block rounded-3xl bg-lightWarning px-2 py-1 text-Regular12">
              {t("ConfirmAppointment")}
            </div>
          ) : (
            <p className="mb-0 text-center text-Regular14">
              {tMob("WeWillRemindAboutAppointmentInAdvance")}
            </p>
          )
        }
      />

      <DoctorBookingRescheduleDialog
        isDoctor={false}
        transferPenalty={transferPenalty}
        doctorProfileId={doctorProfileId}
        clinicId={clinicId}
        consultationId={String(router.query.id)}
        isConfirmationDialogOpen={isConfirmationDialogOpen}
        setIsConfirmationDialogOpen={setIsConfirmationDialogOpen}
        isRescheduleDialogOpen={isRescheduleDialogOpen}
        setIsRescheduleDialogOpen={setIsRescheduleDialogOpen}
        onRescheduleSubmit={() => {
          setIsRescheduledConsultation(true);
          setIsConsultationUpdated(true);
        }}
      />
    </div>
  );
}

BookingPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout hideToolbar>{page}</MainLayout>;
};

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../../messages/${locale}.json`)).default,
    },
  };
}

export const getStaticPaths = () => ({
  paths: [],
  fallback: true,
});
