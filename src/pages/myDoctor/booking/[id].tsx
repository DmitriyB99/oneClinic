import type { FC, ReactElement } from "react";
import { useCallback, useMemo, useState } from "react";
import { useMutation, useQuery } from "react-query";

import { notification } from "antd";
import type { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import type { RescheduleConsultationSlotModel } from "@/entities/appointments";
import { DoctorBookingRescheduleDialog } from "@/entities/myDoctorPatients";
import { ConsultationQrDialog } from "@/features/mainDoctor";
import { chatApi } from "@/shared/api";
import { appointmentBookingApi } from "@/shared/api/appointmentBooking";
import { qrApi } from "@/shared/api/qr";
import { Button, SpinnerWithBackdrop } from "@/shared/components";
import { CONSULTATION_STATUS, CONSULTATION_TYPE } from "@/shared/constants";
import { BookingInfo } from "@/widgets/booking";
import { MainLayout } from "@/shared/layout";
import { doctorBookingsApi } from "@/shared/api/doctor/bookings";

export default function DoctorBookingPage() {
  const t = useTranslations("Common");
  const tMob = useTranslations("Mobile");
  const [api, contextHolder] = notification.useNotification();
  const router = useRouter();

  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    useState<boolean>(false);

  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] =
    useState<boolean>(false);

  const [isRescheduledConsultation, setIsRescheduledConsultation] =
    useState<boolean>(false);

  const [isConsultationUpdated, setIsConsultationUpdated] =
    useState<boolean>(false);

  const [patientChatId, setPatientChatId] = useState<string | null>(null);

  const [shouldQrCodeBeGenerated, setShouldQrCodeBeGenerated] = useState(false);
  const [isQrCodeDialogOpen, setIsQrCodeDialogOpen] = useState(false);

  // const fakeConsultationSlot = {
  //   clinicInfo: {
  //     buildNumber: "123",
  //     clinicId: "clinic-001",
  //     name: "Downtown Clinic",
  //     street: "Main St",
  //     cityName: "Metropolis",
  //   },
  //   bookingConsultationSlotId: "slot-12345",
  //   consultationStatus: "confirmed",
  //   consultationType: "general",
  //   created: "2024-08-22T08:00:00Z",
  //   currency: "USD",
  //   doctorFullname: "Dr. John Doe",
  //   doctorProfileId: "doctor-56789",
  //   fromTime: "2024-08-23T10:00:00Z",
  //   id: "consultation-001",
  //   isInDirection: true,
  //   modified: "2024-08-22T09:00:00Z",
  //   patientFullName: "Jane Smith",
  //   price: "150",
  //   reservedFullname: "Jane Smith",
  //   reservedPhoneNumber: "+1234567890",
  //   reservedUserId: "user-123",
  //   toTime: "2024-08-23T11:00:00Z",
  //   treatmentDirectionInfo: {
  //     categoryName: "General Health",
  //     created: "2024-08-22T07:00:00Z",
  //     doctorFullname: "Dr. John Doe",
  //   },
  //   medicalPrescriptionInfo: {
  //     diagnosis: "Bacterial Infection",
  //     medications: [
  //       {
  //         dose: "500mg",
  //         doseType: "tablet",
  //         durationDays: 7,
  //         frequency: "twice a day",
  //         name: "Amoxicillin",
  //       },
  //     ],
  //     patientComplaints: "Fever and sore throat",
  //     recommendations: "Take with food",
  //   },
  // };

  // const fakeBookingInfoProps = {
  //   isDoctor: true,
  //   shouldDisplayMainButtons: true,
  //   consultationData: fakeConsultationSlot,
  //   isConsultationLoading: false,
  //   isConsultationError: false,
  //   onRescheduleClick: () => console.log("Reschedule clicked"),
  //   onCancelClick: () => console.log("Cancel clicked"),
  //   AdditionalButton: <button>Start Consultation</button>,
  //   DescriptionElement: <p>We will remind you about the appointment in advance.</p>,
  // };
  
  // const fakeDoctorBookingRescheduleDialogProps = {
  //   isDoctor: true,
  //   transferPenalty: 50,
  //   doctorProfileId: fakeConsultationSlot.doctorProfileId,
  //   clinicId: fakeConsultationSlot.clinicInfo.clinicId,
  //   consultationId: fakeConsultationSlot.bookingConsultationSlotId,
  //   isConfirmationDialogOpen: false,
  //   setIsConfirmationDialogOpen: (open: boolean) => console.log(`Confirmation dialog open: ${open}`),
  //   isRescheduleDialogOpen: false,
  //   setIsRescheduleDialogOpen: (open: boolean) => console.log(`Reschedule dialog open: ${open}`),
  //   onRescheduleSubmit: () => console.log("Reschedule submitted"),
  // };

  const {
    data: consultationData,
    isLoading: isConsultationDataLoading,
    isError: isConsultationDataError,
  } = useQuery(
    ["getBookingById", isRescheduledConsultation, isQrCodeDialogOpen],
    () =>
      doctorBookingsApi
        .getBookingById(router.query.id as string)
        .then((res) => {
          setIsRescheduledConsultation(false);
          return res.data;
        }),
    {
      enabled: !isQrCodeDialogOpen,
    }
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

  const {
    mutate: updateOnlineConsultationStatus,
    isLoading: isLoadingNewConsultationStatus,
  } = useMutation(
    ["updateOnlineConsultationStatus", patientChatId],
    () =>
      chatApi.updateOnlineConsultationStatus(
        consultationData?.bookingConsultationSlotId ?? ""
      ),
    {
      onSuccess: () => {
        router.push(`/chat/${patientChatId}`);
      },
      onError: () => {
        api["error"]({
          message: tMob("Chat.ErrorOccurredWhileCreatingChatDotTryLater"),
          duration: 3,
          placement: "bottomRight",
        });
      },
    }
  );

  const {
    mutate: createOnlineConsultationChat,
    isLoading: isChatInitiationLoading,
  } = useMutation(
    ["createOnlineConsultationChatId", consultationData?.reservedUserId],
    () =>
      chatApi.createChat({ patientId: consultationData?.reservedUserId ?? "" }),
    {
      retry: false,
      onSuccess: (res) => {
        setPatientChatId(res.data?.id);
        // TODO: убрать setTimeOut после MVP, придумать как апдейтнуть state до вызова функции
        setTimeout(() => {
          updateOnlineConsultationStatus();
        }, 100);
      },
      onError: () => {
        api["error"]({
          message: tMob("Chat.ErrorOccurredWhileCreatingChatDotTryLater"),
          duration: 3,
          placement: "bottomRight",
        });
      },
    }
  );

  const { data: generatedQrData } = useQuery(
    ["generateConsultationQr"],
    () =>
      qrApi
        .generateQrForConsultation(
          consultationData?.bookingConsultationSlotId ?? ""
        )
        .then((res) => res.data),
    {
      enabled:
        shouldQrCodeBeGenerated &&
        !!consultationData?.bookingConsultationSlotId,
    }
  );

  const displayRescheduleNotification = useCallback(
    (consultationStatus: CONSULTATION_STATUS) => {
      let statusMessage = "";

      switch (consultationStatus) {
        case CONSULTATION_STATUS.CANCELED:
          statusMessage = t("RegistrationCanceled");
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

  // const isConsultationAvailable = useMemo(() => { Закомментить для MVP
  //   const time = dayjs(consultationData?.toTime);
  //   const timeDifference = Math.abs(time.diff(dayjs(), "minutes"));
  //   const isWithin10Minutes = timeDifference <= 10;

  //   return isWithin10Minutes;
  // }, [consultationData?.toTime]);

  const doctorProfileId = useMemo(
    () => consultationData?.doctorProfileId ?? "",
    [consultationData?.doctorProfileId]
  );
  const clinicId = useMemo(
    () => consultationData?.clinicInfo?.clinicId ?? "",
    [consultationData?.clinicInfo?.clinicId]
  );
  const isConsultationEnded = useMemo(
    () => consultationData?.consultationStatus === CONSULTATION_STATUS.DONE,
    [consultationData?.consultationStatus]
  );

  const startConsultationByType = useCallback(
    (consultationType: CONSULTATION_TYPE) => {
      if (consultationType === CONSULTATION_TYPE.ONLINE) {
        createOnlineConsultationChat();
        return;
      }

      setShouldQrCodeBeGenerated(true);
      setIsQrCodeDialogOpen(true);
    },
    [createOnlineConsultationChat]
  );

  const renderedAdditionalButton = useMemo(() => {
    const consultType =
      (consultationData?.consultationType as CONSULTATION_TYPE) ??
      CONSULTATION_TYPE.ONLINE;

    if (consultationData?.consultationStatus === CONSULTATION_STATUS.DONE) {
      return (
        <Button block onClick={() => router.back()}>
          {t("EndConsultation")}
        </Button>
      );
    }

    return (
      <Button block onClick={() => startConsultationByType(consultType)}>
        {t("StartConsultation")}
      </Button>
    );
  }, [
    consultationData?.consultationStatus,
    consultationData?.consultationType,
    router,
    startConsultationByType,
    t,
  ]);

  const renderedDescriptionElement = useMemo(() => {
    if (consultationData?.consultationStatus === CONSULTATION_STATUS.CANCELED) {
      return (
        <p className="mb-0 text-center text-Regular14">
          {t("RegistrationCanceled")}
        </p>
      );
    }

    if (consultationData?.consultationStatus === CONSULTATION_STATUS.DONE) {
      return (
        <p className="mb-0 text-center text-Regular14">
          {tMob("Booking.ConsultationStarted")}
        </p>
      );
    }

    return (
      <p className="mb-0 text-center text-Regular14">
        {tMob("Booking.WeWillRemindAboutAppointmentInAdvance")}
      </p>
    );
  }, [consultationData?.consultationStatus, t, tMob]);

  return (
    <div>
      {contextHolder}
      {(isLoadingNewConsultationStatus || isChatInitiationLoading) && (
        <SpinnerWithBackdrop text={tMob("Chat.CreateChatThreeDots")} />
      )}
      <BookingInfo
        isDoctor
        shouldDisplayMainButtons={
          !isConsultationUpdated && !isConsultationEnded
        }
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
        AdditionalButton={renderedAdditionalButton}
        DescriptionElement={renderedDescriptionElement}
      />

      <DoctorBookingRescheduleDialog
        isDoctor
        transferPenalty={0}
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

      <ConsultationQrDialog
        isOpen={isQrCodeDialogOpen}
        setIsOpen={setIsQrCodeDialogOpen}
        qrData={String(generatedQrData ?? "")}
      />
    </div>
  );
};

DoctorBookingPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <MainLayout hideToolbar>
      <div className="bg-gray">{page}</div>
    </MainLayout>
  );
};

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../../../messages/${locale}.json`)).default,
    },
  };
}

export const getStaticPaths = () => ({
  paths: [],
  fallback: true,
});
