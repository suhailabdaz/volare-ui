import React from 'react';
import Navbar from '../../../components/user/Home/Homepage/Navbar';
import HeroSection from '../../../components/user/Home/Homepage/HeroSection';
import Banner from '../../../components/user/Home/Homepage/Banner';
import Offers from '../../../components/user/Home/Homepage/Offers';
import About from '../../../components/user/Home/Homepage/About';
import Popular from '../../../components/user/Home/Homepage/Popular';
import Links from '../../../components/user/Home/Homepage/Links';
import Footer from '../../../components/user/Home/Homepage/Footer';
import heroImage from '../../../assets/images/Travel _ trips _ romantic trips _ Lodging.jpeg'

function HomePage() {
  return (
    <>
      <div className="relative h-full">
        <img src={heroImage} alt="" className="absolute inset-0 w-full h-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-black opacity-70 "></div>
        <div className="relative z-10">
          <Navbar />
          <HeroSection />
        </div>
      </div>
      <Banner />
      <Offers />
      <About />
      <Popular />
      <Links />
      <Footer />
    </>
  );
}

export default HomePage;
