import React, { useState, useEffect } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import styles from "../../styles/styles";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { RxAvatar } from "react-icons/rx";
import { getErrorMessage } from "../../utils/error";
import { useSelector } from "react-redux";

const ShopCreate = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const { isSeller } = useSelector((state) => state.seller);

  useEffect(() => {
    if (isSeller) {
      navigate("/dashboard");
    }
  }, [isSeller, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    axios
      .post(`${server}/shop/create-shop`, {
        name,
        email,
        password,
        avatar,
        zipCode,
        address,
        phoneNumber,
      })
      .then((res) => {
        toast.success(res.data.message);
        navigate("/shop-login");
        setName("");
        setEmail("");
        setPassword("");
        setAvatar(null);
        setZipCode("");
        setAddress("");
        setPhoneNumber("");
      })
      .catch((error) => {
        toast.error(getErrorMessage(error));
      });
  };

  const handleFileInputChange = (e) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatar(reader.result);
      }
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[10%] right-[10%] w-[40%] h-[40%] rounded-full bg-gradient-to-bl from-teal-400/20 to-blue-400/20 blur-3xl" />
        <div className="absolute bottom-[20%] left-[5%] w-[50%] h-[50%] rounded-full bg-gradient-to-tr from-emerald-400/20 to-cyan-400/20 blur-3xl" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-[1100px] flex flex-row-reverse rounded-3xl overflow-hidden shadow-2xl z-10 bg-white min-h-[700px]">
        
        {/* Right Side: Branding / Graphic */}
        <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-[#022c22] via-[#064e3b] to-[#0f766e] relative items-center justify-center p-12 overflow-hidden">
          {/* Abstract geometric shapes */}
          <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-cyan-500 rounded-full mix-blend-screen filter blur-2xl opacity-30 animate-blob"></div>
          <div className="absolute bottom-1/3 left-1/4 w-32 h-32 bg-emerald-500 rounded-full mix-blend-screen filter blur-2xl opacity-30 animate-blob animation-delay-2000"></div>
          
          <div className="relative z-10 text-white text-center">
            <h1 className="text-4xl font-extrabold tracking-tight mb-4 drop-shadow-md">Partner with Us</h1>
            <p className="text-emerald-100 text-lg font-medium tracking-wide">
              Create your seller account and reach thousands of customers.
            </p>
            <div className="mt-12 space-y-4 text-left">
              <div className="flex items-center space-x-4 bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 transition hover:bg-white/10">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-2xl shadow-lg shadow-teal-500/30">
                  🚀
                </div>
                <div>
                  <h4 className="font-semibold text-white">Fast Setup</h4>
                  <p className="text-xs text-emerald-100 mt-1">Get your shop online in minutes.</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 transition hover:bg-white/10">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/30">
                  💳
                </div>
                <div>
                  <h4 className="font-semibold text-white">Secure Payments</h4>
                  <p className="text-xs text-emerald-100 mt-1">Guaranteed and fast payouts.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Left Side: Form */}
        <div className="w-full lg:w-3/5 flex flex-col justify-center p-8 sm:p-12 relative bg-white">
          <div className="w-full max-w-2xl mx-auto">
            <div className="text-center lg:text-left mb-8">
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                Seller Registration
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Register your business to start selling on Auto-Care.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              
              {/* Avatar Upload (Centered at top of form) */}
              <div className="flex justify-center lg:justify-start mb-6">
                <div className="relative group cursor-pointer">
                  <div className="w-20 h-20 rounded-full border-4 border-teal-50 shadow-md overflow-hidden bg-gray-100 flex items-center justify-center transition-transform group-hover:scale-105">
                    {avatar ? (
                      <img src={avatar} alt="Shop Logo" className="w-full h-full object-cover" />
                    ) : (
                      <RxAvatar className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                  <label htmlFor="file-input" className="absolute bottom-0 right-0 w-7 h-7 bg-teal-600 rounded-full flex items-center justify-center text-white cursor-pointer shadow-lg hover:bg-teal-700 transition-colors border-2 border-white">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    <input type="file" id="file-input" onChange={handleFileInputChange} className="sr-only" />
                  </label>
                </div>
                <div className="ml-4 flex flex-col justify-center">
                  <span className="text-sm font-semibold text-gray-700">Shop Logo</span>
                  <span className="text-xs text-gray-500">Upload your brand logo</span>
                </div>
              </div>

              {/* 2-Column Grid for fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                {/* Shop Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">
                    Shop Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all sm:text-sm bg-gray-50/50"
                    placeholder="Auto Care Pros"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label htmlFor="phone-number" className="block text-sm font-semibold text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="number"
                    name="phone-number"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all sm:text-sm bg-gray-50/50"
                    placeholder="0300 1234567"
                  />
                </div>

                {/* Email Address */}
                <div className="sm:col-span-2">
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                    Email address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      name="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 px-3 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all sm:text-sm bg-gray-50/50"
                      placeholder="shop@example.com"
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all sm:text-sm bg-gray-50/50"
                    placeholder="123 Main St"
                  />
                </div>

                {/* Zip Code */}
                <div>
                  <label htmlFor="zipcode" className="block text-sm font-semibold text-gray-700 mb-1">
                    Zip Code
                  </label>
                  <input
                    type="number"
                    name="zipcode"
                    required
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all sm:text-sm bg-gray-50/50"
                    placeholder="54000"
                  />
                </div>

                {/* Password */}
                <div className="sm:col-span-2">
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                      type={visible ? "text" : "password"}
                      name="password"
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all sm:text-sm bg-gray-50/50"
                      placeholder="••••••••"
                    />
                    {visible ? (
                      <AiOutlineEye
                        className="absolute right-3 top-3.5 cursor-pointer text-gray-400 hover:text-teal-500 transition-colors"
                        size={20}
                        onClick={() => setVisible(false)}
                      />
                    ) : (
                      <AiOutlineEyeInvisible
                        className="absolute right-3 top-3.5 cursor-pointer text-gray-400 hover:text-teal-500 transition-colors"
                        size={20}
                        onClick={() => setVisible(true)}
                      />
                    )}
                  </div>
                </div>

              </div> {/* End Grid */}

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  Register Shop
                </button>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have a seller account?{" "}
                  <Link to="/shop-login" className="font-semibold text-teal-600 hover:text-teal-500 transition-colors">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopCreate;
