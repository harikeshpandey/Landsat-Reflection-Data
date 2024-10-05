import React from "react";
import './index.css'
import Navbar from "./componenets/Navbar";
import MapView from "./componenets/Map";
import Footer from "./componenets/Footer";
import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import Home from "./pages/Home";

  import Signin from "./pages/Signin";
import Signup from "./pages/SignUp";


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
    
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;