import { useMemo } from "react";
import type { FC } from "react";

import { useTranslations } from "next-intl";

import { Button, Island, List } from "@/shared/components";

import type { ConsultationPageProps } from "./props";

export const ConsultationPage: FC<ConsultationPageProps> = ({ complete }) => {
  const t = useTranslations("Common");
  const tMob = useTranslations("Mobile.Onboarding");

  const listItems = useMemo(
    () => [
      {
        id: "1",
        title: tMob("HelpInAnySituation"),
        description: tMob("SpecialistsInVariousFieldsOfMedicine"),
      },
      {
        id: "2",
        title: tMob("MedicalSecrecy"),
        description: tMob("HighStandardsOfMedicalEthics"),
      },
      {
        id: "3",
        title: tMob("TellMeWhatHurts"),
        description: tMob(
          "SelectionOfSpecialistBasedOnTheSymptomsOfTheDisease"
        ),
      },
    ],
    [tMob]
  );

  return (
    <div className="h-full">
      <img src="/onboard2.jpeg" alt="onboard2" />
      <Island>
        <p className="mb-4 text-Bold20">{tMob("QualifiedDoctors")}</p>
        <p className="mb-3 text-Regular16">
          {tMob(
            "QualifiedDoProfessionalMedicalAssistanceDotWeEmployOnlExperiencedDoctorsWithCertificationAndHighRatings"
          )}
        </p>
        <List items={listItems} />
        <Button block variant="secondary" onClick={complete} className="my-4">
          {t("Continue")}
        </Button>
      </Island>
    </div>
  );
};
