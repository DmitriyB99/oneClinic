import type { FC } from "react";

import { useTranslations } from "next-intl";

import {
  Button,
  Dialog,
  Island,
  MuteSoundIcon,
  VideoCameraIcon,
} from "@/shared/components";

import type { OnDutyDoctorDialogProps } from "./props";

export const OnDutyDoctorDialog: FC<OnDutyDoctorDialogProps> = ({
  open,
  setIsOpen,
}) => {
  const t = useTranslations("Common");
  const tMob = useTranslations("Mobile.DutyDoctors");

  return (
    <Dialog setIsOpen={setIsOpen} isOpen={open} className="px-0">
      <div className="bg-gray-0">
        <div className="bg-white p-4 text-Bold24">
          Онлайн-консультации с режимом “На линии”
        </div>
        <Island className="mt-2 rounded-b-none">
          <div className="flex items-start">
            <div className="h-9 rounded-3xl bg-lightRed p-2">
              <VideoCameraIcon width={20} height={20} />
            </div>
            <div className="ml-4 text-Regular16">
              {tMob("MakeSureYourMicrophoneAndCameraWorking")}
            </div>
          </div>
          <div className="mt-6 flex items-center">
            <div className="h-9 rounded-3xl bg-lightRed p-2">
              <MuteSoundIcon width={20} height={20} />
            </div>
            <div className="ml-4 text-Regular16">
              {tMob("NoExtraneousNoise")}
            </div>
          </div>
          <div className="mt-6 flex items-center">
            <div className="h-9 rounded-3xl bg-lightRed p-2">
              <MuteSoundIcon width={20} height={20} />
            </div>
            <div className="ml-4 text-Regular16">
              Будьте вежливы и аккуратны с пациентами
            </div>
          </div>
          <Button className="mt-8 w-full" onClick={() => setIsOpen(false)}>
            {t("Confirm")}
          </Button>
          <Button
            className="mt-4 w-full"
            variant="tertiary"
            onClick={() => setIsOpen(false)}
          >
            {t("DontShowAgain")}
          </Button>
        </Island>
      </div>
    </Dialog>
  );
};
