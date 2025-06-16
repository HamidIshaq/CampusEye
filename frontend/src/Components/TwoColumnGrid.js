import React from "react";
import styled from "styled-components";

const TwoColumnGrid = ({ data }) => {
  return (
    <GridContainer>
      {data.map((item, index) => (
        <GridItem key={index}>
          <label>{item.label}</label>
        </GridItem>
      ))}
    </GridContainer>
  );
};

// Styled components for layout and design
const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* Two columns */
  gap: 30px; /* Larger spacing between items */
  width: 400px;

  margin: 40px auto;
  padding: 20px;
`;

const GridItem = styled.div`
  background-color:#4a90e2;
  border-radius: 16px;
  height: 100px; /* Larger size */
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold
  font-size: 20px;
  transition: transform 0.3s, background-color 0.3s, box-shadow 0.3s;

  /* Add hover effect */
  &:hover {
    background-color: #357ABD;
    transform: scale(1.05); /* Slight scaling on hover */
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2); /* Elevated shadow */
  }
`;

export default TwoColumnGrid;
