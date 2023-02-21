import React, { useEffect, useState } from "react";
import useAuth from "../custom-hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import useGetData from "../custom-hooks/useGetData";

const ProtectedRoute = () => {
  const { currentUser } = useAuth();
  // const { data: cartsData } = useGetData("users");
  // const userItems = currentUser
  //   ? cartsData.find((item) => item.id === currentUser.uid)
  //   : "";
  // return currentUser ? (
  //   currentUser && userItems && userItems.authen === "admin" ? (
  //     <Outlet />
  //   ) : (
  //     <Navigate to="/home" />
  //     // console.log(currentUser)
  //   )
  // ) : (
  //   <Navigate to="/login" />
  //   // console.log("dd")
  // );

  return currentUser ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
