import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions } from 'chart.js';

// Register necessary components from Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

interface DonutChartProps {
  data: Record<string, number>;
  platform:string
}

// Correctly typing the options for the Doughnut chart
const DonutChart: React.FC<DonutChartProps> = ({ data ,platform}) => {
  // Prepare the data for the donut chart
  const chartData = {
    labels: Object.keys(data),
    
    datasets: [
      {
        label: 'Tag Count',
        data: Object.values(data),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
        ],
        hoverOffset: 4,
      },
    ],
  };

  // Define the options with the correct Chart.js types
  const options: ChartOptions<'doughnut'> = {
   
    // cutout: '50%', // Adjust the size of the donut hole (can be smaller or bigger)
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
       fullSize:true,
        labels: {
          boxWidth: 10, // Box size for color squares
          padding: 10,  // Spacing between legend items
          color: 'white', // Legend text color
        },
      },
    },
    responsive: true, // Ensures the chart resizes
    maintainAspectRatio: false, // Allows custom sizing
  };

  return (  
    <div className="w-[450px]  justify-center h-min  max-w-5xl mx-auto my-2 p-4 items-start border rounded-lg shadow-lg backdrop-blur-lg bg-opacity-75 bg-gradient-to-tr from-gray-800 via-black to-gray-800 bg-blur-xl">
      <h2 className="text-center text-white font-bold mb-4 mt-10">Tag Wise Questions {platform} </h2>
     
        <div className="w-full h-[300px] ">
          <Doughnut 
            data={chartData} 
            options={options}
            width={300} // Increase the width of the chart
            height={500} // Increase the height of the chart
          />
       
       
      </div>
    </div>
  );
};

export default DonutChart;
