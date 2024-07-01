import React from 'react'
import Navbar from '../../../components/user/Home/Homepage/Navbar'
import HeroSection from '../../../components/user/Home/Homepage/HeroSection'
import Banner from '../../../components/user/Home/Homepage/Banner'
import Offers from '../../../components/user/Home/Homepage/Offers'
import About from '../../../components/user/Home/Homepage/About'
import Popular from '../../../components/user/Home/Homepage/Popular'
import Links from '../../../components/user/Home/Homepage/Links'
import Footer from '../../../components/user/Home/Homepage/Footer'

function HomePage() {
  return (
    <>
    <Navbar/>
    <HeroSection/>
    <Banner/>
    <Offers/>
    <About/>
    <Popular/>
    <Links/>
    <Footer/>
    </>
  )
}

export default HomePage