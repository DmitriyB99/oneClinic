import { useMemo } from "react";
import type { FC } from "react";

import { useTranslations } from "next-intl";

import { Button, Island, List } from "@/shared/components";

import type { ClientsPageProps } from "./props";

export const ClientsPage: FC<ClientsPageProps> = ({ complete }) => {
  const tMob = useTranslations("Mobile.Onboarding");
  const t = useTranslations("Common");

  const listItems = useMemo(
    () => [
      {
        id: "1",
        title: tMob("OnlineAndOffline"),
        description: tMob("DontWasteTimeInQueuesForAppointments"),
      },
      {
        id: "2",
        title: tMob("Anytime"),
        description: tMob("TheDoctorOnDutyWillHelpEvenAtNight"),
      },
      {
        id: "3",
        title: tMob("MedicalCard"),
        description: tMob("WeStoreTheHistoryOfConsultationsAndTreatment"),
      },
    ],
    [tMob]
  );

  return (
    <div className="h-full">
      <img src="/onboard1.jpeg" alt="onboard1" />
      <Island className="h-full">
        <p className="mb-4 text-Bold20">{t("Consultations")}</p>
        <p className="mb-3 text-Regular16">
          {tMob(
            "OneClinicIsFastAndConvenientWayToGetCareEasilyExclamationPointAtAnyTimeAndWithoutQueues"
          )}
        </p>
        <List items={listItems} />
        <Button
          block
          variant="secondary"
          onClick={complete}
          className="mb-4 mt-auto"
        >
          {t("Continue")}
        </Button>
      </Island>
    </div>
  );
};
