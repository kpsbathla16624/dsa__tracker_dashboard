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
  ChartOptions,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Register the components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

interface BarChartProps {
  profiles: {
    codeChef: any;
    codeForces: any;
    leetCode: any;
  };
}

const   BarChart: React.FC<BarChartProps> = ({ profiles }) => {
  const data = {
    labels: ['CodeChef', 'Codeforces', 'LeetCode'],
    datasets: [
      {
        label: 'Rating',
        data: [
          profiles.codeChef ? profiles.codeChef.total : 0,
          profiles.codeForces ? profiles.codeForces.total : 0,
          profiles.leetCode ? profiles.leetCode.totalSolved : 0,
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(75, 192, 192, 0.8)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
        barThickness: 70, 
        maxBarThickness: 100,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, 
      },
      title: {
        display: true,
        text: 'No of Questions',
        color: '#ffffff',
      },
      datalabels: {
        color: '#ffffff',
        anchor: 'end',
        align: 'end',
        formatter: (value: number) => value.toString(),
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#ffffff',
        },
        grid: {
          color: '#444444',
        },
      },
      x: {
        ticks: {
          color: '#ffffff',
        },
        grid: {
          display: false,
        },
      },
    },
  };
console.log(data);
  return (
    <div className="w-full max-w-[450px] h-[250px] justify-evenly flex flex-col my-2 p-4 border rounded-lg shadow-lg backdrop-blur-lg bg-opacity-75 bg-gradient-to-br from-gray-800 via-black to-gray-800 bg-blur-xl">
      <h1 className='text-white'>
        Total Questions :{" "} 
        {Number(profiles.codeForces.total) +
          Number(profiles.codeChef.total) +
          Number(profiles.leetCode.totalSolved)}
      </h1>
      <Bar data={data} options={options} className='pb-3'  />
    </div>
  );
  
};

export default BarChart;
