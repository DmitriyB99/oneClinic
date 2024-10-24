import { useMemo } from "react";
import type { FC } from "react";

import { useTranslations } from "next-intl";

import { Button, Island, List } from "@/shared/components";

import type { DoctorsPageProps } from "./props";

export const DoctorsPage: FC<DoctorsPageProps> = ({ onBoardingComplete }) => {
  const t = useTranslations("Common");
  const tMob = useTranslations("Mobile.Onboarding");

  const listItems = useMemo(
    () => [
      {
        id: "1",
        title: tMob("ExpertConsultation"),
        description: tMob("IndividualApproachToEveryone"),
      },
      {
        id: "2",
        title: tMob("UsefulArticles"),
        description: tMob("TipsForPreventionAndHealthCare"),
      },
      {
        id: "3",
        title: t("Notifications"),
        description: tMob("ReminderOfUpcomingVisitsAndMedications"),
      },
    ],
    [t, tMob]
  );

  return (
    <div className="h-full">
      <img src="/onboard3.jpeg" alt="onboard3" />
      <Island>
        <p className="mb-4 text-Bold20">{tMob("CareForTheCustomer")}</p>
        <p className="mb-3 text-Regular16">
          {tMob(
            "YourHealthIsYourTopPriorityAndWeAreHereToProvideAccessToTheBestDoctorsAndMedicalResources"
          )}
        </p>
        <List items={listItems} />
        <Button block onClick={onBoardingComplete} className="my-4">
          {t("Begin")}
        </Button>
      </Island>
    </div>
  );
};
