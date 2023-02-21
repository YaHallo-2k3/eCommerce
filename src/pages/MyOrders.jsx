import React, { useState } from "react";
import "../styles/cart.css";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/CommonSection";
import { Container, Row, Col } from "reactstrap";
import { motion } from "framer-motion";
import { cartActions } from "../redux/slices/cartSlice";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
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

const Cart = () => {
  const { currentUser } = useAuth();
  const email = currentUser.email;
  const { data: cartsData } = useGetData("myorders");
  const cartItems = cartsData.filter((item) => item.email === email);

  return (
    <Helmet title="My Orders">
      <CommonSection title="My Orders" />
      <section>
        <Container>
          <Row className="justify-content-center">
            <Col lg="9">
              <h2>Order History</h2>
              <h6 className="mt-3 mb-5">
                Open an Order to leave a
                <span className="fw-bold mx-2">Product Review</span>
              </h6>
              {cartItems.length === 0 ? (
                <h2 className="fs-4 text-center">No Item add to the History</h2>
              ) : (
                <table className="table bordered">
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Date</th>
                      <th>Order ID</th>
                      <th>Order Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {cartItems.map((item, index) => (
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
      <td>{item.date}</td>
      <td>
        <Link to={`/myorders/myorderdetails/${item.id}`}>{item.id}</Link>
      </td>
      <td>${item.totalAmount}</td>
      <td>{item.status}</td>
    </tr>
  );
};

export default Cart;
