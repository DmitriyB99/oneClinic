import type { ReactElement } from "react";
import { Suspense, lazy } from "react";
import { useQuery } from "react-query";

import type { ChartOptions } from "chart.js";
import type { GetServerSidePropsContext } from "next";

import { CaretDown, DesktopMyNumbersInfoCard } from "@/entities/statistics";
import { doctorsApi } from "@/shared/api";
import type { ChartDataProps } from "@/shared/components";
import { DividerSaunet, Island } from "@/shared/components";
import { colors } from "@/shared/config";
import { DesktopLayout } from "@/shared/layout";

const Chart = lazy(() =>
  import("@/shared/components").then((module) => ({
    default: module.Chart,
  }))
);

export const options: ChartOptions<"bar"> = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    datalabels: {
      anchor: "start",
      align: "start",
      formatter: (context: number) => {
        if (context > 999) {
          return context / 1000 + "k";
        }
      },
      font: {
        weight: "bold",
        size: 11,
      },
      color: "black",
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      border: {
        display: false,
      },
      ticks: {
        padding: 16,
        font: {
          size: 10,
        },
        color: colors.gray.icon,
      },
    },
    y: {
      display: false,
    },
  },
};

const labels = ["08.06", "09.06", "10.06", "11.06", "12.06", "13.06", "14.06"];

const data: ChartDataProps = {
  labels: labels,
  datasets: [
    {
      backgroundColor: "#AEEFA2",
      barPercentage: 0.7,
      borderRadius: 4,
      borderSkipped: false,
      data: ["719", "1100", "501", "422", "476", "505", "853"],
    },
  ],
};

export default function MyNumbers() {
  const { data: myProfile } = useQuery(["getMyProfile"], () =>
    doctorsApi.getMyDoctorProfile().then((res) => res.data)
  );

  return (
    <div className="w-full px-6">
      <div className="my-4">Статистика</div>
      <div className="p-6">
        <div className="text-Bold32">Мои показатели</div>
        <div className="mt-5 flex">
          <div>
            <div className="flex gap-3">
              <DesktopMyNumbersInfoCard
                title="Рейтинг"
                indicator={myProfile?.rating?.toString()}
                changes="-0.1"
              />
              <DesktopMyNumbersInfoCard
                title="Отзывы"
                indicator="359"
                changes="+25"
              />
            </div>
            <Island className="mt-3">
              <div className="flex">
                Просмотры профиля
                <CaretDown number="+38%" rise />
              </div>
              <div className="pb-4 pt-2">
                <Suspense>
                  <Chart data={data} options={options} />
                </Suspense>
              </div>
              <div>
                <div className="text-Regular16">Мои пациенты</div>
                <div className="mt-1 text-Regular12">23</div>
                <DividerSaunet className="my-3" />
              </div>
              <div>
                <div className="text-Regular16">Другие пациенты</div>
                <div className="mt-1 text-Regular12">15</div>
                <DividerSaunet className="my-3" />
              </div>
              <div>
                <div className="text-Regular16">Подписанные врачи</div>
                <div className="mt-1 text-Regular12">23</div>
                <DividerSaunet className="my-3" />
              </div>
              <div>
                <div className="text-Regular16">Не подписанные врачи</div>
                <div className="mt-1 text-Regular12">4</div>
              </div>
            </Island>
          </div>
          <Island className="ml-6 h-fit">
            <div className="text-Bold14">Конверсии</div>
            <div className="mt-5 flex gap-3">
              <DesktopMyNumbersInfoCard
                title="Переходы"
                secondLine="на страницу"
                indicator="58%"
                changes="+4%"
                className="shadow-card"
              />
              <DesktopMyNumbersInfoCard
                title="Получение"
                secondLine="консультации"
                indicator="13%"
                changes="-1%"
                className="shadow-card"
              />
            </div>
            <div className="mt-3 flex gap-3">
              <DesktopMyNumbersInfoCard
                title="Показы профиля"
                secondLine="в поиске"
                indicator="46%"
                changes="+4%"
                className="shadow-card"
              />
              <DesktopMyNumbersInfoCard
                title="Ср. время клиента"
                secondLine="на странице"
                indicator="14 м"
                changes="-3 м."
                className="shadow-card"
              />
            </div>
          </Island>
        </div>
      </div>
    </div>
  );
}

MyNumbers.getLayout = function getLayout(page: ReactElement) {
  return <DesktopLayout hideSidebar={false}>{page}</DesktopLayout>;
};

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../../../messages/${locale}.json`)).default,
    },
  };
}
