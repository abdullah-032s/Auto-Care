import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/styles";

const DropDown = ({ categoriesData, setDropDown }) => {
  const navigate = useNavigate();
  const submitHandle = (i) => {
    navigate(`/products?category=${i.title}`);
    setDropDown(false);
    window.location.reload();
  };
  return (
    <div className="pb-4 w-[270px] bg-[#6B46C1] absolute z-30 rounded-b-md shadow-lg border border-purple-200 max-h-[350px] overflow-y-scroll">
      {categoriesData &&
        categoriesData.map((i, index) => (
          <div
            key={index}
            className={`${styles.noramlFlex} hover:bg-purple-700 transition-colors cursor-pointer p-2 mx-2 my-1 rounded-md`}
            onClick={() => submitHandle(i)}
          >
            <img
              src={i.image_Url}
              onError={(e) => {
  e.currentTarget.src = "/logo192.png";
              }}
              style={{
                width: "25px",
                height: "25px",
                objectFit: "contain",
                marginLeft: "10px",
                userSelect: "none",
              }}
              alt={i.title}
            />
            <h3 className="m-3 cursor-pointer select-none text-white font-medium hover:text-green-300 transition-colors">{i.title}</h3>
          </div>
        ))}
    </div>
  );
};

export default DropDown;
