import logo from './logo.svg';
import './App.css';
import Login from "./Screens/Login_Screen"
import Home from './Screens/Home_Screen';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import StoreAnomolies from './Screens/StoredAnomoliesScreen';
import Admin from './Screens/Admin_Screen';
import Header from './Components/Header';
import Footer from './Components/Footer';

import React from 'react';
import Dashboard from './Screens/Dashboard';
import AboutPage from './Screens/About';

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const location = useLocation();
  const hideHeaderRoutes = ['/', '/Login'];
  const shouldShowHeader = !hideHeaderRoutes.includes(location.pathname);

  return (
    <div className='parent-container'>
      {shouldShowHeader && <Header />}

      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/Home' element={<Home />} />
        <Route path='/Dashboard' element={<Dashboard />} />
        <Route path='/About' element={<AboutPage />} />
        <Route path='/storedAnomolies' element={<StoreAnomolies />} />
        <Route path='/Admin' element={<Admin />} />
        <Route path='/Login' element={<Login />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default AppWrapper;
