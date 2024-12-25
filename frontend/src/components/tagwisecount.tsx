"use client";
import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import TagComponent from "./tagComponent";
import host from "../consts";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

function TagWiseCount() {
  const [tagData, setTagData] = useState<Record<string, number>>({});
  const [lcTagCounts, setLcTagCounts] = useState<Record<string, number>>({});
  const [cfTagCounts, setCfTagCounts] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState<"Codeforces" | "LeetCode">(
    "LeetCode"
  );
  const [viewType, setViewType] = useState<"Cards" | "Pie Chart">("Pie Chart");
  const [loading, setLoading] = useState(true); // Loading state



  async function getData() {
    setLoading(true);
    try {
      const profileResponse = await fetch(
        `${host}/api/codeforces/getcodeforcesProfile?username=kpsbathla`
      );
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setCfTagCounts(profileData.tagcount || {});
      }

      const leetcodeResponse = await fetch(
        `https://leetcodeapi-bolt.vercel.app/skillStats/kamalpreet6198`
      );
      if (leetcodeResponse.ok) {
        const leetcodeData = await leetcodeResponse.json();
        const allTags = [
          ...leetcodeData.data.matchedUser.tagProblemCounts.fundamental,
          ...leetcodeData.data.matchedUser.tagProblemCounts.intermediate,
          ...leetcodeData.data.matchedUser.tagProblemCounts.advanced,
        ];

        const leetcodeTagCounts: Record<string, number> = {};
        allTags.forEach((tag: { tagName: string; problemsSolved: number }) => {
          leetcodeTagCounts[tag.tagName] = tag.problemsSolved;
        });

        setLcTagCounts(leetcodeTagCounts);
        setTagData(leetcodeTagCounts);
      }
    } catch (error) {
      console.error("Error fetching tag data:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  const pieChartData = {
    labels: Object.keys(tagData),
    datasets: [
      {
        data: Object.values(tagData),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) => {
            const value = tooltipItem.raw || 0;
            return `${tooltipItem.label}: ${value}`;
          },
        },
      },
    },
    layout: {
      padding: {
        top: 10,
        bottom: 10,
      },
    },
  };

  return (
    <div className="h-full w-full p-2 border rounded-xl shadow-lg bg-transparent">
      <div className="flex justify-between items-center pb-2">
        <h1 className="font-bold text-xl">Tag Wise Question Count</h1>
        <div className="flex flex-wrap space-x-2 items-center">
          <button
            className={`px-4 py-2 rounded-md ${
              activeTab === "Codeforces"
                ? "bg-teal-400 text-white"
                : "bg-gray-700 text-gray-200"
            }`}
            onClick={() => {
              setActiveTab("Codeforces");
              setTagData(cfTagCounts);
            }}
          >
            Codeforces
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              activeTab === "LeetCode"
                ? "bg-teal-400 text-white"
                : "bg-gray-700 text-gray-200"
            }`}
            onClick={() => {
              setActiveTab("LeetCode");
              setTagData(lcTagCounts);
            }}
          >
            Leetcode
          </button>
          <select
            className="px-2 py-2 rounded-md bg-gray-700 text-gray-200"
            value={viewType}
            onChange={(e) =>
              setViewType(e.target.value as "Cards" | "Pie Chart")
            }
          >
            <option value="Cards">Cards</option>
            <option value="Pie Chart">Pie Chart</option>
          </select>
        </div>
      </div>
      <hr className="mb-2" />
      {loading ? (
       
         
            <div
            
              className="w-full h-4/5 animate-pulse rounded-md shimmer-effect bg-gray-700"
            ></div>
       
       
      ) : (
        <div className="flex flex-wrap">
          {viewType === "Cards" ? (
            Object.entries(tagData).map(([tag, count]) => (
              <TagComponent key={tag} tag={tag} count={count} />
            ))
          ) : (
            <div className="w-full flex justify-center items-center">
              <Doughnut data={pieChartData} options={pieChartOptions} height={220} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TagWiseCount;
