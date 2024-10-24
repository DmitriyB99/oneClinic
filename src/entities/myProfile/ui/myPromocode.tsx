import type { FC } from "react";
import { useCallback, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { useTranslations } from "next-intl";

import {
  ArrowLeftIcon,
  Avatar,
  Button,
  CopyIcon,
  InputText,
  Island,
  ShareIcon,
} from "@/shared/components";

export const MyPromocode: FC<{ onClose: () => void }> = ({ onClose }) => {
  const t = useTranslations("Common");
  const tMob = useTranslations("Mobile.My");
  const [promocode, setPromocode] = useState<string>();
  const handleOnSubmit = useCallback(() => {
    console.log(promocode);
  }, [promocode]);
  return (
    <div>
      <Island className="mb-2">
        <div className="mb-4 flex items-center justify-between bg-white">
          <Button
            size="s"
            variant="tinted"
            className="rounded-full bg-gray-2"
            onClick={() => {
              onClose();
            }}
          >
            <ArrowLeftIcon />
          </Button>
          <div className="mr-4 text-center">
            <p className="mb-0 text-Bold16">{t("PromoCode")}</p>
          </div>
          <Button
            icon={<ShareIcon className="mr-2" />}
            square
            size="s"
            variant="tertiary"
            onClick={() =>
              navigator.share({
                title: t("PromoCode"),
                text: tMob("BestClinicInTheWorld"),
                url: window.location.href,
              })
            }
          />
        </div>
        <div className="mb-6 flex justify-center">
          <Avatar size="clinicAva" />
        </div>
        <div className="mb-3 text-center text-Bold24">
          {tMob("GiveFiftyPercentDiscountOnYourFirstConsultation")}
        </div>
        <div className="mb-7 text-center text-Regular16">
          {tMob("WhenSomeoneUsesPromoCodeYouWillGetTwentyPercentOff")}
        </div>
        <InputText
          label={tMob("YourPromoCode")}
          name="myPromocode"
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          onChange={() => {}}
          disabled
          showAsterisk={false}
          value="1234567890"
          inputClassName="!text-black"
          icon={
            <CopyToClipboard text="1234567890">
              <Button variant="tertiary" className="mt-1">
                <CopyIcon />
              </Button>
            </CopyToClipboard>
          }
        />
      </Island>
      <Island>
        <div className="mb-6 text-Bold20">
          {tMob("ActivatePromotionalCode")}
        </div>
        <InputText
          label={t("PromoCode")}
          name="promocode"
          onChange={(event) => {
            setPromocode(event.target.value);
          }}
          showAsterisk={false}
        />
        <Button
          variant="primary"
          className="mt-6 w-full"
          onClick={handleOnSubmit}
        >
          {t("Activate")}
        </Button>
      </Island>
    </div>
  );
};
