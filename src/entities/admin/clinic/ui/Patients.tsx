import type { FC } from "react";
import { useQuery } from "react-query";

import { Alert } from "antd";
import { useTranslations } from "next-intl";

import { superAdminApis } from "@/shared/api";
import { Button, SearchIcon, DoctorCard } from "@/shared/components";

import type { ClinicPatientsProps } from "../model";

export const ClinicPatients: FC<ClinicPatientsProps> = ({
  status,
  clinicProfileId,
}) => {
  const t = useTranslations("Common");
  const tDesktop = useTranslations("Desktop.Admin");
  const {
    data: clinicPatientsData,
    isLoading,
    isError,
    isSuccess,
  } = useQuery(["getAllClinicPatients"], () =>
    superAdminApis
      .getClinicPatients(clinicProfileId)
      .then((res) => res.data.content)
  );
  return (
    <div className="flex w-full flex-col gap-3">
      {status === "ACTIVE" || status === "NEW" ? (
        <>
          <div className="flex w-full items-center justify-between">
            <div className="flex gap-4">
              <Button
                className="!h-10 !rounded-md !border-borderLight !px-4 !text-Regular16"
                variant="primary"
              >
                {t("PlusAddPatient")}
              </Button>
              <Button
                className="!h-10 !rounded-md !border-solid !border-red !bg-white !px-4 !text-Regular16 !text-red"
                variant="primary"
                danger
              >
                {t("Delete")}
              </Button>
            </div>
            <div>
              <Button
                className="flex !h-10 items-center justify-center !rounded-md !bg-white"
                variant="outline"
              >
                <SearchIcon size="md" />
              </Button>
            </div>
          </div>
          {isSuccess &&
            (clinicPatientsData?.length <= 0 ? (
              <Alert type="info" message={tDesktop("NoPatients")} />
            ) : (
              /* eslint-disable  @typescript-eslint/no-explicit-any */
              clinicPatientsData?.map((data: any) => {
                <DoctorCard
                  key={data.userId}
                  userId={data.userId}
                  userProfileId={data.userProfileId}
                  fullname={data.fullname}
                  phoneNumber={data.phoneNumber}
                />;
              })
            ))}
          {isError && <p>{tDesktop("ServerError")}</p>}
          {isLoading && <p>Loading...</p>}
        </>
      ) : (
        <p className="text-gray-4">
          {tDesktop("NoDataAcceptApplicationRegistration")}
        </p>
      )}
    </div>
  );
};
