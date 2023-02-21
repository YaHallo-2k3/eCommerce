import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Shop from "../pages/Shop";
import Cart from "../pages/Cart";
import ProductDetails from "../pages/ProductDetails";
import Checkout from "../pages/Checkout";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ProtectedRoute from "./ProtectedRoute";
import AddProducts from "../admin/AddProducts";
import AllProducts from "../admin/AllProducts";
import Dashboard from "../admin/Dashboard";
import Orders from "../admin/Orders";
import Users from "../admin/Users";
import Forgot from "../pages/Forgot";
import Categories from "../admin/Categories";
import MyOrders from "../pages/MyOrders";
import MyOrderDetails from "../pages/MyOrderDetails";
import OrderDetails from "../admin/OrderDetails";

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="home" />} />
      <Route path="home" element={<Home />} />
      <Route path="shop" element={<Shop />} />
      <Route path="shop/:id" element={<ProductDetails />} />
      <Route path="/*" element={<ProtectedRoute />}>
        <Route path="myorders" element={<MyOrders />} />
        <Route
          path="myorders/myorderdetails/:id"
          element={<MyOrderDetails />}
        />
        <Route path="orders/orderdetails/:id" element={<OrderDetails />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="dashboard/all-products" element={<AllProducts />} />
        <Route path="dashboard/add-product" element={<AddProducts />} />
        <Route path="dashboard/categories" element={<Categories />} />
        <Route path="dashboard/orders" element={<Orders />} />
        <Route path="dashboard/users" element={<Users />} />
      </Route>
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      <Route path="forgot" element={<Forgot />} />
    </Routes>
  );
};

export default Routers;
