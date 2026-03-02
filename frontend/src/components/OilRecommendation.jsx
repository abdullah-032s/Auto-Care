import axios from 'axios';
import React, { useState } from 'react'
import { server } from '../server';

const OilRecommendation = () => {
  const [engineCC, setEngineCC] = useState('');
  const [mileage, setMileage] = useState('');
  const [recommendations, setRecommendations] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRecommendation = async () => {
    // basic input validation
    const ccNum = Number(engineCC);
    const mileageNum = Number(mileage);
    if (!ccNum || ccNum <= 0 || !mileageNum || mileageNum < 0) {
      setError('Please enter valid Engine CC and Mileage values.');
      setRecommendations(null);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(`${server}/product/oil-recommendations`, { engineCC: ccNum, mileage: mileageNum });
      const { recommended_oil, brand_names } = response.data || {};




      const oilsArr = Array.isArray(recommended_oil)
        ? recommended_oil
        : (typeof recommended_oil === 'string' ? recommended_oil.split('\n').filter(Boolean) : []);
      const brandArr = Array.isArray(brand_names)
        ? brand_names
        : (typeof brand_names === 'string' ? brand_names.split('\n').filter(Boolean) : []);

      setRecommendations({ recommended_oil: oilsArr, brand_names: brandArr });
      setError(null); // Clear any previous error
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError('Error fetching recommendations. Please try again later.');
      setRecommendations(null); // Reset recommendations on error
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`w-11/12 mx-auto pt-5 pb-10 min-h-screen lg:mt-[30px]`} >
      <div className={``}>
        <div className="ml-5">
          <div className="mb-5">
            <h1 className="text-2xl lg:text-4xl text-gray-700 font-bold ">Engine Oil Recommendation</h1>
          </div>

          <div className="flex flex-col mt-2">
            <label className=" text-gray-800 font-semibold text-sm" htmlFor="cc">Enter the Engine CC of your Car</label>
            <input type="number" value={engineCC} onChange={(e) => setEngineCC(e.target.value)} name="cc" id="" className="ring-1 ring-inset ring-gray-400 focus:text-gray-80 focus:ring-0 outline-none h-[40px] rounded-md w-full 370px:w-[300px] lg:w-[600px]" />
          </div>

          <div className="flex flex-col mt-2">
            <label className=" text-gray-800 font-semibold text-sm" htmlFor="cc">Enter the Mileage of your Car</label>
            <input type="number" value={mileage} onChange={(e) => setMileage(e.target.value)} name="cc" id="" className="rounded-md outline-none focus:ring-0 ring-1 ring-inset ring-gray-400 focus:text-gray-800 w-full 370px:w-[300px] lg:w-[600px] h-[40px]" />
          </div>

          <div className="mt-5">
            <button
              onClick={handleRecommendation}
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              className={`inline-block py-1 px-5 rounded-l-md rounded-t-md ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#000] hover:bg-white hover:text-[#000]'} focus:text-[#000] focus:bg-gray-200 text-gray-50 font-bold leading-loose transition duration-200 focus:border focus:border-red-600`}
            >
              {isSubmitting ? 'Loading...' : 'Get Recommendations'}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-5 ml-5 text-red-500">{error}</div>
      )}

      {recommendations && (
        <div className="mt-5 ml-5">
          <h2 className="text-xl font-semibold text-gray-800">Recommended Engine Oil:</h2>
          <ul className="list-disc ml-5 mt-2">
            {recommendations.recommended_oil.length > 0 ? (
              recommendations.recommended_oil.map((oil, index) => (
                <li key={index}>{oil}</li>
              ))
            ) : (
              <li>No recommendation available</li>
            )}
          </ul>
          <h2 className="text-xl font-semibold text-gray-800 mt-5">Brand Names:</h2>
          <ul className="list-disc ml-5 mt-2">
            {recommendations.brand_names.length > 0 ? (
              recommendations.brand_names.map((brand, index) => (
                <li key={index}>{brand}</li>
              ))
            ) : (
              <li>No brands found</li>
            )}
          </ul>
        </div>
      )}




      {/* {
      recommendations &&(
          <div>
            <RecommendedOils viscosityMatch={viscosityMatch} />
          </div>
      )
  } */}
    </div>
  );
};

export default OilRecommendation;
