import React from "react";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import DashboardSideBar from "../../components/Shop/Layout/DashboardSideBar";
import DashboardHero from "../../components/Shop/DashboardHero";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
const ShopDashboardPage = () => {
  const navigate = useNavigate();
  const { seller } = useSelector((state) => state.seller);

  const handleLogout = () => {
    axios.get(`${server}/shop/logout`, {
      withCredentials: true,
    });

    window.location.reload();
    navigate("/shop-login");
  }

  if (seller.status !== "Approved") {
    return (
      <div className="w-full p-8">
        <h3 className="text-[22px] font-Poppins pb-2">Account Under Observation</h3>
        <p>Your account is currently under observation. Access to the dashboard is restricted until it's approved by the admin.</p>
        <Link to={'/'}><button className="p-2 border border-black mt-5 hover:bg-black hover:text-white transition-all" onClick={handleLogout}>Logout</button></Link>
      </div>
    );
  }
  return (
    <div>
      <DashboardHeader />
      <div className="flex items-start justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]">
          <DashboardSideBar active={1} />
        </div>
        <DashboardHero />
      </div>
    </div>
  );
};

export default ShopDashboardPage;
