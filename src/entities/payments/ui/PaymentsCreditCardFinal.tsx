import type { FC } from "react";
import { useMemo } from "react";

import { useTranslations } from "next-intl";

import type { PaymentsCreditCardAdditionProps } from "@/entities/payments";
import { Avatar, Button, CloseIcon, ClosePinkIcon, Island } from "@/shared/components";

export const PaymentsCreditCardFinal: FC<PaymentsCreditCardAdditionProps> = ({
  handleClose,
  handleNext,
  type,
  handleRetry,
}) => {
  const t = useTranslations("Common");
  const tMob = useTranslations("Mobile");
  const [topText, bottomText, buttonText] = useMemo(() => {
    switch (type) {
      case "success":
        return [
          tMob("Payments.CardAdded"),
          tMob("My.YouCanChangeYourPaymentMethodInYourProfile"),
          t("ItsClear"),
        ];
      case "fail":
        return [
          t("SomethingWentWrongColon"),
          tMob("My.WeWereUnableToLinkYourCardInformationMayBeIncorrect"),
          "",
        ];
      case "noMoney":
        return [
          t("IsNotHonoured"),
          tMob(
            "My.YourCardCasInsufficientFundsOrExceedsTheLimitForOnlinePurchases"
          ),
          t("RepeatPayment"),
        ];
      default:
        return ["", "", ""];
    }
  }, [t, tMob, type]);

  return (
    <Island className="!px-4 !pt-4">
      <div className="flex justify-end py-3 pr-3">
        <Button variant="tertiary" onClick={handleClose}>
          <CloseIcon />
        </Button>
      </div>
      <div className="mb-6 mt-4 flex justify-center">
        <Avatar size="clinicAva" className="flex justify-center items-center" style={{ backgroundColor: "#F5F5F5" }} src={<ClosePinkIcon />}/>
      </div>
      <div className="mb-3 flex justify-center text-Bold24">{topText}</div>
      <div className="mb-8 flex justify-center text-center text-Regular16">
        {bottomText}
      </div>
      {(type === "noMoney" || type === "success") && (
        <Button
          variant="primary"
          className="mb-4 w-full px-4"
          onClick={handleNext}
        >
          {buttonText}
        </Button>
      )}
      {(type === "fail" || type === "noMoney") && (
        <Button
          variant="secondary"
          className="mb-4 w-full"
          onClick={handleRetry}
        >
          {t("UseAnotherCard")}
        </Button>
      )}
    </Island>
  );
};
