import type { FC } from "react";
import { useCallback, useMemo, useState } from "react";
import { useQuery } from "react-query";

import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import type { WorkTimeCheckModel } from "@/entities/desktopSetting";
import { WorkTimeCheck } from "@/entities/desktopSetting";
import { clinicsApi } from "@/shared/api/clinics";
import { Button } from "@/shared/components";
import { allDays, getWorkDaysForm } from "@/shared/utils";
import type {
  ClinicDataFillModel,
  DoctorDataFillModel,
  RegistrationStepModel,
} from "@/widgets/auth";

export const Step3FillClinicProfile: FC<
  RegistrationStepModel<ClinicDataFillModel | DoctorDataFillModel>
> = ({ next, setValue }) => {
  const [workDays, setWorkDays] = useState<WorkTimeCheckModel[]>(allDays);
  const router = useRouter();

  const t = useTranslations("Common");
  const tDesktop = useTranslations("Desktop.FillProfile");

  const { data: ClinicProfile } = useQuery(["getClinicProfileInfo"], () =>
    clinicsApi.getClinicMe().then((res) => res.data)
  );

  const handleNextClick = useCallback(() => {
    const clinic = {
      clinicId: ClinicProfile?.id,
      cityId: ClinicProfile?.cityId,
      workPeriod: getWorkDaysForm(workDays),
    };
    if (router.pathname === "/desktop/fillProfile") {
      setValue?.("workPeriods", clinic.workPeriod);
      next?.();
      return;
    }
    setValue?.("clinics", [clinic]);
    next?.();
  }, [workDays, setValue, next, ClinicProfile, router]);

  const title = useMemo(
    () =>
      router.pathname === "/desktop/fillProfile"
        ? tDesktop("WhatDaysClinicWorks")
        : tDesktop("SpecifyWorkScheduleInfo"),
    [router, tDesktop]
  );

  return (
    <>
      <div className="mt-6 text-Bold20">{title}</div>
      <div className="mt-6 h-fit rounded-lg bg-white px-4">
        {workDays?.map((day) => (
          <WorkTimeCheck key={day?.day} setWorkDays={setWorkDays} {...day} />
        ))}
      </div>
      <Button
        onClick={handleNextClick}
        className="mb-20 mt-11 !h-10 w-full rounded-lg"
      >
        {t("Next")}
      </Button>
    </>
  );
};
