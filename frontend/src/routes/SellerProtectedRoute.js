import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import Loader from "../components/Layout/Loader";

const SellerProtectedRoute = ({ children }) => {
  const { isLoading, isSeller, seller } = useSelector((state) => state.seller);
  const location = useLocation();

  if (isLoading === true) {
    return <Loader />;
  } else {
    if (!isSeller) {
      return <Navigate to={`/shop-login`} replace />;
    }
    if (!seller) {
      return <Navigate to={`/shop-login`} replace />;
    }
    
    if (seller.status === "Under Observation") {
        if(location.pathname !== "/shop-approval-pending"){
            return <Navigate to="/shop-approval-pending" replace />;
        }
    } else if (seller.status === "Approved") {
        if(location.pathname === "/shop-approval-pending"){
            return <Navigate to="/dashboard" replace />;
        }
    }
    
    return children;
  }
};

export default SellerProtectedRoute;
