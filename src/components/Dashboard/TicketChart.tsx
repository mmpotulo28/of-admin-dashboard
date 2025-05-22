import React from 'react';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import styles from './dashboard.module.css';
import { ensureNonNegative, getRandomColor } from '@/lib/helpers';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export enum iChartType {
  Line = 'line',
  Bar = 'bar',
  Pie = 'pie',
  Doughnut = 'doughnut',
}

export interface iDataset {
  data: Record<string, number | string>[]; // { label: string, value: number }[]
  legendText: string;
  color: string;
}

export interface iTicketChartProps {
  datasets?: iDataset[];
  chartType?: iChartType;
  square?: boolean;
  legend?: boolean;
}

const TicketChart: React.FC<iTicketChartProps> = ({
  datasets = [],
  chartType = iChartType.Line,
  square,
  legend = false,
}) => {
  if (datasets.length === 0) {
    return <div className={styles.comingSoon}>Coming Soon</div>;
  }

  const labels = datasets[0]?.data.map((data) => Object.values(data)[0]);
  const chartData = {
    labels,
    datasets: datasets?.map((dataset) => ({
      label: dataset.legendText,
      data: ensureNonNegative(
        datasets[0]?.data.map((data) => Object.values(data)[1])
      ),
      borderColor:
        chartType === iChartType.Pie || chartType === iChartType.Doughnut
          ? 'transparent'
          : dataset.color,
      backgroundColor:
        chartType === iChartType.Pie || chartType === iChartType.Doughnut
          ? getRandomColor(labels.length)
          : dataset.color,
      fill: false,
      pointRadius: 3,
      pointHoverRadius: 6,
      pointBackgroundColor: dataset.color,
      cubicInterpolationMode: 'monotone' as const,
      tension: 0.4,
    })),
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: square ? true : false,
    plugins: {
      legend: {
        display: legend,
        position: 'top' as const,
      },
      title: {
        display: false,
        text: datasets[0]?.legendText,
      },
    },
  };

  const lineOptions: ChartOptions<'line'> = {
    ...commonOptions,
  };

  const barOptions: ChartOptions<'bar'> = {
    ...commonOptions,
  };

  const pieOptions: ChartOptions<'pie'> = {
    ...commonOptions,
  };

  const doughnutOptions: ChartOptions<'doughnut'> = {
    ...commonOptions,
  };

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return <Bar data={chartData} title="Bar" options={barOptions} />;
      case 'pie':
        return <Pie data={chartData} options={pieOptions} />;
      case 'doughnut':
        return <Doughnut data={chartData} options={doughnutOptions} />;
      case 'line':
      default:
        return <Line data={chartData} options={lineOptions} />;
    }
  };

  return (
    <div
      className={`${styles.chartContainer}${square ? ` ${styles.square}` : ''}`}
    >
      {renderChart()}
    </div>
  );
};

export default TicketChart;
