export interface ChartDataProps {
  datasets: ChartDatasetsProps[];
  labels: string[];
}
export interface ChartDatasetsProps {
  backgroundColor: string;
  barPercentage: number;
  borderRadius: number;
  borderSkipped: boolean;
  data: Array<number | string>;
  hoverBackgroundColor?: string;
}

export interface ChartProps {
  data: ChartDataProps;
}
