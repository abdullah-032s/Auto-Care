import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { server } from "../../server";
import { AiOutlineCamera } from "react-icons/ai";
import styles from "../../styles/styles";
import axios from "axios";
import { loadSeller } from "../../redux/actions/user";
import { toast } from "react-toastify";
import { getErrorMessage } from "../../utils/error";

const ShopSettings = () => {
  const { seller } = useSelector((state) => state.seller);
  const [avatar, setAvatar] = useState();
  const [name, setName] = useState(seller && seller.name);
  const [description, setDescription] = useState(
    seller && seller.description ? seller.description : ""
  );
  const [address, setAddress] = useState(seller && seller.address);
  const [phoneNumber, setPhoneNumber] = useState(seller && seller.phoneNumber);
  const [zipCode, setZipcode] = useState(seller && seller.zipCode);
  const [paintServiceStatus, setPaintServiceStatus] = useState(seller && seller.paintServiceStatus ? seller.paintServiceStatus : "unavailable");
  const [supportedModels, setSupportedModels] = useState(
    seller && seller.supportedModels
      ? seller.supportedModels.map(m => typeof m === 'string' ? { modelName: m, price: 0 } : m)
      : []
  );
  const [customModelName, setCustomModelName] = useState("");
  const [customModelPrice, setCustomModelPrice] = useState("");
  const [customModelFile, setCustomModelFile] = useState(null);

  // Hardcoded default fallback prices
  const defaultPrices = {
    "Porsche 911": 500, "Toyota Supra": 400, "Toyota Camry": 200, "Toyota Corolla GLI": 150, "Toyota Corolla XLI": 150,
    "Honda Civic Type R": 350, "Honda Accord": 250, "Honda Civic": 200, "Honda City": 150,
    "Kia Sportage": 300, "Hyundai Tucson": 300, "Mercedes S-Class": 600
  };
  const dispatch = useDispatch();

  const handleImage = async (e) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatar(reader.result);
        axios
          .put(
            `${server}/shop/update-shop-avatar`,
            { avatar: reader.result },
            {
              withCredentials: true,
            }
          )
          .then((res) => {
            dispatch(loadSeller());
            toast.success("Avatar updated successfully!");
          })
          .catch((error) => {
            toast.error(getErrorMessage(error));
          });
      }
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  const updateHandler = async (e) => {
    e.preventDefault();

    await axios
      .put(
        `${server}/shop/update-seller-info`,
        {
          name,
          address,
          zipCode,
          phoneNumber,
          description,
          supportedModels,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Shop info updated succesfully!");
        dispatch(loadSeller());
      })
      .catch((error) => {
        toast.error(getErrorMessage(error));
      });
  };

  const handlePaintServiceToggle = async () => {
    const newStatus = paintServiceStatus === "available" ? "unavailable" : "available";
    await axios
      .put(
        `${server}/shop/update-paint-service`,
        { paintServiceStatus: newStatus },
        { withCredentials: true }
      )
      .then((res) => {
        setPaintServiceStatus(newStatus);
        toast.success(`3D Paint Service is now ${newStatus}!`);
        dispatch(loadSeller());
      })
      .catch((error) => {
        toast.error(getErrorMessage(error));
      });
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center">
      <div className="flex w-full 800px:w-[80%] flex-col justify-center my-5">
        <div className="w-full flex items-center justify-center">
          <div className="relative">
            <img
              src={avatar ? avatar : `${seller.avatar?.url}`}
              alt=""
              className="w-[200px] h-[200px] rounded-full cursor-pointer"
            />
            <div className="w-[30px] h-[30px] bg-[#E3E9EE] rounded-full flex items-center justify-center cursor-pointer absolute bottom-[10px] right-[15px]">
              <input
                type="file"
                id="image"
                className="hidden"
                onChange={handleImage}
              />
              <label htmlFor="image">
                <AiOutlineCamera />
              </label>
            </div>
          </div>
        </div>

        {/* shop info */}
        <form
          className="flex flex-col items-center"
          onSubmit={updateHandler}
        >
          <div className="w-[100%] flex items-center flex-col 800px:w-[50%] mt-5">
            <div className="w-full pl-[3%]">
              <label className="block pb-2">Shop Name</label>
            </div>
            <input
              type="name"
              placeholder={`${seller.name}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
              required
            />
          </div>
          <div className="w-[100%] flex items-center flex-col 800px:w-[50%] mt-5">
            <div className="w-full pl-[3%]">
              <label className="block pb-2">Shop description</label>
            </div>
            <input
              type="name"
              placeholder={`${seller?.description
                ? seller.description
                : "Enter your shop description"
                }`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
            />
          </div>
          <div className="w-[100%] flex items-center flex-col 800px:w-[50%] mt-5">
            <div className="w-full pl-[3%]">
              <label className="block pb-2">Shop Address</label>
            </div>
            <input
              type="name"
              placeholder={seller?.address}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
              required
            />
          </div>

          <div className="w-[100%] flex items-center flex-col 800px:w-[50%] mt-5">
            <div className="w-full pl-[3%]">
              <label className="block pb-2">Shop Phone Number</label>
            </div>
            <input
              type="number"
              placeholder={seller?.phoneNumber}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
              required
            />
          </div>

          <div className="w-[100%] flex items-center flex-col 800px:w-[50%] mt-5">
            <div className="w-full pl-[3%]">
              <label className="block pb-2">Shop Zip Code</label>
            </div>
            <input
              type="number"
              placeholder={seller?.zipCode}
              value={zipCode}
              onChange={(e) => setZipcode(e.target.value)}
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
              required
            />
          </div>

          {/* Auto Care 3D Paint Service Toggle */}
          <div className="w-[100%] flex items-center flex-col 800px:w-[50%] mt-5 bg-indigo-50 py-4 rounded-lg border border-indigo-100">
            <div className="w-full px-[5%] flex justify-between items-center">
              <div>
                <label className="block text-indigo-900 font-bold mb-1">3D Paint Service</label>
                <p className="text-xs text-indigo-500">Enable the Auto Care 3D car customizer on your models.</p>
              </div>
              <button
                type="button"
                onClick={handlePaintServiceToggle}
                className={`w-[60px] h-[30px] rounded-full flex items-center px-1 transition-colors duration-300 ${paintServiceStatus === 'available' ? 'bg-indigo-600' : 'bg-gray-300'}`}
              >
                <div className={`w-[22px] h-[22px] bg-white rounded-full transition-transform duration-300 ${paintServiceStatus === 'available' ? 'transform translate-x-[30px]' : ''}`}></div>
              </button>
            </div>
            {paintServiceStatus === 'available' && (
              <div className="w-full px-[5%] mt-4 pt-4 border-t border-indigo-200">
                <label className="block text-indigo-900 font-bold mb-2">Supported 3D Paint Models</label>
                <p className="text-xs text-indigo-500 mb-3">Select predefined models or add custom cars with their paint job prices.</p>

                {/* Predefined Models */}
                <div className="flex gap-2 mb-3">
                  <select
                    className="flex-1 border border-indigo-300 rounded p-2 bg-white text-sm"
                    value={customModelName}
                    onChange={(e) => {
                      setCustomModelName(e.target.value);
                      if (e.target.value) setCustomModelPrice(defaultPrices[e.target.value] || "");
                    }}
                  >
                    <option value="">-- Select predefined model --</option>
                    {Object.keys(defaultPrices).map(model => (
                      <option key={model} value={model} disabled={supportedModels.find(m => m.modelName === model)}>
                        {model} (Default: ${defaultPrices[model]})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Custom Model Input */}
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    placeholder="Custom Model Name"
                    className="flex-1 border border-indigo-300 rounded p-2 text-sm"
                    value={customModelName}
                    onChange={(e) => setCustomModelName(e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Price ($)"
                    className="w-24 border border-indigo-300 rounded p-2 text-sm"
                    value={customModelPrice}
                    onChange={(e) => setCustomModelPrice(e.target.value)}
                  />
                  <div className="relative flex items-center">
                    <input
                      type="file"
                      accept=".glb,.gltf"
                      id="modelUpload"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          if (file.size > 50 * 1024 * 1024) {
                            toast.error("3D Model file is too large! (Limit 50MB)");
                            return;
                          }
                          const reader = new FileReader();
                          reader.onload = () => {
                            setCustomModelFile({
                              name: file.name,
                              data: reader.result
                            });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <label htmlFor="modelUpload" className={`cursor-pointer px-3 py-2 rounded text-sm font-medium border border-dashed transition-colors ${customModelFile ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-400 text-gray-600 hover:bg-gray-50'}`}>
                      {customModelFile ? '✓ ' + customModelFile.name : 'Upload .glb'}
                    </label>
                  </div>
                  <button
                    type="button"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded font-semibold text-sm transition-colors disabled:opacity-50"
                    disabled={!customModelName || !customModelPrice}
                    onClick={() => {
                      if (!supportedModels.find(m => m.modelName === customModelName)) {
                        setSupportedModels([...supportedModels, {
                          modelName: customModelName,
                          price: Number(customModelPrice),
                          modelUrl: customModelFile ? customModelFile.data : null
                        }]);
                      }
                      setCustomModelName("");
                      setCustomModelPrice("");
                      setCustomModelFile(null);
                    }}
                  >
                    Add
                  </button>
                </div>

                {/* List of Supported Models */}
                <div className="flex flex-col gap-2 mb-2 max-h-[300px] overflow-y-auto">
                  {supportedModels.map(model => (
                    <div key={model.modelName} className="flex items-center justify-between bg-white border border-gray-200 p-2 rounded shadow-sm">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-800">{model.modelName}</span>
                        {model.modelUrl && <span className="text-[10px] text-green-600 font-mono overflow-hidden whitespace-nowrap w-24 overflow-ellipsis">Has 3D File</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">$</span>
                        <input
                          type="number"
                          className="w-20 border border-gray-300 rounded p-1 text-sm text-right"
                          value={model.price}
                          onChange={(e) => {
                            setSupportedModels(supportedModels.map(m =>
                              m.modelName === model.modelName ? { ...m, price: Number(e.target.value) } : m
                            ));
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setSupportedModels(supportedModels.filter(m => m.modelName !== model.modelName))}
                          className="bg-red-50 text-red-600 hover:bg-red-100 rounded p-1.5 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                      </div>
                    </div>
                  ))}
                  {supportedModels.length === 0 && <span className="text-sm text-gray-500 italic text-center py-4">No models selected. Add models above.</span>}
                </div>
              </div>
            )}
          </div>

          <div className="w-[100%] flex items-center flex-col 800px:w-[50%] mt-5">
            <input
              type="submit"
              value="Update Shop"
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
              required
              readOnly
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShopSettings;
