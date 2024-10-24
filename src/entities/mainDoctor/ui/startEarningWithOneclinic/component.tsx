import type { FC } from "react";
import { useMemo } from "react";
import CopyToClipboard from "react-copy-to-clipboard";

import { Steps } from "antd";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { Button, Dialog, Island } from "@/shared/components";
import { APP_STORE_APP_LINK, PLAY_MARKET_APP_LINK } from "@/shared/constants";
import { getMobileOperatingSystem } from "@/shared/utils";

import type { StartEarningWithOneclinicDialogProps } from "./props";

export const StartEarningWithOneclinicDialog: FC<StartEarningWithOneclinicDialogProps> =
  ({ open, setIsOpen }) => {
    const t = useTranslations("Common");
    const tMob = useTranslations("Mobile.MyDoctor");

    const linkSource = useMemo(() => {
      const os = getMobileOperatingSystem();

      if (os === "ios") {
        return APP_STORE_APP_LINK;
      }

      return PLAY_MARKET_APP_LINK;
    }, []);

    const stepItems = useMemo(
      () => [
        {
          title: (
            <div className="leading-5 text-dark">
              {tMob("CompleteYourProfile")}
            </div>
          ),
          description: (
            <div className="mt-2 text-colorPrimaryBase">
              <Link href="/myDoctor/editProfile">
                {tMob("ContinueCompletingProfile")}
              </Link>
            </div>
          ),
        },
        {
          title: (
            <div className="leading-5 text-dark">
              {tMob("ProvideLinkToYourProfileOnSocialNetworks")}
            </div>
          ),
          description: (
            <CopyToClipboard text={linkSource}>
              <div className="mt-2 text-colorPrimaryBase">
                {tMob("CopyLink")}
              </div>
            </CopyToClipboard>
          ),
        },
        {
          title: (
            <div className="leading-5 text-dark">
              {tMob("InviteYourFellowPatientsToOneClinic")}
            </div>
          ),
          description: (
            <CopyToClipboard text={linkSource}>
              <div className="mt-2 text-colorPrimaryBase">
                {tMob("ShareReferralLink")}
              </div>
            </CopyToClipboard>
          ),
        },
      ],
      [linkSource, tMob]
    );

    return (
      <Dialog setIsOpen={setIsOpen} isOpen={open} className="px-0">
        <div className="bg-gray-0">
          <div className="bg-white px-4 pb-2 text-Bold24">
            {tMob("ToStartEarningMoneyWithOneClinic")}
          </div>
          <Island className="mt-2 rounded-b-none">
            <Steps direction="vertical" current={-1} items={stepItems} />
            <Button className="mt-4 w-full" onClick={() => setIsOpen(false)}>
              {t("ItsClear")}
            </Button>
            <Button
              className="mt-4 w-full"
              variant="secondary"
              onClick={() => setIsOpen(false)}
            >
              {t("DontShowAgain")}
            </Button>
          </Island>
        </div>
      </Dialog>
    );
  };
