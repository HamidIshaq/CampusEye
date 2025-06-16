import React from "react";
import "../Styling/Header.css";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        navigate('/Login');
    };

    return (
        <div className="Header-Container">
            <label className="app-name">CampusEye</label>

            <div className="nav-links">
                <button onClick={() => navigate('/dashboard')}>Dashboard</button>
                <button onClick={() => navigate('/home')}>Home</button>
                <button onClick={() => navigate('/about')}>About</button>
            </div>

            <button className="logout-button" onClick={handleLogout}>
                Logout
            </button>

            
        </div>
    );
};

export default Header;
