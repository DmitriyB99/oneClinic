import type { FC } from "react";

import { useTranslations } from "next-intl";

import { Button } from "@/shared/components";

import type { IncreaseIncomePageProps } from "./props";

export const IncreaseIncome: FC<IncreaseIncomePageProps> = ({ next, skip }) => {
  const tMob = useTranslations("Mobile.Onboarding");
  const t = useTranslations("Common");

  return (
    <div className="h-screen p-4">
      <div className="flex items-center justify-center">
        <img
          src="/doctorOnboarding1.png"
          alt="doctorOnboarding1"
          className="max-h-[65vh] rounded-2xl object-contain"
        />
      </div>
      <div className="mb-3 mt-6 text-left text-Bold20">
        {tMob("IncreaseYourIncomeUpToFiftyFife")}
      </div>
      <div className="text-left text-Regular16">
        {tMob("OnlineConsultationsConvenientAndTransparentPaymentSystem")}
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
