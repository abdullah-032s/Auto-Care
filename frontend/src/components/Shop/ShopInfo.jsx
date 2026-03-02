import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { server } from "../../server";
import styles from "../../styles/styles";
import Loader from "../Layout/Loader";
import { useDispatch, useSelector } from "react-redux";
import { getAllProductsShop } from "../../redux/actions/product";
import { toast } from "react-toastify";

const ShopInfo = ({ isOwner }) => {
  const [data, setData] = useState({});
  const { products } = useSelector((state) => state.products);
  const { seller } = useSelector((state) => state.seller);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate()

  useEffect(() => {
    const fetchId = isOwner ? seller?._id : id;
    if (fetchId) {
      dispatch(getAllProductsShop(fetchId));
      setIsLoading(true);
      axios.get(`${server}/shop/get-shop-info/${fetchId}`).then((res) => {
        setData(res.data.shop);
        setIsLoading(false);
      }).catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
    }
  }, [dispatch, id, isOwner, seller])



  const logoutHandler = async () => {
    axios.get(`${server}/shop/logout`, {
      withCredentials: true,
    });

    window.location.reload();
    navigate("/shop-login");

  };

  const handleMessageAdmin = async () => {
    try {
      const { data } = await axios.get(`${server}/user/admin-id`);
      const adminId = data.adminId;
      const groupTitle = adminId + id;
      const userId = adminId;
      const sellerId = id;

      await axios
        .post(
          `${server}/conversation/create-new-conversation`,
          {
            groupTitle,
            userId,
            sellerId,
          }
        )
        .then((res) => {
          navigate(`/dashboard-messages?${res.data.conversation._id}`);
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    } catch (error) {
      toast.error(error.response.data.message || "Failed to contact admin");
    }
  };


  const totalReviewsLength =
    products &&
    products.reduce((acc, product) => acc + product.reviews.length, 0);

  const totalRatings = products && products.reduce((acc, product) => acc + product.reviews.reduce((sum, review) => sum + review.rating, 0), 0);

  const averageRating = totalRatings / totalReviewsLength || 0;

  return (
    <>
      {
        isLoading ? (
          <Loader />
        ) : (
          <div>
            <div className="w-full py-5">
              <div className="w-full flex item-center justify-center">
                <img
                  src={`${data.avatar?.url}`}
                  alt=""
                  className="w-[150px] h-[150px] object-cover rounded-full"
                />
              </div>
              <h3 className="text-center py-2 text-[20px]">{data.name}</h3>
              <p className="text-[16px] text-[#000000a6] p-[10px] flex items-center">
                {data.description}
              </p>
            </div>
            <div className="p-3">
              <h5 className="font-[600]">Address</h5>
              <h4 className="text-[#000000a6]">{data.address}</h4>
            </div>
            <div className="p-3">
              <h5 className="font-[600]">Phone Number</h5>
              <h4 className="text-[#000000a6]">{data.phoneNumber}</h4>
            </div>
            <div className="p-3">
              <h5 className="font-[600]">Total Products</h5>
              <h4 className="text-[#000000a6]">{products && products.length}</h4>
            </div>
            <div className="p-3">
              <h5 className="font-[600]">Shop Ratings</h5>
              <h4 className="text-[#000000b0]">{averageRating}/5</h4>
            </div>
            <div className="p-3">
              <h5 className="font-[600]">3D Customizer</h5>
              <h4 className="text-[#000000b0]">
                {data?.paintServiceStatus === "available" ? (
                  <span className="text-green-500 font-semibold text-sm">Active & Available</span>
                ) : (
                  <span className="text-red-500 font-semibold text-sm">Unavailable</span>
                )}
              </h4>
            </div>
            <div className="p-3">
              <h5 className="font-[600]">Joined On</h5>
              <h4 className="text-[#000000b0]">{data?.createdAt?.slice(0, 10)}</h4>
            </div>
            {isOwner && (
              <div className="py-3 px-4">
                <Link to="/settings">
                  <div className={`${styles.button} !w-full !h-[42px] !rounded-[5px]`}>
                    <span className="text-white">Edit Shop</span>
                  </div>
                </Link>
                <div className={`${styles.button} !w-full !h-[42px] !rounded-[5px]`}
                  onClick={logoutHandler}
                >
                  <span className="text-white">Log Out</span>
                </div>
                <div className="w-full flex flex-col items-center justify-center mt-5">
                  <h5 className="text-[14px] font-[600] text-[#000000ba] pb-2 text-center">
                    For any query or complaint send message to admin
                  </h5>
                  <div
                    className={`${styles.button} !w-full !h-[42px] !rounded-[5px]`}
                    onClick={handleMessageAdmin}
                  >
                    <span className="text-white">Message Admin</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      }
    </>
  );
};

export default ShopInfo;
