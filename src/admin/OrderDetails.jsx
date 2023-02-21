import React, { useEffect, useState } from "react";
import "../styles/cart.css";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/CommonSection";
import { Container, Row, Col } from "reactstrap";
import { motion } from "framer-motion";
import { cartActions } from "../redux/slices/cartSlice";
import { useSelector, useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import useGetData from "../custom-hooks/useGetData";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase.config";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { toast } from "react-toastify";
import useAuth from "../custom-hooks/useAuth";

const OrderDetails = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const email = currentUser.email;
  const { data: cartsData } = useGetData("myorders");
  const cartItems = cartsData.filter((item) => item.email === email);
  const productDetails = cartItems.find((item) => item.id === id);

  const cancelOrders = async (e, id) => {
    e.preventDefault();
    await updateDoc(doc(db, "myorders", id), {
      status: "Cancel",
    });
    toast.warn("Orders Is Cancel!");
  };

  return (
    <Helmet title="Order Details">
      <CommonSection title="Order Details" />
      <section>
        <Container>
          <Row className="justify-content-center">
            <Col lg="9">
              <div className="d-flex align-items-center justify-content-between">
                <h2 className="fw-bold">Order Details</h2>
                <Link
                  to="/dashboard/orders"
                  className="d-flex align-items-center gap-1 mx-5"
                >
                  <i className="ri-arrow-left-line"></i>
                  <h6>Back to Orders</h6>
                </Link>
              </div>
              <div className="d-flex justify-content-between my-5">
                <div>
                  <h6 className="">
                    Name:
                    <span className="fw-bold mx-2">
                      {productDetails ? productDetails.name : "loading..."}
                    </span>
                  </h6>
                  <h6 className="mt-3">
                    Phone:
                    <span className="fw-bold mx-2">
                      {productDetails ? productDetails.phone : "loading..."}
                    </span>
                  </h6>
                  <h6 className="mt-3">
                    Mail:
                    <span className="fw-bold mx-2">
                      {productDetails ? productDetails.mail : "loading..."}
                    </span>
                  </h6>
                  <h6 className="mt-3">
                    Address:
                    <span className="fw-bold mx-2">
                      {productDetails ? productDetails.address : "loading..."}
                    </span>
                  </h6>
                </div>
                <div className="mx-5">
                  <h6 className="">
                    Order ID:
                    <span className="fw-bold mx-2">
                      {productDetails ? productDetails.id : "loading..."}
                    </span>
                  </h6>
                  <h6 className="mt-3">
                    Order Amount:
                    <span className="fw-bold mx-2">
                      {productDetails
                        ? `$${productDetails.totalAmount}`
                        : "loading..."}
                    </span>
                  </h6>
                  <h6 className="mt-3 mb-5">
                    Status:
                    <span className="fw-bold mx-2">
                      {productDetails ? productDetails.status : "loading..."}
                    </span>
                  </h6>
                </div>
              </div>
              {cartItems.length === 0 ? (
                <h2 className="fs-4 text-center">No Item add to the History</h2>
              ) : (
                <table className="table bordered">
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Total</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {productDetails.cartItems.map((item, index) => (
                      <Tr item={item} count={index} key={index} />
                    ))}
                  </tbody>
                </table>
              )}
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

const Tr = ({ item, count }) => {
  return (
    <tr>
      <td>{count + 1}</td>
      <td>
        <h6 className="mb-1">{item.productName}</h6>
        <img src={item.imgUrl} alt="" />
      </td>
      <td>${item.price}</td>
      <td>{item.quantity}</td>
      <td>${item.price * item.quantity}</td>
      <td>
        <Link to={`/shop/${item.uid}`} className="btn btn-primary">
          Review Product
        </Link>
      </td>
    </tr>
  );
};

export default OrderDetails;
