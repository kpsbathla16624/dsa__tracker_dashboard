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

interface RatingData {
  code: string;
  getyear: string;
  getmonth: string;
  getday: string;
  rating: string;
  rank: string;
  name: string;
  end_date: string;
  color: string;
}

interface CodechefRatingGraphProps {
  ratingData: RatingData[];
}

// Custom tooltip component
const CustomTooltip: React.FC<TooltipProps<ValueType, NameType>> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black p-2 rounded-lg shadow-md">
        <p className="label">{`Date: ${label}`}</p>
        <p className="intro">{`Rating: ${payload[0].value}`}</p>
        <p className="intro">{`Contest: ${payload[0].payload.contest}`}</p>
      </div>
    );
  }

  return null;
};

const CodechefRatingGraph: React.FC<CodechefRatingGraphProps> = ({ ratingData }) => {
  const processedData = ratingData.map((entry) => ({
    date: `${entry.getyear}-${entry.getmonth.padStart(2, '0')}-${entry.getday.padStart(2, '0')}`,
    rating: Number(entry.rating), // Convert rating to a number
    contest: entry.name, // Map contest name
  }));


  return (
    <div className="h-full justify-center items-center  p-4 flex flex-col shadow-lg  bg-transparent bg-blur-xl">
      
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
            stroke="#BB86FC"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CodechefRatingGraph;
