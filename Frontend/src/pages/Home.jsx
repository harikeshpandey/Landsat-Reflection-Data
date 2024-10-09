import Navbar from "../componenets/Navbar";
import MapView from "../componenets/Map";
import Footer from "../componenets/Footer";

import React from 'react';

const Home = () => {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Navbar fixed at the top */}
      <div className="z-20">
        <Navbar />
      </div>

      {/* MapView takes up remaining space */}
      <div className="flex-grow z-0">
        <MapView />
      </div>

      {/* Footer fixed at the bottom */}
      <Footer />
    </div>
  );
};

export default Home;
