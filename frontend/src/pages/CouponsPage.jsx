import React, { useEffect, useState } from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import axios from "axios";
import { server } from "../server";
import { toast } from "react-toastify";
import styles from "../styles/styles";

const CouponsPage = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get(`${server}/coupon/get-all-coupons`)
            .then((res) => {
                setCoupons(res.data.coupons || []);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, []);

    const handleCopy = (code) => {
        navigator.clipboard.writeText(code);
        toast.success(`Coupon "${code}" copied to clipboard!`);
    };

    return (
        <div>
            <Header activeHeading={7} />
            <div className={`${styles.section} py-8`}>
                <div className={`${styles.heading}`}>
                    <h1>Available Coupons</h1>
                </div>

                {loading ? (
                    <div className="w-full flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6B46C1]"></div>
                    </div>
                ) : coupons.length === 0 ? (
                    <div className="w-full flex flex-col items-center justify-center py-20">
                        <div className="text-6xl mb-4">🎟️</div>
                        <h3 className="text-xl font-[600] text-gray-700">
                            No coupons available right now
                        </h3>
                        <p className="text-gray-500 mt-2">
                            Check back later for exciting deals!
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {coupons.map((coupon) => (
                            <div
                                key={coupon._id}
                                className="relative bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300"
                            >
                                {/* Discount badge */}
                                <div className="bg-gradient-to-r from-[#6B46C1] to-[#9333EA] px-4 py-3 flex items-center justify-between">
                                    <span className="text-white font-bold text-2xl">
                                        {coupon.value}% OFF
                                    </span>
                                    <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">
                                        {coupon.shopName}
                                    </span>
                                </div>

                                <div className="p-5">
                                    {/* Coupon code */}
                                    <div className="flex items-center justify-between bg-gray-50 border-2 border-dashed border-[#6B46C1] rounded-lg px-4 py-3 mb-4">
                                        <span className="font-mono font-bold text-lg text-gray-800 tracking-wider">
                                            {coupon.name}
                                        </span>
                                        <button
                                            onClick={() => handleCopy(coupon.name)}
                                            className="bg-[#6B46C1] hover:bg-[#553098] text-white text-sm font-medium px-4 py-2 rounded-md transition-colors duration-200"
                                        >
                                            Copy
                                        </button>
                                    </div>

                                    {/* Min/Max amounts */}
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        {coupon.minAmount && (
                                            <span>Min order: ${coupon.minAmount}</span>
                                        )}
                                        {coupon.maxAmount && (
                                            <span>Max discount: ${coupon.maxAmount}</span>
                                        )}
                                        {!coupon.minAmount && !coupon.maxAmount && (
                                            <span className="text-green-600 font-medium">
                                                No minimum order required!
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default CouponsPage;
