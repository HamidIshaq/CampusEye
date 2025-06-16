import React from "react";
import "../Styling/Label.css";

const Label = ({ text }) => {
  return (
    <div className="container">
      <label className="label">{text}</label>
    </div>
  );
};

export default Label;
