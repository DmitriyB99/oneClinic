import type { FC } from "react";
import { useQuery } from "react-query";

import { useTranslations } from "next-intl";

import { DesktopMainSubCard } from "@/entities/desktopMain";
import type { PatientFinances } from "@/shared/api";
import { superAdminApis } from "@/shared/api";

import type { FinancesPatientProps } from "./props";

export const FinancesPatient: FC<FinancesPatientProps> = ({
  userProfileId,
  userId,
}) => {
  const t = useTranslations("Common");
  const tDesktop = useTranslations("Desktop.Admin");
  const { data: userFinances, isSuccess } = useQuery(
    ["userFinances", userProfileId],
    () =>
      superAdminApis.getPatientFinances(userId).then((res) => res.data.content)
  );
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex flex-col justify-center">
        <p className="m-0 mb-2 p-0 text-Bold20">{t("Wallet")}</p>
        <div className="flex h-[60px] w-full items-center justify-center rounded-3xl bg-white">
          <p className="m-0 p-0 text-Bold20">5000 ₸</p>
        </div>
      </div>
      <p className="m-0 mb-2 p-0 text-Bold20">{tDesktop("PaymentHistory")}</p>
      {isSuccess &&
        userFinances.map((fin: PatientFinances) => (
          <DesktopMainSubCard
            key={fin.id}
            time={String(fin.created)}
            name={fin.senderName}
            notifications={fin.productName}
            type={fin.productName}
            className="!w-full"
            doctorName={fin.receiverName}
            isTransaction
            paymentStatus={fin.transactionStatus}
          />
        ))}
    </div>
  );
};
