import React from "react";
import "../Styling/Login_Screen.css";
import { useNavigate } from "react-router-dom";
import LoginBox from "../Components/LoginBox";
import Footer from "../Components/Footer";


const Login = () => {

    const navigate = useNavigate()

    const handleLogin = () => {
        navigate('/Home')
    }
    
    return (
        <div>
            <div className="login-container" ><LoginBox onPress={handleLogin} /></div>
            <Footer />
        </div>
    );
};

export default Login;
