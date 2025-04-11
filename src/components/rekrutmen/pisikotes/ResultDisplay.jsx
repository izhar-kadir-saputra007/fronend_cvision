import React from "react";

const ResultDisplay = ({ score, handleStart }) => {
  return (
    <div className="mt-20">
      <button
        onClick={handleStart}
        className="mt-4 bg-secondary text-white px-4 py-2 rounded"
      >
        Mulai Ulang Psikotest
      </button>
    </div>
  );
};

export default ResultDisplay;