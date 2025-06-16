import React, { useState } from "react";
import "../Styling/Moniter.css";

const dummyVideos = [
  "https://www.w3schools.com/html/mov_bbb.mp4",
  "https://www.w3schools.com/html/movie.mp4",
  "https://www.w3schools.com/html/mov_bbb.mp4",
  "https://www.w3schools.com/html/movie.mp4",
  "https://www.w3schools.com/html/mov_bbb.mp4",
];

const MonitorView = () => {
  const [activeCam, setActiveCam] = useState(0);

  return (
    <div className="container-fluid monitor-container p-3">
      <div className="row">
        {/* Main Camera View */}
        <div className="col-lg-9 col-md-8 col-sm-12">
          <div className="main-video-wrapper shadow transition-fade">
            <video
              src={dummyVideos[activeCam]}
              autoPlay
              muted
              loop
              className="main-video"
            />
          </div>
        </div>

        {/* Sidebar Scrollable Camera Feeds */}
        <div className="col-lg-3 col-md-4 col-sm-12">
          <div className="sidebar-video-list">
            {dummyVideos.map((src, idx) => (
              <div
                key={idx}
                className={`small-video-box mb-3 ${
                  activeCam === idx ? "active" : ""
                }`}
                onClick={() => setActiveCam(idx)}
              >
                <video
                  src={src}
                  autoPlay
                  muted
                  loop
                  className="small-video"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonitorView;
