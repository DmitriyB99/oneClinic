import type { ReactElement } from "react";
import { useCallback, useEffect } from "react";

import type { GetServerSidePropsContext } from "next";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import {
  ArrowLeftIcon,
  Button,
  CertificatedIcon,
  ClockIcon,
  Island,
  List,
  MedicinePlusIcon,
} from "@/shared/components";
import { MainLayout } from "@/shared/layout";
import { COMPLETED_DUTY_DOCTOR_ONBOARDING } from "@/shared/utils";

export default function DutyDoctorPage() {
  const t = useTranslations("Common");
  const tMob = useTranslations("Mobile.DutyDoctors");
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem(COMPLETED_DUTY_DOCTOR_ONBOARDING)) {
      router.push("/dutyDoctors/list");
    }
  }, [router]);

  const handleCompleteOnboarding = useCallback(() => {
    localStorage.setItem(COMPLETED_DUTY_DOCTOR_ONBOARDING, "true");
    router.push("/dutyDoctors/list");
  }, [router]);

  return (
    <div className="flex h-screen flex-col">
      <Button
        size="s"
        variant="tinted"
        className="absolute left-4 top-2 bg-gray-2"
        onClick={() => router.push("/main")}
      >
        <ArrowLeftIcon />
      </Button>
      <div className="flex justify-center">
        <img className="w-full" src="/onboard1.jpeg" alt="onboard1" />
      </div>
      <Island className="flex h-full flex-col">
        <p className="mb-4 text-Bold20">{t("DoctorOnDuty")}</p>
        <p className="mb-3 text-Regular16">
          {tMob(
            "YourReliableAssistantAlwaysReadyToAnswerYourQuestionsAndHelpInUrgentSituations!"
          )}
        </p>
        <List
          items={[
            {
              id: "1",
              icon: <MedicinePlusIcon />,
              title: t("PrimaryCare"),
              description: tMob("FastAndReliableMedicalAdvice"),
            },
            {
              id: "2",
              icon: <ClockIcon />,
              title: t("WorksWholeDay"),
              description: tMob("AvailableAtAnyTimeAndFromAnywhereInWorld"),
            },
            {
              id: "3",
              icon: <CertificatedIcon />,
              title: t("ProfessionalDoctors"),
              description: tMob("HaveNecessaryLicensesAndCertificates"),
            },
          ]}
        />
        <Button
          block
          className="mb-4 mt-auto"
          onClick={handleCompleteOnboarding}
        >
          {tMob("ContactDoctorOnDuty")}
        </Button>
      </Island>
    </div>
  );
}

DutyDoctorPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout hideToolbar>{page}</MainLayout>;
};

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../../messages/${locale}.json`)).default,
    },
  };
}
