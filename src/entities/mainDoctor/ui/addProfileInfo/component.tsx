import type { FC } from "react";

import { Steps } from "antd";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import { Button, Dialog, Island } from "@/shared/components";

import type { AddProfileInfoDialogProps } from "./props";

export const AddProfileInfoDialog: FC<AddProfileInfoDialogProps> = ({
  open,
  setIsOpen,
}) => {
  const t = useTranslations("Common");
  const tMob = useTranslations("Mobile.MyDoctor");
  const router = useRouter();

  return (
    <Dialog setIsOpen={setIsOpen} isOpen={open} className="px-0">
      <div className="bg-gray-0">
        <div className="bg-white px-4 pb-2 text-Bold24">
          {tMob("EnterDataInProfile")}
        </div>
        <Island className="mt-2 rounded-b-none">
          <Steps
            direction="vertical"
            current={-1}
            items={[
              {
                title: (
                  <div className="mt-1 leading-5 text-dark">
                    {tMob("AttachPhotoAvatar")}
                  </div>
                ),
              },
              {
                title: (
                  <div className="leading-5 text-dark">
                    {tMob("ProvideEducationInformation")}
                  </div>
                ),
              },
              {
                title: (
                  <div className="leading-5 text-dark">
                    {tMob("ProvideInformationAboutCertificates")}
                  </div>
                ),
              },
            ]}
          />
          <Button
            className="mt-4 w-full"
            onClick={() => {
              setIsOpen(false);
              router.push("/myDoctor/editProfile");
            }}
          >
            {t("ContinueCompletingProfile")}
          </Button>
        </Island>
      </div>
    </Dialog>
  );
};
