import type { FC } from "react";
import { useCallback, useEffect, useMemo } from "react";
import { useQuery } from "react-query";

import { Spin } from "antd";
import clsx from "clsx";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { medicalCardApi } from "@/shared/api/medicalCard";
import { patientProfileApi } from "@/shared/api/patient/profile";
import { Avatar, Button, Island } from "@/shared/components";
import { dateTimeFormatWithMinutes } from "@/shared/config";

import type { ServiceHistoryItem, ServicesHistoryPageProps } from "./props";

enum Statuses {
  active = "ACTIVE",
  created = "DONE",
}

export const ServicesHistoryPage: FC<ServicesHistoryPageProps> = ({
  setServicesHistoryTabVisible,
}) => {
  const t = useTranslations("Common");
  const tMob = useTranslations("Mobile.MedicalCard");
  const router = useRouter();

  const { data: myProfileData, isLoading: isProfileLoading } = useQuery(
    ["getMyProfile"],
    () => patientProfileApi?.getMyProfile()
  );

  const handleServiceHistoryItemClick = useCallback(
    (serviceType?: ServiceHistoryItem["bookingType"], id?: string) => {
      if (serviceType === "MEDICAL_TEST") {
        return router.push(`/medicalCard/analysis/${id}`);
      }
      return router.push(`/medicalCard/appointment/${id}`);
    },
    [router]
  );

  const { data: myServiceHistory, isLoading: isHistoryLoading } = useQuery(
    ["getMyServicesHistory"],
    () =>
      medicalCardApi.getServiceHistory({
        patient_id: myProfileData?.data?.id,
        offset: 0,
        limit: 10,
      }),
    {
      enabled: !!myProfileData?.data?.id,
    }
  );

  const myServiceHistoryData = useMemo(
    () => myServiceHistory?.data ?? [],
    [myServiceHistory]
  );
  
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    if (myServiceHistoryData?.total !== 0) {
      setServicesHistoryTabVisible(true);
    }
  }, [myServiceHistoryData, setServicesHistoryTabVisible]);

  const serviceStatus = useCallback(
    (serviceHistory: ServiceHistoryItem) => {
      if (serviceHistory.bookingType === "CONSULTATION") {
        return serviceHistory.consultationStatus === Statuses.active
          ? t("Ready")
          : t("InProgress");
      }
      return serviceHistory.consultationStatus === Statuses.active
        ? t("Ready")
        : `Запись на ${dayjs(serviceHistory.fromTime).format("DD MMMM HH:mm")}`;
    },
    [t]
  );

  if (isProfileLoading || isHistoryLoading) {
    return (
      <div className="flex h-fit w-full items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="overflow-auto bg-gray-0">
      {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore myServiceHistoryData?.total !== 0 &&
        myServiceHistoryData?.content?.booking_consultation.map(
          (serviceHistory) => (
            <Island
              key={serviceHistory?.id}
              className="mx-4 my-2 flex cursor-pointer flex-col p-4"
              onClick={() => {
                handleServiceHistoryItemClick(
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  //@ts-ignore
                  serviceHistory?.bookingType,
                  serviceHistory?.id
                );
              }}
            >
              <div className="flex items-start justify-between">
                <div
                  className={clsx("mb-4 rounded-xl px-2 py-1 text-Regular12", {
                    "bg-lightPositive text-positiveStatus":
                      serviceHistory?.status === Statuses.active,
                    "bg-lightNeutral text-neutralStatus":
                      serviceHistory?.status === Statuses.created,
                  })}
                >
                  {serviceStatus(
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    //@ts-ignore
                    serviceHistory
                  )}
                </div>
                <div className="text-Regular12 text-secondaryText">
                  {dayjs(serviceHistory?.from_time).format(
                    dateTimeFormatWithMinutes
                  )}
                </div>
              </div>
              <div className="flex items-center justify-start">
                <Avatar size="m" className="mr-3" isSquare />
                <div className="flex h-full flex-col justify-around">
                  <div className="text-Regular16 text-dark">
                    {serviceHistory?.name}
                  </div>
                  <div className="text-Regular12 text-secondaryText">
                    {serviceHistory?.doctorName
                      ? `${serviceHistory?.doctorName}, `
                      : ""}{" "}
                    {serviceHistory?.clinicName}
                  </div>
                </div>
              </div>
            </Island>
          )
        )
      }

      {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        myServiceHistoryData?.total === 0 && (
          <div className="h-screen p-4 text-center">
            <p className="mt-32 text-Bold24">
              {tMob("YouHaventSignedUpYetForConsultation")}
            </p>
            <p className="text-Medium16 text-secondaryText">
              {tMob(
                "SelectDoctorOrClinicAndSignUpForOnlineConsultationInClinicOrHomeCall"
              )}
            </p>
            <Button
              onClick={() => router.push("/clinics")}
              className="mt-4 w-full"
            >
              {tMob("SignUpForConsultation")}
            </Button>
          </div>
        )
      }
    </div>
  );
};
