import type { FC, ChangeEvent } from "react";
import { useCallback, useState } from "react";

import { useTranslations } from "next-intl";

import {
  Button,
  Dialog,
  CloseIcon,
  InputText,
  Chip,
  KaspiIcon,
} from "@/shared/components";
import { balanceFillValues } from "@/shared/config";

import type { KaspiFillProps } from "../models";

export const KaspiFillDialog: FC<KaspiFillProps> = ({
  isDialogOpen,
  setDialogOpen,
}) => {
  const t = useTranslations("Common");
  const tMob = useTranslations("Mobile.My");
  const [balance, setBalance] = useState("0");

  const onBalanceInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const inputValue = event.target.value;
      if (inputValue === "") {
        setBalance("");
        return;
      }

      const numericValue = parseInt(inputValue);
      if (isNaN(numericValue)) return false;
      const regex = /^(0|[1-9][0-9]*)$/;

      const stringValue = String(numericValue);
      if (regex.test(stringValue)) {
        setBalance(stringValue);
      }
    },
    []
  );

  return (
    <Dialog
      isOpen={isDialogOpen}
      setIsOpen={setDialogOpen}
      className="h-3/4 p-4"
    >
      <div className="mb-5 mt-4 flex items-center justify-between">
        <div className="text-Bold24">
          {tMob("ToGetConsultationTopUpYourWallet")}
        </div>
        <Button
          size="s"
          className="bg-transparent"
          onClick={() => setDialogOpen(false)}
        >
          <CloseIcon />
        </Button>
      </div>
      <div className="mb-5 text-Bold20">
        {tMob("SpecifyTheAmountToReplenish")}
      </div>
      <div className="mb-4 text-Regular14">
        {tMob(
          "YouWillNeedToTopUpYourBalanceSoThatTeCanWriteOffMoneyForConsultations"
        )}
      </div>
      <InputText
        type="number"
        label={t("BalanceTg")}
        name="balance"
        showAsterisk={false}
        value={balance}
        onChange={onBalanceInputChange}
      />
      <div className="flex items-center justify-center">
        {balanceFillValues.map((value) => (
          <Chip
            key={value}
            label={`${value} ₸`}
            className="mt-4 rounded-xl border-gray-4 bg-transparent !text-dark"
            onChange={() => setBalance(value)}
            checked={balance === value}
          />
        ))}
      </div>

      <div className="mt-8 flex bg-white">
        <Button
          block
          className="flex !h-14 items-center gap-4 px-4"
          onClick={() => setDialogOpen(true)}
        >
          <KaspiIcon width={32} />
          <p className="mb-0 text-Medium16">{t("FillUpPurse")}</p>
        </Button>
      </div>
    </Dialog>
  );
};
