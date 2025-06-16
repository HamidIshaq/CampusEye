import React from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Button from "../Components/Button";
import "../Styling/Admin_Screen.css"
import TwoColumnGrid from "../Components/TwoColumnGrid";
import { useNavigate } from "react-router-dom";

const Admin=()=>{

    const sampleData = [
        { label: "Users" },
        { label: "Cameras" },
        { label: "Notifications" },
        { label: "Others" },
      ];

    const navigate = useNavigate()
    const handleMoveBack = () => {
        navigate('/Home')
    }

    return (
   
            <div className="Admin-container">
                
                
                <TwoColumnGrid data={sampleData} />;
                <Button label="Move Back"  onClick={handleMoveBack}/>
                <Footer />
                

            </div>

    
    )

}

export default Admin;