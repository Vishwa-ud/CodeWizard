import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

//metrics dispaly component
const MetricsChart = ({ metrics }) => {
  const chartData = {
    labels: Object.keys(metrics),
    datasets: [
      {
        label: 'Code Metrics',
        data: Object.values(metrics),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Code Analysis Results' },
    },
  };

  return (
    <div className="mt-6">
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default MetricsChart;
