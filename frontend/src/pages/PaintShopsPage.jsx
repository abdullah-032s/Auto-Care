import React, { useEffect, useState } from "react";
import axios from "axios";
import { server } from "../server";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import styles from "../styles/styles";
import Loader from "../components/Layout/Loader";
import { Link } from "react-router-dom";

const PaintShopsPage = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios
            .get(`${server}/shop/get-paint-shops`)
            .then((res) => {
                setData(res.data.shops);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setIsLoading(false);
            });
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {isLoading ? (
                <Loader />
            ) : (
                <div className="flex flex-col min-h-screen">
                    <Header activeHeading={8} />
                    <div className="flex-grow pb-16">
                        {/* Hero Section */}
                        <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 text-white mb-16 shadow-xl py-16 px-4">
                            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                            <div className="relative z-10 max-w-5xl mx-auto text-center">
                                <span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 text-indigo-200 text-sm font-semibold tracking-wider mb-4 uppercase shadow-inner">
                                    Premium Service
                                </span>
                                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 drop-shadow-md">
                                    Interactive Auto Care 3D Shops
                                </h1>
                                <p className="text-lg md:text-xl text-indigo-100 max-w-3xl mx-auto font-light leading-relaxed">
                                    Discover elite AutoCare master painters offering our exclusive 3D Car Customizer. Preview their exact work on high-fidelity models and personalize your vehicle's aesthetic before you buy.
                                </p>
                            </div>
                        </div>

                        <div className={`${styles.section}`}>
                            {data && data.length === 0 ? (
                                <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[40vh]">
                                    <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                                        <svg className="w-10 h-10 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-2">No 3D Customizers Found</h2>
                                    <p className="text-gray-500 text-center max-w-md">Our sellers are currently setting up their 3D Paint profiles. Please check back soon!</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                    {data.map((shop) => (
                                        <div key={shop._id} className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-indigo-200 hover:-translate-y-1">
                                            {/* Card Header Background */}
                                            <div className="h-32 bg-gray-200 relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                                                <img
                                                    src="/assets/paint-bg.jpg"
                                                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=800"; }}
                                                    className="w-full h-full object-cover opacity-80 mix-blend-overlay"
                                                    alt="Shop Cover"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
                                            </div>

                                            <div className="flex-grow flex flex-col relative px-6 pt-12 pb-6">
                                                {/* Profile Avatar */}
                                                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                                                    <div className="w-20 h-20 rounded-xl overflow-hidden border-4 border-white shadow-lg bg-white rotate-3 group-hover:rotate-0 transition-transform duration-300">
                                                        <img
                                                            src={`${shop.avatar?.url}`}
                                                            alt={shop.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="text-center mb-4 mt-2">
                                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200">{shop.name}</h3>
                                                    <div className="flex justify-center items-center gap-1 mt-1 text-xs text-green-600 font-medium bg-green-50 w-max mx-auto px-2 py-1 rounded">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                                        Interactive 3D Active
                                                    </div>
                                                </div>

                                                <p className="text-sm text-gray-500 line-clamp-2 mb-6 text-center h-10">
                                                    {shop.description || "Premium auto customization services."}
                                                </p>

                                                <div className="border-t border-gray-100 pt-4 mb-6">
                                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 text-center">Supported Canvases</p>
                                                    {shop.supportedModels && shop.supportedModels.length > 0 ? (
                                                        <div className="flex flex-wrap justify-center gap-1.5 h-[70px] overflow-y-auto custom-scrollbar pr-1">
                                                            {shop.supportedModels.map(model => (
                                                                <span key={model.modelName} className="bg-gray-50 text-gray-700 text-[11px] px-2.5 py-1 rounded-md border border-gray-200 shadow-sm hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200">
                                                                    {model.modelName} <span className="text-green-600 font-semibold">${model.price}</span>
                                                                </span>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center justify-center h-[70px] bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                                            <span className="text-xs text-gray-400 italic">Universal compatibility</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="mt-auto">
                                                    <Link
                                                        to={`/paint-service/${shop._id}`}
                                                        className="block w-full text-center bg-gray-900 hover:bg-indigo-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-indigo-500/30 transform active:scale-95"
                                                    >
                                                        Visit Studio
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <Footer />
                </div>
            )}
        </div>
    );
};

export default PaintShopsPage;
