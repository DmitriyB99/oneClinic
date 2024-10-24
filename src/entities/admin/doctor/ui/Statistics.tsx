import type { FC } from "react";

import { useTranslations } from "next-intl";

import { DesktopMyNumbersInfoCard } from "@/entities/statistics";

interface StatisticsProps {
  reviewCount: number;
  rating: number;
}
export const Statistics: FC<StatisticsProps> = ({ reviewCount, rating }) => {
  const t = useTranslations("Desktop.Admin");
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex w-full gap-3">
        <DesktopMyNumbersInfoCard
          title={t("Rating")}
          indicator={String(reviewCount)}
          changes="-0.1"
          className="w-full"
        />
        <DesktopMyNumbersInfoCard
          title={t("Reviews")}
          indicator={String(rating)}
          changes="+25"
          className="w-full"
        />
      </div>
    </div>
  );
};
