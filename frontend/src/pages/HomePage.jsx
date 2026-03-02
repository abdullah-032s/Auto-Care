import React from 'react'
import Header from "../components/Layout/Header";
import Hero from "../components/Route/Hero/Hero";
import Categories from "../components/Route/Categories/Categories";
import BestDeals from "../components/Route/BestDeals/BestDeals";
import FeaturedProduct from "../components/Route/FeaturedProduct/FeaturedProduct";
import Events from "../components/Events/Events";

import Footer from "../components/Layout/Footer";
import { FloatingWhatsApp } from 'react-floating-whatsapp'
const HomePage = () => {
  return (
    <div>
      <Header activeHeading={1} />
      <Hero />
      <Categories />
      <BestDeals />
      <Events />
      <FeaturedProduct />
      {/* <Sponsored /> */}
      <FloatingWhatsApp
        phoneNumber="03026675765"
        avatar="https://avatars.githubusercontent.com/u/130662978?v=4"
        accountName="Auto Care"
      />
      <Footer />

    </div>
  )
}

export default HomePage