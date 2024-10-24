import type { FC } from "react";

import { useTranslations } from "next-intl";

import { Button, EmptyIcon } from "@/shared/components";
import type { StepModel } from "@/widgets/auth";

export const Step3Auth: FC<StepModel> = ({ back }) => {
  const t = useTranslations("Common");
  return (
    <>
      <div className="flex h-full w-full flex-col items-center justify-center gap-5 px-[90px] text-center">
        <div>
          <EmptyIcon size="placeholderIcon" />
        </div>
        <p className="m-0 text-Bold24">{t("SendApplication")}</p>
        <p className="text-Regular16">{t("ExpectSpecialist")}</p>
      </div>
      <div className="mt-7 flex justify-center">
        <Button
          variant="primary"
          className="rounded !py-2 px-4"
          size="desktopS"
          onClick={back}
        >
          {t("ItsClear")}
        </Button>
      </div>
    </>
  );
};
