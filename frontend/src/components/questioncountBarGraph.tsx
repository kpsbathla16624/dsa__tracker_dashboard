import React, { useEffect, useState } from 'react';
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
import getUserProfile from '../functions/getuserProfiles';

import { userProps } from '../models/profilesmodel';

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


const QuestionCountGraph: React.FC<userProps> = ({ user }) => {
  const [profiles, setProfiles] = useState<any>(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      const data = await getUserProfile(user.codechef, user.codeforces, user.leetcode);
      setProfiles(data);
    };

    fetchProfiles();
  }, [user]);

  if (!profiles) {
    // Shimmer loader
    return (
      <div className=" w-full h-full shimmer-effect flex flex-col items-center justify-center gap-2 p-4 border rounded-lg shadow-lg backdrop-blur-lg bg-opacity-75 bg-transparent bg-blur-xl">
        <div className="animate-pulse flex flex-col items-center gap-4">
          {/* Title shimmer */}
          <div className="h-6 w-32 bg-gray-600 rounded-md"></div>
          {/* Bar shimmer */}
          <div className="h-4 w-full bg-gray-600 rounded-md"></div>
          <div className="h-4 w-full bg-gray-600 rounded-md"></div>
          <div className="h-4 w-full bg-gray-600 rounded-md"></div>
        </div>
      </div>
    );
  }

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
        backgroundColor: ['rgb(45 212 191)', 'white', 'grey'],
        borderColor: ['rgb(45 212 191)', 'white', 'grey'],
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

  return (
    <div className="w-full  h-full justify-evenly flex flex-col my-2 p-4 border rounded-xl shadow-lg backdrop-blur-lg bg-opacity-75 bg-transparent bg-blur-xl">
      <h1 className="text-white">
        Total Questions:{" "}
        {Number(profiles.codeForces.total) +
          Number(profiles.codeChef.total) +
          Number(profiles.leetCode.totalSolved)}
      </h1>
      <Bar data={data} options={options} className="pb-3 bg-transparent" />
    </div>
  );
};

export default QuestionCountGraph;
