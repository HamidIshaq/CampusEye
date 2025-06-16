import React, { useState } from "react";
import styled from "styled-components";

const DropDownButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Filter");

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionSelect = (text) => {
    setSelectedOption(text);
    setIsOpen(false);
  };

  return (
    <StyledWrapper>
      <div className="select" onClick={toggleDropdown}>
        <div className="selected">
          <span>{selectedOption}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 512 512"
            className={`arrow ${isOpen ? "rotate" : ""}`}
          >
            <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
          </svg>
        </div>
        {isOpen && (
          <div className="options">
            {[
              "Newest to Oldest",
              "Oldest to Newest",
              "Smoking Type",
              "Vandalism Type",
              "Fighting Type",
            ].map((item, index) => (
              <div
                key={index}
                className="option"
                onClick={() => handleOptionSelect(item)}
              >
                {item}
              </div>
            ))}
          </div>
        )}
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .select {
    width: 200px;
    height: 43px;
    position: relative;
    cursor: pointer;
    background-color: white;
    border-radius: 8px;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }

  .selected {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    font-size: 16px;
    color: black;
    padding: 5px;
  }

  .arrow {
    width: 16px;
    height: 16px;
    fill: black;
    transition: transform 0.3s ease;
  }

  .arrow.rotate {
    transform: rotate(180deg);
  }

  .options {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background-color: #2a2f3b;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    transition: opacity 0.3s ease;
    z-index: 1;
  }

  .option {
    padding: 12px;
    color: white;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .option:hover {
    background-color: #3a3f4b;
  }
`;

export default DropDownButton;
