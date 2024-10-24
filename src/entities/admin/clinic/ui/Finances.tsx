import type { FC } from "react";

import { useTranslations } from "next-intl";

import { DesktopMainSubCard } from "@/entities/desktopMain";

import type { FinancesProps } from "../model";

export const ClinicFinances: FC<FinancesProps> = ({ status }) => {
  const tDesktop = useTranslations("Desktop.Admin");
  return (
    <div className="flex w-full flex-col gap-4">
      {status === "ACTIVE" ? (
        <>
          <div className="flex w-full flex-row items-center justify-between rounded-3xl bg-white p-4">
            <p className="m-0 p-0 text-Regular16">
              {tDesktop("WithdrawalOfFunds")}
            </p>
            <div className="flex flex-col items-end">
              <p className="m-0 p-0 text-Regular16">− 120 000 ₸</p>
              <p className="m-0 p-0 text-Regular12 text-gray-secondary">
                15:40, 04 Декабря
              </p>
            </div>
          </div>
          <DesktopMainSubCard
            /* eslint-disable-next-line @typescript-eslint/no-empty-function */
            onClick={() => {}}
            time="asd"
            name="Артем Тарасенко"
            notifications=""
            className="!w-full"
            doctorName="Лор"
            isTransaction
          />
          <DesktopMainSubCard
            /* eslint-disable-next-line @typescript-eslint/no-empty-function */
            onClick={() => {}}
            time="asd"
            name="Артем Тарасенко"
            notifications=""
            className="!w-full"
            doctorName="Лор"
            isTransaction
          />
        </>
      ) : (
        <p className="self-start text-gray-4">
          {tDesktop("NoDataAcceptApplicationRegistration")}
        </p>
      )}
    </div>
  );
};
