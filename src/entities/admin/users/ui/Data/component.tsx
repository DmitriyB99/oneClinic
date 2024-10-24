import type { FC } from "react";

import { Divider } from "antd";
import { useTranslations } from "next-intl";

import { Button, CloseIcon, EditIcon, CheckIcon } from "@/shared/components";

export const Data: FC = () => {
  const t = useTranslations("Common");
  const tDesktop = useTranslations("Desktop.Admin");
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-col">
          <p className="m-0 text-Regular12 text-gray-secondary">
            {t("PatientPhoneNumber")}
          </p>
          <p className="m-0 mt-1 text-Regular16">+7 771 490 34 23</p>
        </div>
        <div className="flex flex-row gap-3">
          <EditIcon color="colorPrimaryBase" width={18} height={18} />
        </div>
      </div>
      <Divider className="mt-0" />
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-col">
          <p className="m-0 text-Regular12 text-gray-secondary">
            {t("PatientPhoneNumber")}
          </p>
          <p className="m-0 mt-1 text-Regular16">+7 771 490 34 23</p>
        </div>
        <div className="flex flex-row gap-3">
          <EditIcon color="colorPrimaryBase" width={18} height={18} />
        </div>
      </div>
      <Divider className="mt-0" />
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-col">
          <p className="m-0 text-Regular12 text-gray-secondary">
            {tDesktop("RegistrationStage")}
          </p>
          <Button
            className="!h-7 !rounded-sm !p-1 !px-2 !text-Regular12"
            variant="outline"
          >
            {t("UnderConsideration")}
          </Button>
        </div>
        <div className="flex flex-row gap-3">
          <CheckIcon width={18} height={22} />
          <CloseIcon width={22} height={22} color="red" />
        </div>
      </div>
      <Button className="!mt-3 !h-10">{t("ChangePassword")}</Button>
    </div>
  );
};
