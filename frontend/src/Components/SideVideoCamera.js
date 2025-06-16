import React from "react";
import VideoCamera from "./VideoCamera";

const SideVideoCamera = ({ cameraIndex, onSelect, isSelected }) => {
  const handleClick = () => onSelect(cameraIndex);

  return (
    <div
      className={`w-full h-32 rounded-md overflow-hidden border-2 ${
        isSelected ? "border-green-500" : "border-blue-900"
      } bg-gray-200 cursor-pointer hover:shadow-lg transition-shadow`}
      onClick={handleClick}
    >
      <VideoCamera cameraIndex={cameraIndex} />
    </div>
  );
};

export default SideVideoCamera;
