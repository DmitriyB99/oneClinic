import type { FC } from "react";

import {
  CreditCardOutlined,
  PlusOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { useTranslations } from "next-intl";

import type { PaymentsChoosePaymentTypeProps } from "@/entities/payments";
import { Button, Checkbox, CloseIcon, Island } from "@/shared/components";

export const PaymentsChoosePaymentType: FC<PaymentsChoosePaymentTypeProps> = ({
  handleClose,
  handleNext,
  handleCreditCardAddition,
}) => {
  const t = useTranslations("Common");
  return (
    <Island className="!p-4">
      <div className="flex items-center justify-between">
        <div className="text-Bold24">{t("PaymentMethod")}</div>
        <Button
          variant="tertiary"
          className="!p-0"
          onClick={() => {
            handleClose();
          }}
        >
          <CloseIcon />
        </Button>
      </div>
      <div className="mb-6 mt-3 flex items-center justify-start">
        <Checkbox className="mr-3" />
        <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-1">
          <WalletOutlined className="text-Bold24 text-dark" />
        </div>
        <div className="text-dark">{t("Cash")}</div>
      </div>
      <div className="mb-6 mt-3 flex items-center justify-start">
        <PlusOutlined
          className="mr-3 cursor-pointer text-Bold20"
          onClick={() => {
            handleCreditCardAddition?.();
          }}
        />
        <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-1">
          <CreditCardOutlined className="text-Bold24 text-dark" />
        </div>
        <div className="text-dark">{t("AddCard")}</div>
      </div>
      <Button
        className="w-full"
        onClick={() => {
          handleNext();
        }}
      >
        {t("IsReady")}
      </Button>
    </Island>
  );
};
