import React from "react";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-900">
      <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full border-teal-500 border-t-transparent"></div>
      <h2 className="text-teal-500 text-lg font-semibold mt-4 ml-4">
        Loading, please wait...
      </h2>
    </div>
  );
};

export default LoadingSpinner;
