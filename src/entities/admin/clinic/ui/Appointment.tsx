import type { FC } from "react";
import { useQuery } from "react-query";

import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import { DesktopMainSubCard } from "@/entities/desktopMain";
import { superAdminApis } from "@/shared/api";
import { Button } from "@/shared/components";
import { FilterSIcon } from "@/shared/components";

import type { AppointmentProps } from "../model";

export const AppointmentClinic: FC<AppointmentProps> = ({
  clinicId,
  status,
}) => {
  const t = useTranslations("Common");
  const tDesktop = useTranslations("Desktop.Admin");
  const {
    data: clinicConsultationsData,
    isError,
    isLoading,
    isSuccess,
  } = useQuery(["getAllConsultations"], () =>
    superAdminApis
      .getAllConsultations("clinicId", clinicId)
      .then((res) => res.data.content)
  );

  const router = useRouter();

  return (
    <div className="flex w-full flex-col gap-5">
      {isSuccess && (
        <>
          <div className="flex flex-row justify-between">
            <Button
              className="!h-10 !rounded-md !border-borderLight !px-4 !text-Regular16"
              variant="primary"
              onClick={() => {
                router.push({
                  pathname: `/desktop/bookings`,
                });
              }}
            >
              {t("AddBooking")}
            </Button>
            <Button
              className="flex !h-10 items-center justify-center !rounded-md !bg-white"
              variant="outline"
            >
              <FilterSIcon size="md" />
            </Button>
          </div>
          {/* eslint-disable  @typescript-eslint/no-explicit-any */}
          {clinicConsultationsData?.map((data: any) => (
            <DesktopMainSubCard
              key={data.id}
              onClick={() => {
                router.push({
                  pathname: `/desktop/bookings/${data?.id}`,
                });
              }}
              time={data.fromTime}
              name={data.patientFullName}
              className="!w-full"
              notifications={data.consultationType}
              type={data.name}
            />
          ))}
        </>
      )}
      {isLoading && <p>Loading...</p>}
      {isError && <p>{tDesktop("ServerError")}</p>}
      {status === "NEW_DISABLED" && (
        <p className="self-start text-gray-4">
          {tDesktop("NoDataAcceptApplicationRegistration")}
        </p>
      )}
    </div>
  );
};
