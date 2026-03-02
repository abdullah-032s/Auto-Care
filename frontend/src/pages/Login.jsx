import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Login from "../components/Login/Login.jsx";

const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.user);

  useEffect(() => {
    if(isAuthenticated === true){
      if(user?.role === "Admin"){
        navigate("/admin/dashboard");
      } else {
        navigate("/profile");
      }
    }
  }, [isAuthenticated, user, navigate])
  
  return (
    <div>
        <Login />
    </div>
  )
}

export default LoginPage;