import type { FC } from "react";

import type { ChartOptions } from "chart.js";

import type { ChartDataProps } from "@/shared/components";
import { Chart } from "@/shared/components";
import { colors } from "@/shared/config";

const labels = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

const data: ChartDataProps = {
  labels: labels,
  datasets: [
    {
      backgroundColor: colors.lightRed,
      barPercentage: 0.3,
      borderRadius: 10,
      hoverBackgroundColor: colors.crimson,
      borderSkipped: false,
      data: [40000, 24000, 32000, 10000, 45000, 18000, 35000],
    },
  ],
};

export const options: ChartOptions<"bar"> = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    datalabels: {
      display: false,
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
        font: {
          size: 10,
        },
        color: colors.gray?.["4"],
      },
    },
    y: {
      display: true,
      border: {
        dash: [5],
      },
      ticks: {
        stepSize: 10000,
        callback: (value) => {
          if (+value > 999) {
            return parseInt((value as string) ?? "") / 1000 + "k";
          } else {
            return value;
          }
        },
      },
      grid: {
        drawTicks: false,
      },
    },
  },
};

export const MainDoctorChart: FC = () => (
  <Chart data={data} options={options} height={210} />
);
