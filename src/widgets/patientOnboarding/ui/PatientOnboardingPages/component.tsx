import type { FC } from "react";
import { useCallback, useState } from "react";

import { useRouter } from "next/navigation";

import {
  OnlineConsultation,
  QualifiedDoctors,
  WithCareForPatient,
} from "@/entities/patientOnboarding";
import { Button, TabsPagination } from "@/shared/components";
import { COMPLETED_PATIENT_ONBOARDING } from "@/shared/utils";
import { useTranslations } from "next-intl";

export const PatientOnboarding: FC = () => {
  const [activeOnboardingPage, setActiveOnboardingPage] = useState<number>(0);
  const t = useTranslations("Common");

  const router = useRouter();

  const completeOnboarding = useCallback(() => {
    if (typeof window !== undefined) {
      localStorage.setItem(COMPLETED_PATIENT_ONBOARDING, "true");
      router.push("/login");
    }
  }, [router]);

  const handleNextClick = () => {
    const actions = [
      () => setActiveOnboardingPage(1),
      () => setActiveOnboardingPage(2),
      completeOnboarding,
    ];

    actions[activeOnboardingPage]();
  };

  return (
    <div className="h-full bg-white">
      <TabsPagination
        activeIndex={activeOnboardingPage}
        items={[
          <OnlineConsultation key="onlineConsultation" />,
          <QualifiedDoctors key="qualifiedDoctors" />,
          <WithCareForPatient key="withCareForPatient" />,
        ]}
      />
      <div className="absolute bottom-4 flex w-full items-center justify-between">
        {activeOnboardingPage === 2 ? (
          <Button
            variant="primary"
            className="mx-4 w-full"
            onClick={completeOnboarding}
          >
            {t("Begin")}
          </Button>
        ) : (
          <>
            <Button
              variant="tertiary"
              className="ml-4 mr-1 w-full"
              onClick={completeOnboarding}
            >
              {t("Skip")}
            </Button>
            <Button
              variant="primary"
              className="ml-1 mr-4 w-full"
              onClick={handleNextClick}
            >
              {t("Next")}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
