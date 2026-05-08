import axios from 'axios';
import React, { useState } from 'react';
import { server } from '../server';

const VEHICLE_TYPES = [
  { id: 'standard', label: 'Standard Petrol', icon: '🚗', desc: 'Regular petrol/gasoline engines' },
  { id: 'turbo', label: 'Turbo Engine', icon: '🏎️', desc: 'Turbocharged petrol & diesel' },
  { id: 'cng', label: 'CNG / LPG', icon: '⛽', desc: 'Compressed natural gas vehicles' },
  { id: 'hot_climate', label: 'Hot Climate', icon: '🌡️', desc: 'Sindh, Balochistan, South Punjab' },
  { id: 'cold_start', label: 'Cold Climate', icon: '❄️', desc: 'Gilgit, Quetta, Murree, Swat' },
  { id: 'hybrid', label: 'Hybrid', icon: '🔋', desc: 'Hybrid electric vehicles' },
  { id: 'motorcycle', label: 'Motorcycle', icon: '🏍️', desc: 'Bikes & scooters' },
  { id: 'ev', label: 'Electric Vehicle', icon: '⚡', desc: 'EV reduction gear fluid' },
];

const OilRecommendation = () => {
  const [engineCC, setEngineCC] = useState('');
  const [mileage, setMileage] = useState('');
  const [vehicleType, setVehicleType] = useState('standard');
  const [recommendations, setRecommendations] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRecommendation = async () => {
    const ccNum = Number(engineCC);
    const mileageNum = Number(mileage);
    if (!ccNum || ccNum <= 0 || !mileageNum || mileageNum < 0) {
      setError('Please enter valid Engine CC and Mileage values.');
      setRecommendations(null);
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const response = await axios.post(`${server}/product/oil-recommendations`, {
        engineCC: ccNum,
        mileage: mileageNum,
        vehicleType,
      });
      setRecommendations(response.data);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError(err?.response?.data?.error || 'Error fetching recommendations. Please try again later.');
      setRecommendations(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedType = VEHICLE_TYPES.find(t => t.id === vehicleType);
  const r = recommendations; // shorthand

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4ff] via-white to-[#ede9fe] py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight flex items-center justify-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-[#6B46C1] to-[#4F46E5] rounded-xl flex items-center justify-center shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </span>
            Oil Recommendation Engine
          </h1>
          <p className="mt-2 text-gray-500 text-sm">
            AI-powered oil recommendation tailored to your vehicle.
          </p>
        </div>

        {/* Compact Form Card */}
        <div className="bg-white rounded-3xl shadow-xl p-6 border border-indigo-50 mb-6">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Left: Vehicle Type */}
            <div className="lg:w-1/2">
              <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                Select Vehicle / Climate Type
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2">
                {VEHICLE_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => { setVehicleType(type.id); setRecommendations(null); }}
                    className={`relative px-3 py-2 rounded-xl border transition-all duration-200 text-left flex items-center gap-2
                      ${vehicleType === type.id
                        ? 'border-[#6B46C1] bg-indigo-50 shadow-sm ring-1 ring-[#6B46C1]'
                        : 'border-gray-200 bg-white hover:border-indigo-300'
                      }`}
                  >
                    <span className="text-xl">{type.icon}</span>
                    <div className="flex-1">
                      <div className={`text-xs font-bold leading-tight ${vehicleType === type.id ? 'text-[#6B46C1]' : 'text-gray-800'}`}>
                        {type.label}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Specs & Submit */}
            <div className="lg:w-1/2 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  Engine Specifications
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1" htmlFor="engineCC">
                      Engine (CC)
                    </label>
                    <input
                      id="engineCC"
                      type="number"
                      value={engineCC}
                      onChange={(e) => setEngineCC(e.target.value)}
                      placeholder={vehicleType === 'motorcycle' ? '125' : vehicleType === 'ev' ? '0' : '1300'}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6B46C1] text-sm bg-gray-50 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1" htmlFor="mileage">
                      Mileage (km)
                    </label>
                    <input
                      id="mileage"
                      type="number"
                      value={mileage}
                      onChange={(e) => setMileage(e.target.value)}
                      placeholder="45000"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6B46C1] text-sm bg-gray-50 transition"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleRecommendation}
                disabled={isSubmitting}
                className={`mt-6 w-full py-3 px-4 rounded-xl font-bold text-white text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-md
                  ${isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#6B46C1] to-[#4F46E5] hover:from-[#553aa0] hover:to-[#3d37cc] hover:shadow-lg active:scale-[0.98]'
                  }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Get Recommendation
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* ============== RESULTS ============== */}
        {r && (
          <div className="mt-8 space-y-6">

            {/* Nearest match notice */}
            {r.match_type !== 'exact' && (
              <div className="flex items-center gap-2 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                <span className="text-amber-500 text-lg">⚠️</span>
                <p className="text-amber-700 text-sm font-medium">
                  No exact match found. Showing the closest recommendation for your engine and mileage.
                </p>
              </div>
            )}

            {/* Oil Grade Card */}
            {r.recommended_oil && r.recommended_oil.length > 0 && (
              <div className="bg-white rounded-3xl shadow-lg border border-indigo-100 overflow-hidden">
                <div className="bg-gradient-to-r from-[#6B46C1] to-[#4F46E5] px-6 py-4 flex items-center gap-3">
                  <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                    <span className="text-white text-xl">🛢️</span>
                  </div>
                  <h2 className="text-white font-bold text-lg">Recommended Oil Grade</h2>
                  {r.match_type !== 'exact' && (
                    <span className="ml-auto px-3 py-1 bg-white/20 text-white rounded-full text-xs font-medium">Nearest Match</span>
                  )}
                </div>
                <div className="p-6">
                  {r.recommended_oil.map((oil, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-indigo-50 rounded-2xl mb-3 last:mb-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#6B46C1] to-[#4F46E5] rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm font-bold">{index + 1}</span>
                      </div>
                      <span className="text-gray-800 font-semibold text-lg">{oil}</span>
                      <span className={`ml-auto px-3 py-1 rounded-full text-sm font-medium ${r.match_type === 'exact' ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-700'}`}>
                        {r.match_type === 'exact' ? 'Best Match' : 'Closest Match'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Why This Oil - Reasoning Card */}
            {r.reason && (
              <div className="bg-white rounded-3xl shadow-lg border border-purple-100 overflow-hidden">
                <div className="bg-gradient-to-r from-[#7C3AED] to-[#A78BFA] px-6 py-4 flex items-center gap-3">
                  <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                    <span className="text-white text-xl">🧠</span>
                  </div>
                  <h2 className="text-white font-bold text-lg">Why This Oil?</h2>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 leading-relaxed">{r.reason}</p>
                </div>
              </div>
            )}

            {/* Technical Specs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* API Spec */}
              {r.api_spec && (
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">📋</span>
                    <h4 className="font-bold text-gray-700 text-sm">API Specification</h4>
                  </div>
                  <p className="text-[#6B46C1] font-bold text-lg">{r.api_spec}</p>
                </div>
              )}

              {/* Oil Capacity */}
              {r.oil_capacity && (
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">🫙</span>
                    <h4 className="font-bold text-gray-700 text-sm">Oil Capacity</h4>
                  </div>
                  <p className="text-[#6B46C1] font-bold text-lg">{r.oil_capacity}</p>
                </div>
              )}

              {/* Change Interval */}
              {r.change_interval && (
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">🔄</span>
                    <h4 className="font-bold text-gray-700 text-sm">Change Interval</h4>
                  </div>
                  <p className="text-[#6B46C1] font-bold text-lg">{r.change_interval.km}</p>
                  <p className="text-gray-500 text-xs mt-1">{r.change_interval.months}</p>
                </div>
              )}
            </div>

            {/* Change Interval Warning */}
            {r.change_interval?.note && (
              <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-2xl">
                <span className="text-orange-500 text-lg mt-0.5">⚠️</span>
                <p className="text-orange-700 text-sm font-medium">{r.change_interval.note}</p>
              </div>
            )}

            {/* Brand Cards */}
            {r.brand_names && r.brand_names.length > 0 && (
              <div className="bg-white rounded-3xl shadow-lg border border-emerald-100 overflow-hidden">
                <div className="bg-gradient-to-r from-[#059669] to-[#10B981] px-6 py-4 flex items-center gap-3">
                  <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                    <span className="text-white text-xl">🏷️</span>
                  </div>
                  <h2 className="text-white font-bold text-lg">Recommended Brands</h2>
                  <span className="ml-auto px-3 py-1 bg-white/20 text-white rounded-full text-xs font-medium">
                    {r.brand_names.length} brands
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-3">
                    {r.brand_names.map((brand, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold rounded-xl text-sm shadow-sm hover:bg-emerald-100 hover:shadow-md transition-all duration-200"
                      >
                        {brand}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Compatible Cars */}
            {r.compatible_cars && r.compatible_cars.length > 0 && (
              <div className="bg-white rounded-3xl shadow-lg border border-sky-100 overflow-hidden">
                <div className="bg-gradient-to-r from-[#0284C7] to-[#38BDF8] px-6 py-4 flex items-center gap-3">
                  <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                    <span className="text-white text-xl">{vehicleType === 'motorcycle' ? '🏍️' : '🚘'}</span>
                  </div>
                  <h2 className="text-white font-bold text-lg">Compatible Vehicles</h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {r.compatible_cars.map((car, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-sky-50 border border-sky-200 rounded-xl">
                        <span className="text-sky-500 text-sm">{vehicleType === 'motorcycle' ? '🏍️' : '🚗'}</span>
                        <span className="text-sky-800 font-medium text-sm">{car}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Special Advisories */}
            {r.special_advisories && r.special_advisories.length > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-3xl p-6 shadow-sm">
                <h3 className="font-bold text-orange-800 text-lg mb-3 flex items-center gap-2">
                  <span className="text-xl">⚠️</span> Special Advisories
                </h3>
                <ul className="space-y-3">
                  {r.special_advisories.map((advisory, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span className="text-orange-900 font-medium">{advisory}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Maintenance Tips */}
            {r.maintenance_tips && r.maintenance_tips.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-3xl p-6 shadow-sm">
                <h3 className="font-bold text-blue-800 text-lg mb-3 flex items-center gap-2">
                  <span className="text-xl">🔧</span> Professional Maintenance Tips
                </h3>
                <ul className="space-y-3">
                  {r.maintenance_tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-blue-900 font-medium">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
};

export default OilRecommendation;
