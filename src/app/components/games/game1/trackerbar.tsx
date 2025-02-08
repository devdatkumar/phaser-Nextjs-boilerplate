// trackerbar.tsx
import React from "react";

const TrackerBar = ({
  leftCount,
  rightCount,
  turnsCount,
  startValue,
}: {
  leftCount: number;
  rightCount: number;
  turnsCount: number;
  startValue: number;
}) => {
  return (
    <div className="flex justify-between bg-[#445B1F]">
      {/* Left Section */}
      <div className="flex flex-col items-center m-2">
        <svg
          key="start-circle"
          className="h-24 w-24"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2 L16 8 L22 9.5 L17 14.5 L19 21 L12 17.6 L5 21 L7 14.5 L2 9.5 L8 8 Z"
            fill="#ECEDED"
          />
          <circle r="5" cx="12" cy="12" fill="#737373" stroke="white" />
          <text
            x="12"
            y="12.5"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="8"
            className="fill-white"
          >
            {startValue}
          </text>
        </svg>
        <p className="text-nowrap">{turnsCount} TURNS LEFT</p>
      </div>
      <div className="flex items-center w-full bg-[#2D351C] justify-end">
        {/* Center Section */}
        <div className="flex items-center h-8 w-full bg-[#445B1F] mx-0.5">
          <div className="flex items-center">
            {/* Left Arrows */}
            <div className="flex rotate-180 -space-x-4 -mr-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <svg
                  key={`left-${i}`}
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-16 w-16 ${
                    i < leftCount ? "fill-white" : "fill-[#737373]"
                  }`}
                  viewBox="0 0 35 40"
                >
                  <polygon points="0,10 25,10 35,20 25,30 0,30 10,20" />
                </svg>
              ))}
            </div>
            {/* Center Circle */}
            <svg
              key="center-circle"
              viewBox="0 0 24 24"
              className="h-16 w-16 -mx-2 z-10"
            >
              <circle r={10} cx={12} cy={12} stroke="white" fill="#CCCCCC" />
            </svg>
            {/* Right Arrows */}
            <div className="flex -space-x-4 -ml-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <svg
                  key={`right-${i}`}
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-16 w-16 ${
                    i < rightCount ? "fill-white" : "fill-[#737373]"
                  }`}
                  viewBox="0 0 35 40"
                >
                  <polygon points="0,10 25,10 35,20 25,30 0,30 10,20" />
                </svg>
              ))}
            </div>
          </div>
          {/* End Circle */}
          <svg
            key="end-circle"
            viewBox="0 0 24 24"
            className="size-20 items-end ml-auto"
          >
            <circle r={12} cx={12} cy={12} fill="#8AB73F" />
            <path
              d="M12 3 L15.27 8.09 L20.5 9.06 L17 13.94 L17.5 19 L12 17.0 L6.82 19.5 L7 13.94 L3.5 9.06 L8.73 8.09 Z"
              fill="white"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default TrackerBar;
