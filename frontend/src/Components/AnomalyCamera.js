import React from "react";

const AnomalyCamera = ({ imageUrl }) => {
  return (
    <div className="w-full h-full flex justify-center items-center bg-black">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Anomaly Stream"
          className="w-full h-auto object-contain"
        />
      ) : (
        <p className="text-white">Waiting for anomaly stream...</p>
      )}
    </div>
  );
};

export default AnomalyCamera;
