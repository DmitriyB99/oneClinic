import type { ReactElement } from "react";
import { useCallback, useMemo } from "react";
import { useMutation, useQuery } from "react-query";

import { Spin, notification } from "antd";
import dayjs from "dayjs";
import type { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import type { RescheduleConsultationSlotModel } from "@/entities/appointments";
import { chatApi } from "@/shared/api";
import { appointmentBookingApi } from "@/shared/api/appointmentBooking";
import { Avatar, Island, Button } from "@/shared/components";
import { shortDayDateFormat, timeFormat } from "@/shared/config";
import { CONSULTATION_STATUS } from "@/shared/constants";
import { DesktopLayout } from "@/shared/layout";

export default function PatientBookingPage() {
  // TODO: temporarily disabling this functionality for MVP
  // const [consultationAvailable, setConsultationAvailable] = useState(false);
  const router = useRouter();
  const [api, contextHolder] = notification.useNotification();
  const t = useTranslations("Common");
  const tDesktop = useTranslations("Desktop.Bookings");
  const { data: consultationData } = useQuery(["getConsultationData"], () =>
    appointmentBookingApi
      .getConsultationSlotById(router.query.id as string)
      .then(({ data }) => ({
        toTime: data.toTime,
        name: data.reservedFullname,
        clinic: data.clinicInfo?.name,
        address: t("CityAndStreetPoint", {
          cityName: data.clinicInfo?.cityName,
          street: data.clinicInfo?.street,
          buildNumber: data.clinicInfo?.buildNumber,
        }),
        price: data.price,
        treatmentDirectionInfo: data.treatmentDirectionInfo,
        patientId: data.reservedUserId,
      }))
  );

  const consultationTime = useMemo(() => {
    const time = dayjs(consultationData?.toTime);
    // const timeDifference = time.diff(dayjs(), "minutes");
    // const isWithin10Minutes = timeDifference <= 10 && timeDifference >= 0;
    // setConsultationAvailable(isWithin10Minutes);

    return `${time.format(shortDayDateFormat)} в ${time.format(timeFormat)}`;
  }, [consultationData]);

  const { mutate: updateConsultationSlot } = useMutation(
    ["updateConsultationSlot"],
    (data: RescheduleConsultationSlotModel) =>
      appointmentBookingApi.rescheduleConsultationSlot(data),
    {
      onSuccess: () => {
        api["success"]({
          message: t("RegistrationCanceled"),
          duration: 3,
          placement: "bottomRight",
        });
      },
      onError: () => {
        api["error"]({
          message: tDesktop("ErrorOccurredWhileCancelRecordTryAgainLater"),
          duration: 3,
          placement: "bottomRight",
        });
      },
    }
  );

  const { mutate: createChatRoom, isLoading: isLoadingNewConsultation } =
    useMutation(
      ["createRoomId", consultationData],
      () =>
        chatApi.createChat({ patientId: consultationData?.patientId ?? "" }),
      {
        retry: false,
        onSuccess: (res) => {
          router.push(`/chat/${res.data?.id}`);
        },
        onError: () => {
          api["error"]({
            message: tDesktop("ErrorOccurredWhileCreateChatTryAgainLater"),
            duration: 3,
            placement: "bottomRight",
          });
        },
      }
    );

  const startConsultation = useCallback(() => {
    createChatRoom();
  }, [createChatRoom]);

  if (isLoadingNewConsultation) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="w-full px-6">
      {contextHolder}
      <div className="my-4 text-secondaryText">
        <span>{t("Main")}</span> / <span>{t("MyBookings")}</span> /{" "}
        <span className="text-black">
          {tDesktop("EntryNumber", { number: router.query.id as string })}
        </span>
      </div>
      <div className="flex flex-col items-center p-6">
        <div>
          <Avatar size="clinicAva" />
          <div className="my-6">
            <div className="text-Bold24">
              {t("ClientHasAppointmentAtClinic")}
            </div>
            <div className="mt-3 text-Regular16 text-secondaryText">
              {consultationTime}
            </div>
          </div>
          <h3 className="mb-5 text-Bold20 text-dark">
            {t("AboutAppointment2")}
          </h3>
          <Island className="rounded-xl px-4 py-3">
            <div className="text-Regular12 text-secondaryText">
              {t("Patient")}
            </div>
            <div className="mt-1 text-Regular16 text-blue">
              {consultationData?.name}
            </div>
          </Island>
          <Island className="mt-3 rounded-xl px-4 py-3">
            <div className="text-Regular12 text-secondaryText">
              {t("Clinic")}
            </div>
            <div className="mt-1 text-Regular16 text-blue">
              {consultationData?.clinic}
            </div>
          </Island>
          <Island className="mt-3 rounded-xl px-4 py-3">
            <div className="text-Regular12 text-secondaryText">
              {t("Address")}
            </div>
            <div className="mt-1 text-Regular16">
              {consultationData?.address}
            </div>
          </Island>
          <Island className="mt-3 rounded-xl px-4 py-3">
            <div className="text-Regular12 text-secondaryText">
              {t("CostOfServicesFirstAppointment")}
            </div>
            <div className="mt-1 text-Regular16">{consultationData?.price}</div>
          </Island>
          {consultationData?.treatmentDirectionInfo && (
            <>
              <h3 className="mb-5 mt-6 text-Bold20 text-dark">
                {t("Direction")}
              </h3>
              <Island className="mt-3 rounded-xl px-4 py-3">
                <div className="text-Regular12 text-secondaryText">
                  25 мая 14:32
                </div>
                <div className="mt-1 text-Regular16">
                  Терапевт → Отоларинголог
                </div>
                <div className="text-Regular12 text-secondaryText">
                  от Савченко В.И., Saunet Clinic
                </div>
              </Island>
            </>
          )}
          <div className="mt-9 flex gap-3">
            <Button
              className="!h-10 rounded-lg px-4"
              onClick={() => startConsultation()}
            >
              {t("StartСonsultation")}
            </Button>
            <Button
              className="!h-10 rounded-lg bg-white px-4"
              variant="outline"
            >
              {t("TransferAppointment")}
            </Button>
            <Button
              className="!h-10 rounded-lg !border px-4"
              variant="outline"
              outlineDanger
              onClick={() => {
                updateConsultationSlot({
                  id: String(router.query.id),
                  consultationStatus: CONSULTATION_STATUS.CANCELED,
                });
              }}
            >
              {t("CancelEntry")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

PatientBookingPage.getLayout = function getLayout(page: ReactElement) {
  return <DesktopLayout hideSidebar={false}>{page}</DesktopLayout>;
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
