import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";

interface codeforcesRatingdata {
  contestId: number;
  contestName: string;
  handle: string;
  rank: number;
  ratingUpdateTimeSeconds: number;
  oldRating: number;
  newRating: number;
}

interface codeforcesRatingGraphProps {
  ratingData: codeforcesRatingdata[];
}

// Custom tooltip component
const CustomTooltip: React.FC<TooltipProps<ValueType, NameType>> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 rounded-lg shadow-md">
        <p className="label">{`Date: ${label}`}</p>
        <p className="intro">{`Rating: ${payload[0].value}`}</p>
        <p className="intro">{`Contest: ${payload[0].payload.contest}`}</p>
      </div>
    );
  }

  return null;
};

const CodeforcesRatingGraph: React.FC<codeforcesRatingGraphProps> = ({ ratingData }) => {
  const processedData = ratingData.map((entry) => {
    const date = new Date(entry.ratingUpdateTimeSeconds * 1000); // Convert Unix timestamp to milliseconds
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    return {
      date: formattedDate,
      rating: entry.newRating,
      contest: entry.contestName,
    };
  });

  return (
    <div className="w-full max-w-[700px] h-[300px] justify-center items-center flex flex-col my-2 p-4 border rounded-lg shadow-lg backdrop-blur-lg bg-opacity-75 bg-gradient-to-br from-gray-800 via-black to-gray-800 bg-blur-xl">
      <h1 className="text-white font-bold mt-10">Codeforces Rating Graph</h1>
      <ResponsiveContainer>
        <LineChart
          data={processedData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={["auto", "auto"]} />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="rating"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CodeforcesRatingGraph;
