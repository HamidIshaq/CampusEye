import React from "react";
import "../Styling/AnomolyReport.css";
import { FaDownload } from "react-icons/fa";

const AnomolyReport = ({ anomolyType, CameraID, Cameradescip, timeStamp }) => {
  return (
    <div className="report-box">
      <label>
        Camera ID: <span>{CameraID}</span>
      </label>
      <label>
        Type: <span>{anomolyType}</span>
      </label>
      <label>
        Location: <span>{Cameradescip}</span>
      </label>
      <label>
        Detected Time: <span>{timeStamp}</span>
      </label>
      <div className="download-container">
        <a href="#" className="download-link">
          <FaDownload className="download-icon" />
          Download Report
        </a>
      </div>
    </div>
  );
};

export default AnomolyReport;
