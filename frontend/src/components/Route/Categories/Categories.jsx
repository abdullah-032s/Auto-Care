import React from "react";
import { useNavigate } from "react-router-dom";
import { brandingData, categoriesData } from "../../../static/data";
import styles from "../../../styles/styles";

const Categories = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className={`${styles.section}`}>
        <div
          className={`branding my-12 flex justify-between w-full shadow-sm bg-white p-5 rounded-md overflow-x-auto gap-4`}
        >
          {brandingData &&
            brandingData.map((i, index) => (
              <div className="flex items-start min-w-[200px] sm:min-w-0" key={index}>
                {i.icon}
                <div className="px-3">
                  <h3 className="font-bold text-sm md:text-base text-gray-800">{i.title}</h3>
                  <p className="text-xs md:text-sm text-gray-600">{i.Description}</p>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div
        className={`${styles.section} bg-white p-6 rounded-lg mb-12`}
        id="categories"
      >
        <div className="grid grid-cols-2 gap-[5px] md:grid-cols-2 md:gap-[10px] lg:grid-cols-4 lg:gap-[20px] xl:grid-cols-5 xl:gap-[30px]">
          {categoriesData &&
            categoriesData.map((i) => {
              const handleSubmit = (i) => {
                navigate(`/products?category=${i.title}`);
              };
              return (
                <div
                  className="w-full h-[100px] flex items-center justify-between bg-gray-100 cursor-pointer overflow-hidden rounded-md hover:shadow-md transition-all duration-300"
                  key={i.id}
                  onClick={() => handleSubmit(i)}
                >
                  <h5 className={`text-[17px] font-[500] leading-[1.3] text-gray-800 ml-3`}>{i.title}</h5>
                  <img
                    src={i.image_Url}
                    onError={(e) => {
                      e.currentTarget.src = "/logo192.png";
                    }}
                    className="w-[100px] h-[100px] object-cover"
                    alt={i.title}
                  />
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default Categories;
