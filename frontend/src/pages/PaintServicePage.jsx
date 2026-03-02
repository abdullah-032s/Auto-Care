import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addTocart } from "../redux/actions/cart";
import axios from 'axios';
import { server } from '../server';
import { toast } from 'react-toastify';
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import CarViewer from "../components/3D/CarViewer";
import Loader from "../components/Layout/Loader";

const PaintServicePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { cart } = useSelector((state) => state.cart);

    const [shop, setShop] = useState(null);
    const [selectedModel, setSelectedModel] = useState(null);
    const [selectedColor, setSelectedColor] = useState("#121212");
    const [isLoading, setIsLoading] = useState(true);

    const colorOptions = [
        { name: 'Obsidian Black', hex: '#121212' },
        { name: 'Crimson Red', hex: '#8B0000' },
        { name: 'Midnight Blue', hex: '#191970' },
        { name: 'Emerald Green', hex: '#043927' },
        { name: 'Pearl White', hex: '#F0F8FF' }
    ];

    useEffect(() => {
        axios
            .get(`${server}/shop/get-shop-info/${id}`)
            .then((res) => {
                setShop(res.data.shop);
                setIsLoading(false);
                if (res.data.shop.supportedModels && res.data.shop.supportedModels.length > 0) {
                    setSelectedModel(res.data.shop.supportedModels[0]);
                }
            })
            .catch((error) => {
                console.error(error);
                setIsLoading(false);
                toast.error("Failed to load shop details.");
            });
    }, [id]);

    const handleAddToCart = () => {
        if (!shop || !selectedModel) return;

        const paintServiceItem = {
            _id: `paint-service-${shop._id}-${selectedModel.modelName}`,
            name: `Auto Care 3D Paint: ${selectedModel.modelName} (${colorOptions.find(c => c.hex === selectedColor)?.name || 'Custom Color'})`,
            description: `Satin Obsidian Iridescent Custom Paint Job by ${shop.name}`,
            price: selectedModel.price,
            discountPrice: selectedModel.price,
            shopId: shop._id,
            shop: shop,
            qty: 1,
            stock: 999,
            image_Url: [{ url: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=800" }],
            images: [{ url: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=800" }]
        };

        const isItemExists = cart && cart.find((i) => i._id === paintServiceItem._id);
        if (isItemExists) {
            toast.error("Paint Service already in cart!");
        } else {
            dispatch(addTocart(paintServiceItem));
            toast.success("Paint Service added to cart!");
            navigate("/checkout");
        }
    };

    if (isLoading) {
        return <Loader />;
    }

    const isServiceAvailable = shop && shop.paintServiceStatus === 'available';

    return (
        <div className="min-h-screen bg-gray-50">
            <Header activeHeading={4} />
            <div className="w-11/12 mx-auto mt-10 min-h-[70vh] mb-20 relative z-0">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* 3D Viewer Section */}
                    <div className="w-full lg:w-2/3 shadow-2xl rounded-2xl overflow-hidden border border-gray-200 bg-white">
                        {isServiceAvailable ? (
                            <CarViewer selectedModel={selectedModel} selectedColor={selectedColor} />
                        ) : (
                            <div className="w-full h-[600px] flex flex-col items-center justify-center bg-gray-50 italic text-gray-500 p-8 text-center">
                                <span className="text-4xl mb-4">🚫</span>
                                <h2 className="text-xl font-bold text-gray-800">Service Unavailable</h2>
                                <p className="mt-2">This seller currently does not offer the 3D Paint Service.</p>
                            </div>
                        )}
                    </div>

                    {/* Configuration Section */}
                    <div className="w-full lg:w-1/3 bg-white p-8 rounded-2xl shadow-xl border border-gray-100 flex flex-col">
                        <div className="flex-grow">
                            <div className="mb-4">
                                <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full uppercase tracking-wider mb-2 border border-indigo-100">
                                    {shop ? shop.name : "Studio"}
                                </span>
                                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
                                    Auto Care Showroom
                                </h1>
                                <p className="text-sm text-gray-500 mb-6 border-b pb-4 leading-relaxed">
                                    Experience premium <strong className="text-indigo-600">Satin Obsidian Iridescent</strong> finish mapping in real-time 3D and book your custom paint job today.
                                </p>
                            </div>

                            <div className="mb-8 space-y-6">
                                <div>
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                                        Select Your Canvas
                                    </h3>
                                    <div className="flex flex-col gap-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                                        {shop && shop.supportedModels && shop.supportedModels.length > 0 ? (
                                            shop.supportedModels.map(m => (
                                                <button
                                                    key={m.modelName}
                                                    className={`w-full py-3 px-4 rounded-xl border-2 text-left font-semibold transition-all duration-200 flex justify-between items-center ${selectedModel && selectedModel.modelName === m.modelName
                                                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md transform scale-[1.02]'
                                                        : 'border-gray-100 text-gray-600 hover:border-indigo-300 hover:bg-gray-50'
                                                        }`}
                                                    onClick={() => setSelectedModel(m)}
                                                >
                                                    <span>{m.modelName}</span>
                                                    <div className="flex items-center gap-3">
                                                        <span className={`text-sm ${selectedModel && selectedModel.modelName === m.modelName ? 'text-indigo-700 font-bold' : 'text-green-600'}`}>
                                                            ${m.price}
                                                        </span>
                                                        {selectedModel && selectedModel.modelName === m.modelName && (
                                                            <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                </button>
                                            ))
                                        ) : (
                                            <p className="text-sm text-gray-400 italic">No models currently supported by this shop.</p>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                                        Select Premium Color
                                    </h3>
                                    <div className="flex gap-3">
                                        {colorOptions.map(color => (
                                            <button
                                                key={color.hex}
                                                onClick={() => setSelectedColor(color.hex)}
                                                className={`w-10 h-10 rounded-full shadow-md border-2 transition-transform ${selectedColor === color.hex ? 'border-indigo-500 scale-110' : 'border-transparent hover:scale-105'}`}
                                                style={{ backgroundColor: color.hex }}
                                                title={color.name}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-900 text-white p-5 rounded-xl mb-8 shadow-inner">
                                <h3 className="font-semibold text-indigo-400 text-xs mb-3 uppercase tracking-wider">Applied Finish Specs</h3>
                                <div className="grid grid-cols-2 gap-y-2 text-xs text-gray-300 font-mono">
                                    <div className="flex justify-between pr-2"><span>Base Color:</span> <span className="text-white uppercase">{selectedColor}</span></div>
                                    <div className="flex justify-between pl-2 border-l border-gray-700"><span>Clearcoat:</span> <span className="text-white">1.0</span></div>
                                    <div className="flex justify-between pr-2"><span>Metalness:</span> <span className="text-white">0.9</span></div>
                                    <div className="flex justify-between pl-2 border-l border-gray-700"><span>Iridescence:</span> <span className="text-white">0.2</span></div>
                                </div>
                            </div>
                        </div>

                        <button
                            disabled={!isServiceAvailable || !selectedModel}
                            onClick={handleAddToCart}
                            className="w-full h-[54px] flex justify-center items-center py-2 px-4 shadow-xl border border-transparent text-sm font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest hover:shadow-indigo-500/30 active:scale-95"
                        >
                            {selectedModel ? `Order Paint Job ($${selectedModel.price})` : 'Select a Model'}
                        </button>
                    </div>

                </div>
            </div>
            <Footer />
        </div>
    );
};

export default PaintServicePage;
