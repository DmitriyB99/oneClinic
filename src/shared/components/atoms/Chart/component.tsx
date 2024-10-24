import type { FC } from "react";
import { Bar } from "react-chartjs-2";

import type { ChartOptions } from "chart.js";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

import type { ChartProps } from "./props";

ChartJS.register(
  ChartDataLabels,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip
);

export const Chart: FC<
  ChartProps & {
    height?: number;
    options: ChartOptions<"bar">;
  }
> = ({ data, options, height }) => (
  <Bar height={height} options={options} data={data} />
);
