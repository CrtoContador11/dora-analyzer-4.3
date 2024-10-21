import React from 'react';

interface ProgressBarProps {
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5 mb-4">
      <div
        className="bg-blue-600 h-2 sm:h-2.5 rounded-full relative"
        style={{ width: `${progress}%` }}
      >
        <span className="absolute top-4 right-0 text-xs sm:text-sm text-gray-600">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
};

export default ProgressBar;