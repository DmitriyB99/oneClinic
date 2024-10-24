import type { FC } from "react";

import { useTranslations } from "next-intl";

import { Button } from "@/shared/components";

import type { WorkWithSmartphonePageProps } from "./props";

export const WorkWithSmartphone: FC<WorkWithSmartphonePageProps> = ({
  completeDoctorOnboarding,
}) => {
  const t = useTranslations("Common");
  const tMob = useTranslations("Mobile.Onboarding");

  return (
    <div className="h-screen p-4">
      <div className="flex items-center justify-center">
        <img
          src="/doctorOnboarding3.png"
          alt="doctorOnboarding2"
          className="max-h-[65vh] rounded-2xl object-contain"
        />
      </div>
      <div className="mb-3 mt-6 text-left text-Bold20">
        {tMob("AllWorkInYourSmartphone")}
      </div>
      <div className="text-left text-Regular16">
        {tMob(
          "ScheduleAppointmentsChatWithPatientsMakeAppointmentsDuringConsultation"
        )}
      </div>
      <div className="absolute bottom-10 flex w-full items-center justify-between pr-8">
        <Button
          variant="primary"
          className="ml-2 w-full"
          onClick={completeDoctorOnboarding}
        >
          {t("Begin")}
        </Button>
      </div>
    </div>
  );
};
