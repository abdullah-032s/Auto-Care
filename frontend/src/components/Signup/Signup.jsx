import React, { useState, useEffect } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import styles from "../../styles/styles";
import { Link, useNavigate } from "react-router-dom";
import { RxAvatar } from "react-icons/rx";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { getErrorMessage } from "../../utils/error";
import { useSelector } from "react-redux";

const Singup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const { isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleFileInputChange = (e) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatar(reader.result);
      }
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    axios
      .post(`${server}/user/create-user`, { name, email, password, avatar })
      .then((res) => {
        toast.success("Registration successful! Logging you in...");
        navigate("/");
        window.location.reload(true);
      })
      .catch((error) => {
        toast.error(getErrorMessage(error));
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[10%] right-[10%] w-[40%] h-[40%] rounded-full bg-gradient-to-bl from-blue-400/20 to-teal-400/20 blur-3xl" />
        <div className="absolute bottom-[20%] left-[5%] w-[50%] h-[50%] rounded-full bg-gradient-to-tr from-indigo-400/20 to-purple-400/20 blur-3xl" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-[1000px] flex flex-row-reverse rounded-3xl overflow-hidden shadow-2xl z-10 bg-white min-h-[600px]">
        
        {/* Right Side: Branding / Graphic */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] relative items-center justify-center p-12 overflow-hidden">
          {/* Abstract geometric shapes */}
          <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-sky-500 rounded-full mix-blend-screen filter blur-2xl opacity-40 animate-blob"></div>
          <div className="absolute bottom-1/3 left-1/4 w-32 h-32 bg-teal-500 rounded-full mix-blend-screen filter blur-2xl opacity-40 animate-blob animation-delay-2000"></div>
          
          <div className="relative z-10 text-white text-center">
            <h1 className="text-4xl font-extrabold tracking-tight mb-4 drop-shadow-md">Join Auto-Care</h1>
            <p className="text-slate-300 text-lg font-medium tracking-wide">
              The ultimate platform for<br/>modern drivers and sellers.
            </p>
            <div className="mt-12 space-y-4 text-left">
              <div className="flex items-center space-x-4 bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 transition hover:bg-white/10">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-sky-500 flex items-center justify-center text-2xl shadow-lg shadow-blue-500/30">
                  🔧
                </div>
                <div>
                  <h4 className="font-semibold text-white">Expert Services</h4>
                  <p className="text-xs text-slate-300 mt-1">Access top-rated mechanics instantly.</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 transition hover:bg-white/10">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-2xl shadow-lg shadow-teal-500/30">
                  🛒
                </div>
                <div>
                  <h4 className="font-semibold text-white">Premium Parts</h4>
                  <p className="text-xs text-slate-300 mt-1">Shop verified parts with ease.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Left Side: Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 sm:p-12 relative bg-white">
          <div className="w-full max-w-md mx-auto">
            <div className="text-center lg:text-left mb-8">
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                Create Account
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Join our community and get started today.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Avatar Upload */}
              <div className="flex justify-center lg:justify-start mb-6">
                <div className="relative group cursor-pointer">
                  <div className="w-20 h-20 rounded-full border-4 border-indigo-50 shadow-md overflow-hidden bg-gray-100 flex items-center justify-center transition-transform group-hover:scale-105">
                    {avatar ? (
                      <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <RxAvatar className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                  <label htmlFor="file-input" className="absolute bottom-0 right-0 w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center text-white cursor-pointer shadow-lg hover:bg-indigo-700 transition-colors border-2 border-white">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    <input type="file" id="file-input" accept=".jpg,.jpeg,.png" onChange={handleFileInputChange} className="sr-only" />
                  </label>
                </div>
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                  Full Name
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="name"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-10 px-3 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all sm:text-sm bg-gray-50/50"
                    placeholder="John Doe"
                  />
                </div>
              </div>

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
                    className="block w-full pl-10 px-3 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all sm:text-sm bg-gray-50/50"
                    placeholder="you@example.com"
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
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all sm:text-sm bg-gray-50/50"
                    placeholder="••••••••"
                  />
                  {visible ? (
                    <AiOutlineEye
                      className="absolute right-3 top-3.5 cursor-pointer text-gray-400 hover:text-indigo-500 transition-colors"
                      size={20}
                      onClick={() => setVisible(false)}
                    />
                  ) : (
                    <AiOutlineEyeInvisible
                      className="absolute right-3 top-3.5 cursor-pointer text-gray-400 hover:text-indigo-500 transition-colors"
                      size={20}
                      onClick={() => setVisible(true)}
                    />
                  )}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  Create Account
                </button>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
                    Sign in here
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

export default Singup;
