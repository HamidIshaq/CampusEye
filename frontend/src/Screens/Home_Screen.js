import React, { useState, useEffect, useRef } from "react"; // Import useRef
import { useNavigate } from "react-router-dom";
import "../Styling/Home_Screen.css";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons"; // Keep only used import
import VideoCamera from "../Components/VideoCamera";
import SideVideoCamera from "../Components/SideVideoCamera";
import Label from "../Components/Label";
import Button from "../Components/Button";
import AnomolyReport from "../Components/Anomoly-Report";
import AnomalyCamera from "../Components/AnomalyCamera";

const Home = () => {
  const [anomolyDetected, setAnomolyDetect] = useState(false);
  const [anomolyDetectText, setAnomolyDetectText] = useState(
    "No Anomoly Detected from 24 hours"
  );
  const [selectedCamera, setSelectedCamera] = useState(0); // Default to camera 0
  const [anomolyVideoStream, setAnomolyVideoStream] = useState(null);
  const navigate = useNavigate();

  const wsRef = useRef(null);

  // WebSocket setup for receiving anomaly-detected video stream
  const [anomalyLogs, setAnomalyLogs] = useState([]);

  useEffect(() => {
    const fetchAnomalies = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/anomalies");
        const data = await res.json();
        setAnomalyLogs(data.reverse()); // newest first
      } catch (err) {
        console.error("Failed to fetch anomalies:", err);
      }
    };

    fetchAnomalies();
  }, []);


  function showAnomoly() {
    setAnomolyDetect(!anomolyDetected);
    setAnomolyDetectText(
      anomolyDetected ? "No Anomoly Detected from 24 hours" : "Anomoly Detected"
    );
  }

  const handleStoresAnomolies = () => navigate("/storedAnomolies");
  const handleAdmin = () => navigate("/Admin");
  const handleMoveBack = () => navigate("/Login");

  const handleCameraSelect = (cameraIndex) => {
    setSelectedCamera(cameraIndex); // Update the main stream camera
  };

  return (
    <div className="main-frame">
      <div className="sub-frame">
        <div className="camera-container">
          <Label text={`Streaming Camera No. ${selectedCamera + 1}`} />{" "}
          {/* Dynamic label */}
          <div className="main-streaming-box">
            <VideoCamera cameraIndex={selectedCamera} />
          </div>
        </div>
        <div className="Button-container">
          <Button label={"Stored Anomolies"} onClick={handleStoresAnomolies} />
          <Button label={"Admin Configuration"} onClick={handleAdmin} />
        </div>
        <div className="Anomoly-container">
          <Button
            label={anomolyDetectText}
            icon_name={faExclamationTriangle}
            onClick={showAnomoly}
          />
          {anomolyDetected &&
            anomalyLogs.map((anom, index) => (
              <AnomolyReport
                key={index}
                CameraID={anom.camera_id}
                anomolyType={anom.anomaly_type || "Unknown"}
                Cameradescip={anom.location || "Unknown Location"}
                timeStamp={anom.start_time}
              />
          ))}

        </div>
        <Button label="Go Back" onClick={handleMoveBack} />
      </div>
      <div className="sub-frame" style={{ flex: "1" }}>
        <div className="Right-camera-container">
          <Label text={"Streaming Cameras"} />
          {/* List of side cameras, adjust indices based on available cameras */}
          <SideVideoCamera
            cameraIndex={0}
            onSelect={handleCameraSelect}
            isSelected={selectedCamera === 0}
          />
          <SideVideoCamera
            cameraIndex={1}
            onSelect={handleCameraSelect}
            isSelected={selectedCamera === 1}
          />
          {/* <SideVideoCamera
            cameraIndex={2}
            onSelect={handleCameraSelect}
            isSelected={selectedCamera === 2}
          /> */}
        </div>
      </div>
      
    </div>
  );
};

export default Home;
