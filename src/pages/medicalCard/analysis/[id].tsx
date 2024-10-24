import type { ReactElement } from "react";
import { useMemo } from "react";
import { useQuery } from "react-query";

import { ArrowRightOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import dayjs from "dayjs";
import type { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import { medicalTestBookingApi } from "@/shared/api/medicalTestBooking";
import {
  ArrowLeftIcon,
  Button,
  DataEntry,
  Island,
  ShareIcon,
} from "@/shared/components";
import { dateTimeFormatWithMinutes } from "@/shared/config";
import { MainLayout } from "@/shared/layout/MainLayout";
import { AnalysisResultEntry } from "@/widgets/medicalCard";

export default function AnalysisPage() {
  const t = useTranslations("Common");
  const router = useRouter();

  const { data: medicalTestSlotData, isLoading: isAnalysisLoading } = useQuery(
    ["getTestById", router.query.id],
    () =>
      medicalTestBookingApi
        .getMedicalTestBookingSlotById(router.query.id as string)
        .then((response) => response.data)
  );

  const analysisPassTime = useMemo(() => {
    if (!medicalTestSlotData?.fromTime) return "Дата не указана";

    return dayjs(medicalTestSlotData.fromTime).format(
      dateTimeFormatWithMinutes
    );
  }, [medicalTestSlotData?.fromTime]);
  const fakeAnalysisResultsData = [
    {
      analysisName: "Общий анализ крови",
      indicators: "Гемоглобин: 130 г/л, Лейкоциты: 5.2 ×10^9/л",
      rejection: "Гемоглобин ниже нормы",
      type: "Гематология",
    },
    {
      analysisName: "Биохимический анализ крови",
      indicators: "Глюкоза: 5.6 ммоль/л, Холестерин: 4.5 ммоль/л",
      rejection: "",
      type: "Биохимия",
    },
    {
      analysisName: "Общий анализ мочи",
      indicators: "pH: 6.5, Белок: отсутствует",
      rejection: "Повышенный pH",
      type: "Урология",
    },
    {
      analysisName: "Анализ на гепатиты",
      indicators: "HBsAg: отрицательный, Anti-HCV: отрицательный",
      rejection: "",
      type: "Инфекции",
    },
  ];
  return (
    <div className="flex h-screen flex-col">
      <Island className="mb-2 flex h-fit flex-col pb-0">
        <div className="flex items-center justify-between">
          <Button
            size="s"
            variant="tinted"
            className="bg-gray-2"
            onClick={() => router.back()}
          >
            <ArrowLeftIcon />
          </Button>
          <div className="text-Bold16">{t("Analysis")}</div>
          <Button variant="tertiary">
            <ShareIcon />
          </Button>
        </div>
        {isAnalysisLoading ? (
          <div className="flex h-fit w-full items-center justify-center">
            <Spin size="large" />
          </div>
        ) : (
          <>
            <div className="my-6 text-Bold20 text-dark">
              {t("AboutAnalysis")}
            </div>
            <DataEntry
              bottomText={
                medicalTestSlotData?.analysisTypeName ?? t("NotIndicated")
              }
              topText={t("Type")}
              isDivided
            />
            <DataEntry
              bottomText={
                medicalTestSlotData?.clinicInfo?.name ?? t("ClinicNotSpecified")
              }
              topText={t("Clinic")}
              isDivided
            />
            <DataEntry
              bottomText={
                `${medicalTestSlotData?.price} ₸` ?? t("PriceNotSpecified")
              }
              topText={t("Price")}
              isDivided
            />
            <DataEntry
              bottomText={analysisPassTime}
              topText={t("TimeOfTaking")}
              isDivided
            />
          </>
        )}
        <Island className="px-4 pt-2">
          <div className="flex items-center justify-between">
            <div className="text-Bold20">Результаты</div>
            <Button
              size="s"
              variant="tinted"
              className="flex items-center bg-gray-2"
              onClick={() => console.log(1233)}
            >
              <div className="mr-1 text-Medium12">Скачать PDF</div>
              <ArrowRightOutlined />
            </Button>
          </div>
          {fakeAnalysisResultsData.map((result, index) => (
            <AnalysisResultEntry
              key={index}
              analysisName={result.analysisName}
              indicators={result.indicators}
              type={result.type}
              rejection={result.rejection}
              isDivided
            />
          ))}
        </Island>
      </Island>
    </div>
  );
}

AnalysisPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout hideToolbar>{page}</MainLayout>;
};

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../../../messages/${locale}.json`)).default,
    },
  };
}

export const getStaticPaths = () => ({
  paths: [],
  fallback: true,
});
