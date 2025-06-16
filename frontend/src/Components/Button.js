import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

const Button = ({label , icon_name ,onClick }) => {
  return (
    <StyledWrapper>
      <button onClick={onClick} >
        <span>
          <FontAwesomeIcon icon={icon_name} size="lg" />
          {label}
        </span>
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  button {
    border: 2px solid #24b4fb;
    background-color: transparent;
    border-radius: 0.9em;
    cursor: pointer;
    padding: 0.8em 1.2em 0.8em 1em;
    transition: all ease-in-out 0.2s;
    font-size: 16px;
    height: 60px;
  }

  button span {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px; /* Adds spacing between the icon and text */
    color: #0071e2;
    font-weight: bold;
  }

  button:hover {
    background-color: black;
  }
`;

export default Button;
