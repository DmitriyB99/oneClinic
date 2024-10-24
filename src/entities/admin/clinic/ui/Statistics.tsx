import type { FC } from "react";
import { useQuery } from "react-query";

import { useTranslations } from "next-intl";

import { DesktopMyNumbersInfoCard } from "@/entities/statistics";
import { superAdminApis } from "@/shared/api";

import type { ClinicStatisticsProps } from "../model";

export const ClinicStatistics: FC<ClinicStatisticsProps> = ({
  clinicStatistics,
  status,
  reviews,
}) => {
  const t = useTranslations("Common");
  const tDesktop = useTranslations("Desktop.Admin");
  const { data: clinicReviewData } = useQuery(["clinicReviewDataAlls"], () =>
    superAdminApis.getClinicReviews(0, 100, reviews).then((res) => res.data)
  );

  return status === "ACTIVE" ? (
    <div className="flex w-full flex-col gap-3">
      <div className="flex w-full gap-3">
        <DesktopMyNumbersInfoCard
          title={t("Rating")}
          indicator={`${clinicStatistics ?? ""}`}
          changes="-0.1"
          className="w-full"
        />
        <DesktopMyNumbersInfoCard
          title={t("Отзывы")}
          indicator={String(clinicReviewData?.totalElements ?? "")}
          changes="+25"
          className="w-full"
        />
      </div>
      {/*TODO mb use in future*/}
      {/*<div className="w-full">*/}
      {/*  <div className="text-Bold20">Конверсии</div>*/}
      {/*  <div className="mt-5 flex gap-3">*/}
      {/*    <DesktopMyNumbersInfoCard*/}
      {/*      title="Переходы"*/}
      {/*      secondLine="на страницу"*/}
      {/*      indicator="58%"*/}
      {/*      changes="+4%"*/}
      {/*      className="w-full shadow-card"*/}
      {/*    />*/}
      {/*    <DesktopMyNumbersInfoCard*/}
      {/*      title="Получение"*/}
      {/*      secondLine="консультации"*/}
      {/*      indicator="13%"*/}
      {/*      changes="-1%"*/}
      {/*      className="w-full shadow-card"*/}
      {/*    />*/}
      {/*  </div>*/}
      {/*  <div className="mt-3 flex gap-3">*/}
      {/*    <DesktopMyNumbersInfoCard*/}
      {/*      title="Показы профиля"*/}
      {/*      secondLine="в поиске"*/}
      {/*      indicator="46%"*/}
      {/*      changes="+4%"*/}
      {/*      className="w-full shadow-card"*/}
      {/*    />*/}
      {/*    <DesktopMyNumbersInfoCard*/}
      {/*      title="Ср. время клиента"*/}
      {/*      secondLine="на странице"*/}
      {/*      indicator="14 м"*/}
      {/*      changes="-3 м."*/}
      {/*      className="w-full shadow-card"*/}
      {/*    />*/}
      {/*  </div>*/}
      {/*</div>*/}
    </div>
  ) : (
    <p className="self-start text-gray-4">
      {tDesktop("NoDataAcceptApplicationRegistration")}
    </p>
  );
};
