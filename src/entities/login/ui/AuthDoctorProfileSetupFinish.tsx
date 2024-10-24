import type { FC } from "react";

import { useTranslations } from "next-intl";

import type { AuthDoctorProfileSetupStepModel } from "@/entities/login";
import { ArrowLeftIcon, Button, ProgressBar } from "@/shared/components";

export const AuthDoctorProfileSetupFinish: FC<AuthDoctorProfileSetupStepModel> =
  ({ next }) => {
    const t = useTranslations("Common");
    const tMob = useTranslations("Mobile.Login");

    return (
      <div className="flex h-screen flex-col items-center justify-between bg-white">
        <div>
          <Button
            size="s"
            variant="tinted"
            className={"absolute left-4 mt-4 bg-gray-2"}
          >
            <ArrowLeftIcon />
          </Button>
        </div>
        <div className="flex w-full flex-col items-center justify-center">
          <div>
            <ProgressBar percent={65} type="circle" />
          </div>
          <div className="my-3 w-3/5 text-center text-Bold24">
            {tMob("YourProfileIsSixtyFivePercentComplete")}
          </div>
          <div className="px-5 text-center text-Regular16">
            {tMob("FullyFilledProfileIsMoreTrustworthy")}
          </div>
        </div>
        <div className="mb-5 w-full px-4">
          <Button className="w-full" onClick={next}>
            {t("CompleteRegistration")}
          </Button>
        </div>
      </div>
    );
  };
