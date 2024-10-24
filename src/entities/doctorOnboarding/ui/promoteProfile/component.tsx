import type { FC } from "react";

import { useTranslations } from "next-intl";

import { Button } from "@/shared/components";

import type { PromoteProfilePageProps } from "./props";

export const PromoteProfile: FC<PromoteProfilePageProps> = ({ next, skip }) => {
  const t = useTranslations("Common");
  const tMob = useTranslations("Mobile.Onboarding");

  return (
    <div className="h-screen p-4">
      <div className="flex items-center justify-center">
        <img
          src="/doctorOnboarding2.png"
          alt="doctorOnboarding2"
          className="max-h-[65vh] rounded-2xl object-contain"
        />
      </div>
      <div className="mb-3 mt-6 text-left text-Bold20">
        {tMob("PromoteYourProfile")}
      </div>
      <div className="text-left text-Regular16">
        {tMob(
          "StandOutFromOtherDoctorsWithProSubscriptionPrioritySearchResultsAndMuchMore"
        )}
      </div>
      <div className="absolute bottom-10 flex w-full items-center justify-between pr-8">
        <Button variant="tertiary" className="mr-2 w-full" onClick={skip}>
          {t("Skip")}
        </Button>
        <Button variant="primary" className="ml-2 w-full" onClick={next}>
          {t("Next")}
        </Button>
      </div>
    </div>
  );
};
