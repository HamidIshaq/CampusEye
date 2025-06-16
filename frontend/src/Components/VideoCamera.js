import React from "react";

const VideoCamera = () => {
  return (
    <img
      src="http://localhost:5001/"
      alt="Live Camera Feed"
      className="w-full h-full object-contain"
      style={{
        borderRadius: "8px",
        border: "2px solid #ccc",
        objectFit: "contain",
      }}
    />
  );
};

export default VideoCamera;
