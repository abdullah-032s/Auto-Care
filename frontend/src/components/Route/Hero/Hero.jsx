import React from "react";
import { Link } from "react-router-dom";
import styles from "../../../styles/styles";

const Hero = () => {
  return (
    <div
      className={`relative min-h-[70vh] 800px:min-h-[80vh] w-full bg-no-repeat bg-center bg-cover ${styles.noramlFlex}`}
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1727893119356-1702fe921cf9?q=80&w=2050&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
      <div className={`${styles.section} w-[90%] 800px:w-[80%]`}>
        <h1
          className={`text-[30px] leading-[1.2] 800px:text-[55px] text-white font-[600] font-Poppins capitalize relative z-10`}
        >
          Your One-Stop Shop for  <br /> Quality Auto Parts
        </h1>
        <p className="pt-5 text-[16px] font-[Poppins] font-[400] text-white relative z-10">
          Connecting You to a Vast Network of Trusted Auto Parts Vendors, Offering Competitive Prices and Reliable Shipping to Keep Your Vehicle Running Smoothly
        </p>
        <Link to="/products" className="inline-block relative z-10">
          <div className={`${styles.button} mt-5`}>
            <span className="text-[#fff] font-[Poppins] text-[18px]">
              Shop Now
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
