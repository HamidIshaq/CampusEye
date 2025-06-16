import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Styling/StoredAnomoliesScreen.css"; // Keep your custom styles
import Button from "../Components/Button";

const StoreAnomolies = () => {
  const navigate = useNavigate();
  const [anomalies, setAnomalies] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/anomalies")
      .then((res) => res.json())
      .then((data) => setAnomalies(data))
      .catch((err) => console.error("Failed to fetch anomalies:", err));
  }, []);

  const handleMoveBack = () => {
    navigate("/Home");
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
        <h1 className="mb-3">Saved Anomalies</h1>
        <Button label="Move Back" onClick={handleMoveBack} />
      </div>

      <div className="row">
        {anomalies.length > 0 ? (
          anomalies.map((anomaly, index) => (
            <div
              className="col-md-6 col-lg-4 mb-4"
              key={index}
              style={{ animation: "fadeInUp 0.6s ease", animationDelay: `${index * 0.1}s` }}
            >
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body">
                  <h5 className="card-title text-primary">
                    {anomaly.anomaly_type}
                  </h5>
                  <p className="card-text">
                    <strong>Camera ID:</strong> {anomaly.camera_id}
                    <br />
                    <strong>Location:</strong> {anomaly.location}
                    <br />
                    <strong>Start:</strong> {anomaly.start_time}
                    <br />
                    <strong>End:</strong> {anomaly.end_time}
                  </p>
                </div>
                
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <p className="text-muted text-center">No anomalies found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreAnomolies;
