import React, { useState, useEffect } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import styles from "../../styles/styles";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { loadSeller } from "../../redux/actions/user";

const ShopLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
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

    await axios
      .post(
        `${server}/shop/login-shop`,
        {
          email,
          password,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Login Success!");
        dispatch(loadSeller());
        navigate("/dashboard");
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-teal-400/20 to-blue-400/20 blur-3xl" />
        <div className="absolute bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-gradient-to-tl from-emerald-400/20 to-cyan-400/20 blur-3xl" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-[1000px] flex rounded-3xl overflow-hidden shadow-2xl z-10 bg-white min-h-[600px]">
        
        {/* Left Side: Branding / Graphic */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#064e3b] via-[#0f766e] to-[#0369a1] relative items-center justify-center p-12 overflow-hidden">
          {/* Abstract glowing orbs */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-emerald-500 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-teal-500 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-32 h-32 bg-cyan-500 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob animation-delay-4000"></div>
          
          <div className="relative z-10 text-white text-center">
            <h1 className="text-5xl font-extrabold tracking-tight mb-4 drop-shadow-md">Seller Portal</h1>
            <p className="text-teal-100 text-lg font-medium tracking-wide">
              Manage your shop,<br/>grow your automotive business.
            </p>
            <div className="mt-12 grid grid-cols-2 gap-4 text-left">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
                <div className="text-2xl mb-2">📈</div>
                <h4 className="font-semibold">Track Sales</h4>
                <p className="text-xs text-teal-100 mt-1">Real-time analytics and order tracking.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
                <div className="text-2xl mb-2">🏪</div>
                <h4 className="font-semibold">Manage Inventory</h4>
                <p className="text-xs text-teal-100 mt-1">Easily update products and services.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 sm:p-12 relative bg-white">
          <div className="w-full max-w-md mx-auto">
            <div className="text-center lg:text-left mb-8">
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                Shop Login
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Enter your credentials to access your dashboard.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                  Email address
                </label>
                <div className="mt-1 relative">
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

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type={visible ? "text" : "password"}
                    name="password"
                    autoComplete="current-password"
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

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="remember-me"
                    id="remember-me"
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded cursor-pointer"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <a href=".forgot-password" className="font-semibold text-teal-600 hover:text-teal-500 transition-colors">
                    Forgot password?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  Sign in to Seller Dashboard
                </button>
              </div>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">New seller?</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <Link
                    to="/shop-create"
                    className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-teal-300 hover:text-teal-600 transition-all"
                  >
                    Register Shop
                  </Link>
                  <Link
                    to="/login"
                    className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-teal-300 hover:text-teal-600 transition-all"
                  >
                    User Login
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopLogin;
