import type { FC } from "react";

import { useTranslations } from "next-intl";

import { Button, PatientsCard, SearchIcon } from "@/shared/components";

import type { ClinicStaffProps, StaffProfiles } from "../model";

export const ClinicStaff: FC<ClinicStaffProps> = (props) => {
  const { clinicDoctors, status } = props;
  const t = useTranslations("Common");
  const tDesktop = useTranslations("Desktop.Admin");
  return (
    <div className="flex w-full flex-col gap-3">
      {status === "ACTIVE" ? (
        <>
          <div className="flex w-full items-center justify-between">
            <div className="flex gap-4">
              <Button
                className="!h-10 !rounded-md !border-borderLight !px-4 !text-Regular16"
                variant="primary"
              >
                + {t("AddDoctor")}
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
          {clinicDoctors?.map((info: StaffProfiles, key: number) => (
            <PatientsCard key={key} doctorProfileId={info.doctorProfileId} />
          ))}
        </>
      ) : (
        <p className="text-gray-4">
          {tDesktop("NoDataAcceptApplicationRegistration")}
        </p>
      )}
    </div>
  );
};
