import type { FC } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";

import { useTranslations } from "next-intl";

import type {
  DesktopSettingPageProps,
  WorkTimeCheckModel,
} from "@/entities/desktopSetting";
import { WeekdayEnum } from "@/entities/login";
import type { ClinicByIdResponse } from "@/shared/api/clinics";
import { clinicsApi } from "@/shared/api/clinics";
import { getWorkDaysForm } from "@/shared/utils";

import {
  AboutSettingSection,
  AddressSettingSection,
  ContactsSettingSection,
} from "./settingClinicSections";
import { WorkTimeCheck } from "./workTimeCheck";

const Week = Object.keys(WeekdayEnum);

export const DesktopSettingClinicData: FC<DesktopSettingPageProps> = ({
  control,
  reset,
  setValue,
}) => {
  const { data: ClinicProfile } = useQuery(
    ["getClinicProfileInfo"],
    () => clinicsApi.getClinicMe().then((res) => res.data),
    {
      onSuccess: (data) => {
        reset({
          name: data.name,
          description: data.description,
          phoneNumber: data.phoneNumber ?? "",
          email: data.email,
        });
        setClinicWorkSchedule(data);
      },
    }
  );
  const t = useTranslations("Common");
  const tDesktop = useTranslations("Desktop.Settings");
  const [workDays, setWorkDays] = useState<WorkTimeCheckModel[]>([]);

  const Weekdays = useMemo(
    () => ({
      MONDAY: t("Monday"),
      TUESDAY: t("Tuesday"),
      WEDNESDAY: t("Wednesday"),
      THURSDAY: t("Thursday"),
      FRIDAY: t("Friday"),
      SATURDAY: t("Saturday"),
      SUNDAY: t("Sunday"),
    }),
    [t]
  );

  useEffect(() => {
    setValue?.("workPeriods", getWorkDaysForm(workDays));
  }, [workDays, setValue]);

  const setClinicWorkSchedule = useCallback(
    (data?: ClinicByIdResponse) => {
      const workSchedule = data?.workPeriods?.map((workDay) => ({
        active: true,
        startWorkTime: workDay.startTime,
        finishWorkTime: workDay.endTime,
        day: Weekdays[workDay.day],
      }));
      if (workSchedule) {
        const freeDays = Week.map((day) =>
          workSchedule?.find((elem) => elem.day === day)
            ? undefined
            : { active: false, day, startWorkTime: "", finishWorkTime: "" }
        ).filter(Boolean) as WorkTimeCheckModel[];
        setWorkDays([...workSchedule, ...freeDays]);
      }
    },
    [Weekdays]
  );

  return (
    <div className="w-full overflow-y-scroll pr-4">
      <div className="text-Bold24">{tDesktop("ClinicGeneralInfo")}</div>
      <AboutSettingSection data={ClinicProfile} control={control} />
      <ContactsSettingSection data={ClinicProfile} control={control} />
      <AddressSettingSection
        data={ClinicProfile}
        control={control}
        setValue={setValue}
      />
      {ClinicProfile?.workPeriods && (
        <div className="mt-11 flex justify-between">
          <div className="text-Bold24">{t("WorkSchedule")}</div>
        </div>
      )}
      <div className="mt-3 px-4">
        {workDays?.map((day) => (
          <WorkTimeCheck key={day?.day} setWorkDays={setWorkDays} {...day} />
        ))}
      </div>
    </div>
  );
};
