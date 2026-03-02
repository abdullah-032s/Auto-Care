import React from 'react';
import axios from 'axios';
import { server } from '../../server';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ShopProcessingPage = () => {
    const navigate = useNavigate();

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${server}/shop/logout`, {
                withCredentials: true,
            });
            toast.success(res.data.message);
            navigate("/shop-login");
            window.location.reload(true);
        } catch (error) {
            console.log(error);
        }
    }

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold mb-4">Your shop is under observation</h1>
        <p className="text-lg mb-8">Please wait for admin approval.</p>
        <button 
            className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
            onClick={logoutHandler}
        >
            Logout
        </button>
    </div>
  )
}

export default ShopProcessingPage
