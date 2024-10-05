import Navbar from "../componenets/Navbar";
import MapView from "../componenets/Map";
import Footer from "../componenets/Footer";


import React from 'react'



const Home = () => {
  return (
    <div>
      <div className="relative h-screen w-screen overflow-hidden">
      <div id="map" className="absolute inset-0 z-0">
        <MapView/>
      </div>
      <div className="relative z-10 ">
        <Navbar/>
      </div>
    </div>
      <Footer/>
    </div>
  )
}

export default Home;
