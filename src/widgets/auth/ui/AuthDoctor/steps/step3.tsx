import type { FC } from "react";

import { useTranslations } from "next-intl";

import { Avatar, Button, CheckPinkIcon } from "@/shared/components";
import type { StepModel } from "@/widgets/auth/models";

export const Step3DoctorAuth: FC<StepModel> = ({ back }) => {
  const t = useTranslations("Common");
  const tMob = useTranslations("Mobile.Login");

  return (
    <>
      <div className="flex h-full w-full flex-col items-center justify-center px-4 text-center">
        <Avatar
          className="flex items-center justify-center"
          size="clinicAva"
          style={{ backgroundColor: "#F5F5F5" }}
          src={<CheckPinkIcon width={32} height={21} />}
        />
        <p className="mt-4 text-Bold24">{t("SendApplication")}</p>
        <p className="text-Regular16">
          {tMob("ExpectOurSpecialistsToContactYouShortly")}
        </p>
      </div>
      <div className="absolute bottom-0 left-0 my-5 w-full px-4">
        <Button block onClick={back}>
          {t("ItsClear")}
        </Button>
      </div>
    </>
  );
};
